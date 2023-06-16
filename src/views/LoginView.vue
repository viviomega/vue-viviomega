<template>
  <v-container>
    <div v-if="currentUser == null">
      <v-card max-width="500" class="mx-auto">
        <v-card-actions>
          <v-col>
            <v-text-field v-model="email" :label="constant.email" type="email">
            </v-text-field>
            <v-text-field
              v-model="password"
              :label="constant.password"
              :type="show ? 'text' : 'password'"
              :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="show = !show"
            >
            </v-text-field>
            <v-btn color="primary" variant="tonal" @click="signin">
              {{ constant.signin }}
            </v-btn>
            <v-btn color="primary" variant="tonal" @click="createAccount">
              {{ constant.sinup }}
            </v-btn>
          </v-col>
        </v-card-actions>
      </v-card>
    </div>
    <div v-else>
      個人情報登録画面
      <v-btn variant="tonal" color="primary" block @click="signout">
        サインアウト
      </v-btn>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
// Authentication実行に必要なパッケージ
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

//パスワードのブラインド切り替え用の値
const show = ref(false);

// 定数
const constant = {
  email: "メールアドレス",
  password: "パスワード",
  signin: "サインイン",
  sinup: "サインアップ",
};

// サインイン/サインアップデータ
const email = ref("");
const password = ref("");

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

// サインイン処理
const signin = () => {
  // メールアドレスとパスワードが入力されているかを確認
  if (email.value == "" || password.value == "") return;
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email.value, password.value)
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
    });
};

// サインアップ処理
const createAccount = () => {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email.value, password.value)
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
</script>
