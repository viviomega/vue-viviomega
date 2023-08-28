<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12" lg="7">
        <v-card elevation="2" class="px-5 py-3">
          <v-card-text>
            <v-tabs v-model="tab">
              <v-tab :value="1">{{ constant.signin }}</v-tab>
              <v-tab :value="2">{{ constant.sinup }}</v-tab>
            </v-tabs>
          </v-card-text>
          <v-window v-model="tab">
            <!-- サインイン -->
            <v-window-item :value="1">
              <v-card-text>
                <v-alert
                  v-if="sininError"
                  title="Sin In Error"
                  :text="sininError"
                  class="mb-5"
                ></v-alert>
                <v-text-field
                  v-model="signinSt.email"
                  type="email"
                  :label="constant.email"
                  variant="underlined"
                  class="mb-3"
                  :error-messages="v$.email.$errors.map((e) => e.$message)"
                  @input="v$.email.$touch"
                  @blur="v$.email.$touch"
                ></v-text-field>
                <v-text-field
                  v-model="signinSt.password"
                  type="password"
                  :label="constant.password"
                  variant="underlined"
                  class="mb-3"
                  :error-messages="v$.password.$errors.map((e) => e.$message)"
                  @input="v$.password.$touch"
                  @blur="v$.password.$touch"
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="primary"
                  :disabled="loading"
                  :loading="loading"
                  @click="signin"
                >
                  {{ constant.signin }}
                </v-btn>
              </v-card-actions>
            </v-window-item>
            <!-- サインアップ -->
            <v-window-item :value="2">
              <v-card-text>
                <v-alert
                  v-if="sinupError"
                  title="Sin Up Error"
                  :text="sinupError"
                  class="mb-5"
                ></v-alert>
                <v-text-field
                  v-model="sinupSt.username"
                  :label="constant.username"
                  variant="underlined"
                  class="mb-3"
                  :error-messages="v2$.username.$errors.map((e) => e.$message)"
                  @input="v2$.username.$touch"
                  @blur="v2$.username.$touch"
                ></v-text-field>
                <v-text-field
                  v-model="sinupSt.email"
                  type="email"
                  :label="constant.email"
                  variant="underlined"
                  class="mb-3"
                  :error-messages="v2$.email.$errors.map((e) => e.$message)"
                  @input="v2$.email.$touch"
                  @blur="v2$.email.$touch"
                ></v-text-field>
                <v-text-field
                  v-model="sinupSt.password"
                  :type="show ? 'text' : 'password'"
                  :label="constant.password"
                  variant="underlined"
                  class="mb-3"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="show = !show"
                  :error-messages="v2$.password.$errors.map((e) => e.$message)"
                  @input="v2$.password.$touch"
                  @blur="v2$.password.$touch"
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  color="primary"
                  :disabled="loading"
                  :loading="loading"
                  @click="sinup"
                >
                  {{ constant.sinup }}
                </v-btn>
              </v-card-actions>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { useVuelidate } from "@vuelidate/core";
import {
  requiredMessage,
  emailMessage,
  minLengthMessage,
} from "../plugins/validatorMessage";

// Builtin
import { email, required, minLength, helpers } from "@vuelidate/validators";

// DB情報をインポート
import { db } from "../firebase";
//  DB登録処理に必要なメソッドをインポート
import { doc, setDoc } from "firebase/firestore";
// ルーティング
import { useRouter } from "vue-router";

const tab = ref();

// 定数
const constant = {
  email: "Email",
  password: "Password",
  signin: "Sign In",
  sinup: "Sin Up",
  username: "UserName",
  signout: "signOut",
};

// Sign Inステータス
const signinSt = reactive({
  email: "",
  password: "",
});

// Sin Upステータス
const sinupSt = reactive({
  username: "",
  email: "",
  password: "",
});

// ログインしているユーザーデータ
const currentUser = ref(null);

const router = useRouter();

const show = ref(false);

// Sign Inエラーメッセージ
const sininError = ref("");

// Sin Upエラーメッセージ
const sinupError = ref("");

// ローディングフラグ
const loading = ref(false);

// Sign In：バリデーションルー
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

// Sin Up：バリデーションルール
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
const v$ = reactive(useVuelidate(rules, signinSt));
const v2$ = reactive(useVuelidate(rules2, sinupSt));

// サインイン処理
const signin = async () => {
  sininError.value = "";
  // バリデーションエラー時は処理を停止
  const isFormCorrect = await v$.value.$validate();
  console.log(isFormCorrect);
  if (!isFormCorrect) return;

  loading.value = true;

  const auth = getAuth();
  signInWithEmailAndPassword(auth, signinSt.email, signinSt.password)
    .then((userCredential) => {
      // 成功時処理
      const user = userCredential.user;
      currentUser.value = user;
      setTimeout(() => router.push("/"), 1500);
    })
    .catch((error) => {
      // 失敗時処理
      const errorCode = error.code;

      if (errorCode === "auth/user-not-found") {
        sininError.value = "登録されていないメールアドレストです";
      } else if (errorCode === "auth/wrong-password") {
        sininError.value = "パスワードが違います";
      }
      setTimeout(() => (loading.value = false), 1500);
    });
};

// サインアップ処理
const sinup = async () => {
  sinupError.value = "";

  // バリデーションエラー時は処理を停止
  const isFormCorrect = await v2$.value.$validate();
  if (!isFormCorrect) return;

  const auth = getAuth();

  loading.value = true;

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
        sinupError.value = "既に登録されているメールアドレスです";
      } else {
        sinupError.value = errorMessage;
      }
      setTimeout(() => (loading.value = false), 1500);
    });
};

// ライフサイクルmounted
onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    // if (user != null) router.push("/");
    if (user != null) currentUser.value = user;
    else currentUser.value = null;
  });
});
</script>
