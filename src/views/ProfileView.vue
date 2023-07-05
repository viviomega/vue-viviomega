<template>
  <v-container>
    <v-card max-width="500" class="mx-auto">
      <v-card-actions>
        <v-row>
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">
              {{ constant.name }}
            </div>
            <div>{{ state.name }}</div>
          </v-col>
          <v-divider></v-divider>
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">{{ constant.birthday }}</div>
            <div>{{ state.birthday }}</div>
          </v-col>
          <v-divider></v-divider>
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">{{ constant.gender }}</div>
            <div>{{ state.gender }}</div>
          </v-col>
          <v-divider></v-divider>
          <v-col cols="12">
            <div class="text-subtitle-2 mb-2">{{ constant.pr }}</div>
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
import { reactive } from "vue";

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
</script>
