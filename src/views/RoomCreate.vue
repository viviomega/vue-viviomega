<template>
  <auth-component @currentUser="getUser" />
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12" lg="7">
        <v-card elevation="2" class="px-5 py-3">
          <v-card-text>
            <v-text-field
              v-model="state.name"
              :label="constant.name"
              variant="underlined"
              class="mb-3"
            ></v-text-field>
            <v-textarea
              v-model="state.explanation"
              variant="underlined"
              :label="constant.explanation"
              class="mb-3"
            ></v-textarea>
          </v-card-text>
          <v-btn
            color="primary"
            variant="tonal"
            @click="regist"
            :disabled="loading"
            :loading="loading"
            block
          >
            {{ constant.regist }}
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";

// DB情報をインポート
import { db } from "../firebase";
//  DB登録処理に必要なメソッドをインポート
import { collection, addDoc } from "firebase/firestore";

import AuthComponent from "../components/AuthComponent.vue";

import { useVuelidate } from "@vuelidate/core";

import { requiredMessage } from "../plugins/validatorMessage";

// Builtin
import { required, helpers } from "@vuelidate/validators";

// 定数
const constant = {
  name: "Room Name",
  explanation: "Explanation",
  regist: "regist",
};

// 登録データ
const state = reactive({
  name: "",
  explanation: "",
  createUser: "",
  date: "",
});

const rules = {
  name: {
    required: helpers.withMessage(requiredMessage(constant.name), required),
  },
  explanation: {
    required: helpers.withMessage(
      requiredMessage(constant.explanation),
      required
    ),
  },
};

const v$ = reactive(useVuelidate(rules, state));

const currentUser = ref(null);
// ローディングフラグ
const loading = ref(false);

// Room作成
const regist = async () => {
  // バリデーションチェック
  const isFormCorrect = await v$.value.$validate();
  console.log(isFormCorrect);
  if (!isFormCorrect) return;

  loading.value = true;

  // Room作成者設定
  state.createUser = currentUser.value.uid;
  // 作成日時の設定
  const now = new Date();
  state.date = `${now.getFullYear()}/${
    now.getMonth() + 1
  }/${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;

  addDoc(collection(db, "room"), {
    ...state,
  });

  setTimeout(() => (loading.value = false), 1500);
};

const getUser = (value) => {
  currentUser.value = value;
};
</script>
