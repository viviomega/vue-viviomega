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
    <div v-else>個人情報登録画面</div>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";
// Authentication実行に必要なパッケージ
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
// Components
export default defineComponent({
  name: "LoginView",
  data: () => ({
    //パスワードのブラインド切り替え用の値
    show: false,

    // 定数
    constant: {
      email: "メールアドレス",
      password: "パスワード",
      signin: "サインイン",
      sinup: "サインアップ",
    },

    // サインイン/サインアップデータ
    email: "",
    password: "",

    // ログインしているユーザーデータ
    currentUser: "",
  }),
  mounted() {
    const auth = getAuth();
    // ログインしているユーザーを取得する
    onAuthStateChanged(auth, (user) => {
      if (user != null) {
        this.currentUser = user;
      } else {
        this.currentUser = null;
      }
    });
  },
  methods: {
    // サインイン処理
    signin() {
      // メールアドレスとパスワードが入力されているかを確認
      if (this.email == "" || this.email == "") return;
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
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
    },
    // サインアップ処理
    createAccount() {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.password)
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
    },
  },
});
</script>
