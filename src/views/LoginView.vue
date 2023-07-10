<template>
  <v-container>
    <div v-if="currentUser == null">
      <v-card max-width="500" class="mx-auto">
        <v-card-actions>
          <v-row>
            <v-col cols="12" v-if="serverError.text">
              <v-alert
                type="error"
                :title="serverError.title"
                :text="serverError.text"
              ></v-alert>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="state.email"
                :error-messages="v$.email.$errors.map((e) => e.$message)"
                :label="constant.email"
                type="email"
                @input="v$.email.$touch"
                @blur="v$.email.$touch"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="state.password"
                :label="constant.password"
                :type="show ? 'text' : 'password'"
                :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="show = !show"
                :error-messages="v$.password.$errors.map((e) => e.$message)"
                @input="v$.password.$touch"
                @blur="v$.password.$touch"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-btn color="primary" variant="tonal" @click="signin">
                {{ constant.signin }}
              </v-btn>
              <v-btn color="primary" variant="tonal" @click="createAccount">
                {{ constant.sinup }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </div>
    <div v-else>
      <ProfileComponent
        :buttonName="constant.buttonName"
        @submit="createtProfile"
      />

      <!-- 仮設置 -->
      <v-btn
        class="mt-5"
        variant="tonal"
        color="primary"
        block
        @click="signout"
      >
        サインアウト
      </v-btn>
    </div>
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

// Vuelidateパッケージ
import { useVuelidate } from "@vuelidate/core";

import ProfileComponent from "../components/ProfileComponent.vue";

// Builtin
import { email, required, minLength, helpers } from "@vuelidate/validators";
// バリデーションメッセージ
import {
  requiredMessage,
  emailMessage,
  minLengthMessage,
} from "../plugins/validatorMessage";

// DB情報をインポート
import { db } from "../firebase";
//  DB登録処理に必要なメソッドをインポート
import { doc, setDoc } from "firebase/firestore";

//パスワードのブラインド切り替え用の値
const show = ref(false);

// 定数
const constant = {
  email: "メールアドレス",
  password: "パスワード",
  signin: "サインイン",
  sinup: "サインアップ",
  buttonName: "登録",
};

// サインイン/サインアップデータ
const state = reactive({
  email: "",
  password: "",
});

// バリデーションルール
const rules = {
  email: {
    required: helpers.withMessage(requiredMessage("メールアドレス"), required),
    email: helpers.withMessage(emailMessage, email),
  },
  password: {
    required: helpers.withMessage(requiredMessage("パスワード"), required),
    minLengthValue: helpers.withMessage(
      minLengthMessage("パスワード", 8),
      minLength(8)
    ),
  },
};

// モデルにバリデーションを適応
const v$ = useVuelidate(rules, state);

// ログインしているユーザーデータ
const currentUser = ref(null);

// ライフサイクルmounted
onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user != null) currentUser.value = user;
    else currentUser.value = null;
  });
});

// サーバーエラーメッセージ
const serverError = reactive({
  title: "認証エラー",
  text: "",
});

// サインイン処理
const signin = async () => {
  // バリデーションエラー時は処理を停止
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;

  // メールアドレスとパスワードが入力されているかを確認
  if (state.email == "" || state.password == "") return;
  const auth = getAuth();
  signInWithEmailAndPassword(auth, state.email, state.password)
    .then((userCredential) => {
      // 成功時処理
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      // 失敗時処理
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      if (errorCode === "auth/user-not-found") {
        serverError.text = "登録されていないメールアドレストです";
      } else if (errorCode === "auth/wrong-password") {
        serverError.text = "パスワードが違います";
      }
    });
};

// サインアップ処理
const createAccount = async () => {
  // バリデーションエラー時は処理を停止
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;

  const auth = getAuth();
  createUserWithEmailAndPassword(auth, state.email, state.password)
    .then((userCredential) => {
      // 成功時処理
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      // 失敗時処理
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);

      if (errorCode === "auth/email-already-in-use") {
        serverError.text = "既に登録されているメールアドレスです";
      }
    });
};

// TODO:仮設置
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

// PR情報の登録
const createtProfile = async (value) => {
  console.log(value);
  await setDoc(doc(db, "profile", currentUser.value.uid), {
    ...value,
  });
};
</script>
