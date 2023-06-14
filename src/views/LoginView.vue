<template>
  <v-container>
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
          <v-btn color="primary" variant="tonal">
            {{ constant.signin }}
          </v-btn>
          <v-btn color="primary" variant="tonal">
            {{ constant.sinup }}
          </v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";

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
  }),
});
</script>
