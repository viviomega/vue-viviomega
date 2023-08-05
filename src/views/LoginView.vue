<template>
  <v-container class="d-flex justify-center my-15">
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-card variant="outlined" width="500" height="500">
          <v-card-item>
            <v-tabs v-model="tab" align-tabs="start" class="mb-5">
              <v-tab :value="1">{{ constant.signin }}</v-tab>
              <v-tab :value="2">{{ constant.sinup }}</v-tab>
            </v-tabs>

            <v-window v-model="tab">
              <!-- サインイン -->
              <v-window-item :value="1">
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="signinSt.email"
                        :label="constant.email"
                        type="email"
                        variant="outlined"
                        :error-messages="
                          v$.email.$errors.map((e) => e.$message)
                        "
                        @input="v$.email.$touch"
                        @blur="v$.email.$touch"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="signinSt.password"
                        :label="constant.password"
                        type="password"
                        variant="outlined"
                        :error-messages="
                          v$.password.$errors.map((e) => e.$message)
                        "
                        @input="v$.password.$touch"
                        @blur="v$.password.$touch"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-btn variant="outlined" block @click="signin">
                        {{ constant.signin }}
                      </v-btn>
                    </v-col>
                    <v-col cols="12" v-if="currentUser">
                      <v-btn variant="outlined" block @click="signout">
                        {{ constant.signout }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-window-item>
              <!-- サインアップ -->
              <v-window-item :value="2">
                <v-container fluid>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="sinupSt.username"
                        :label="constant.username"
                        variant="outlined"
                        :error-messages="
                          v2$.username.$errors.map((e) => e.$message)
                        "
                        @input="v2$.username.$touch"
                        @blur="v2$.username.$touch"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="sinupSt.email"
                        :label="constant.email"
                        type="email"
                        variant="outlined"
                        :error-messages="
                          v2$.email.$errors.map((e) => e.$message)
                        "
                        @input="v2$.email.$touch"
                        @blur="v2$.email.$touch"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="sinupSt.password"
                        :label="constant.password"
                        type="password"
                        variant="outlined"
                        :error-messages="
                          v2$.password.$errors.map((e) => e.$message)
                        "
                        @input="v2$.password.$touch"
                        @blur="v2$.password.$touch"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-btn
                        variant="outlined"
                        block
                        @click="sinup"
                        :loading="loading"
                      >
                        {{ constant.sinup }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-window-item>
            </v-window>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col cols="12" class="d-flex justify-center">
        <v-card variant="outlined" color="red" width="500" v-if="serverError">
          <v-card-item> {{ serverError }} </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
// Authentication実行に必要なパッケージ
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
// Builtin
import { email, required, minLength, helpers } from "@vuelidate/validators";
// Vuelidateパッケージ
import { useVuelidate } from "@vuelidate/core";
import {
  requiredMessage,
  emailMessage,
  minLengthMessage,
} from "../plugins/validatorMessage";
// DB情報をインポート
import { db } from "../firebase";
//  DB登録処理に必要なメソッドをインポート
import { doc, setDoc } from "firebase/firestore";
// ルーティング
import { useRoute, useRouter } from "vue-router";

// 定数
const constant = {
  email: "Email",
  password: "Password",
  signin: "SignIn",
  sinup: "SinUp",
  username: "UserName",
  signout: "signOut",
};

const tab = ref();

// ログインしているユーザーデータ
const currentUser = ref(null);

// Loginステータス
const signinSt = reactive({
  email: "",
  password: "",
});

// Loginステータス
const sinupSt = reactive({
  username: "",
  email: "",
  password: "",
});

// ローディングフラグ
const loading = ref(false);

// サーバーエラーメッセージ
const serverError = ref();

const router = useRouter();

const rules = {
  email: {
    required: helpers.withMessage(requiredMessage("Email"), required),
    email: helpers.withMessage(emailMessage, email),
  },
  password: {
    required: helpers.withMessage(requiredMessage("Password"), required),
    minLengthValue: helpers.withMessage(
      minLengthMessage("Password", 8),
      minLength(8)
    ),
  },
};

const rules2 = {
  username: {
    required: helpers.withMessage(requiredMessage("UserName"), required),
  },
  email: {
    required: helpers.withMessage(requiredMessage("Email"), required),
    email: helpers.withMessage(emailMessage, email),
  },
  password: {
    required: helpers.withMessage(requiredMessage("Password"), required),
    minLengthValue: helpers.withMessage(
      minLengthMessage("Password", 8),
      minLength(8)
    ),
  },
};

// モデルにバリデーションを適応
const v$ = useVuelidate(rules, signinSt);
const v2$ = useVuelidate(rules2, sinupSt);

// サインイン処理
const signin = async () => {
  // バリデーションエラー時は処理を停止
  const isFormCorrect = await v$.value.$validate();
  console.log(isFormCorrect);
  if (!isFormCorrect) return;

  // メールアドレスとパスワードが入力されているかを確認
  if (signinSt.email == "" || signinSt.password == "") return;
  const auth = getAuth();
  signInWithEmailAndPassword(auth, signinSt.email, signinSt.password)
    .then((userCredential) => {
      // 成功時処理
      const user = userCredential.user;
      currentUser.value = user;
    })
    .catch((error) => {
      // 失敗時処理
      const errorCode = error.code;

      if (errorCode === "auth/user-not-found") {
        serverError.value = "登録されていないメールアドレストです";
      } else if (errorCode === "auth/wrong-password") {
        serverError.value = "パスワードが違います";
      }
    });
};

// サインアップ処理
const sinup = async () => {
  // バリデーションエラー時は処理を停止
  const isFormCorrect = await v2$.value.$validate();
  if (!isFormCorrect) return;

  // ボタンのローディングフラグをtrue
  loading.value = true;

  const auth = getAuth();

  createUserWithEmailAndPassword(auth, sinupSt.email, sinupSt.password)
    .then((userCredential) => {
      // 成功時処理
      const user = userCredential.user;
      setDoc(doc(db, "profile", user.uid), {
        username: sinupSt.username,
      });

      setTimeout(() => router.push("/"), 1500);
    })
    .catch((error) => {
      // 失敗時処理
      const errorCode = error.code;
      const errorMessage = error.message;

      if (errorCode === "auth/email-already-in-use") {
        serverError.value = "既に登録されているメールアドレスです";
      } else {
        serverError.value = errorMessage;
      }
    });
};

// 仮ログアウト処理
const signout = () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      currentUser.value = null;
    })
    .catch((error) => {
      console.log(error);
    });
};

// ライフサイクルmounted
onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user != null) currentUser.value = user;
    else currentUser.value = null;
  });
});
</script>
