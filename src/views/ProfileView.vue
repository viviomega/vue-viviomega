<template>
  <v-container>
    <v-card max-width="500" class="mx-auto">
      <v-card-actions>
        <v-row>
          <v-col cols="12">
            <div class="text-caption mb-2">
              {{ constant.name }}
            </div>
            <div>{{ state.name }}</div>
          </v-col>
          <v-divider></v-divider>
          <v-col cols="12">
            <div class="text-caption mb-2">{{ constant.birthday }}</div>
            <div>{{ state.birthday }}</div>
          </v-col>
          <v-divider></v-divider>
          <v-col cols="12">
            <div class="text-caption mb-2">{{ constant.gender }}</div>
            <div>{{ state.gender }}</div>
          </v-col>
          <v-divider></v-divider>
          <v-col cols="12">
            <div class="text-caption mb-2">{{ constant.pr }}</div>
            <div>{{ state.pr }}</div>
          </v-col>
          <v-divider></v-divider>
          <v-col cols="12">
            <v-btn variant="tonal" color="primary">
              {{ constant.change }}</v-btn
            >
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

// 定数
const constant = {
  name: "アカウント名",
  birthday: "生年月日",
  gender: "性別",
  pr: "自己PR",
  change: "情報の変更",
};

// プロフィール情報の初期化
const state = reactive({
  name: "",
  birthday: "",
  gender: null,
  pr: "",
});

onMounted(async () => {
  // DBからデータ取得
  const route = useRoute();
  const { id } = route.params;
  const docRef = doc(db, "profile", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    // 成功時の処理
    console.log("Document data:", docSnap.data());

    // プロフィールデータを設定
    state.name = docSnap.data().name;
    state.birthday = docSnap.data().birthday.split("-").join("/");
    state.gender = docSnap.data().gender;
    state.pr = docSnap.data().pr;
  } else {
    // 失敗時の処理
    console.log("No such document!");
  }
});
</script>
