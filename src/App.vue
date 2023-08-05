<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { firebaseApp } from "./firebase";

//サイトのタイトル
const title = "びびおめがサイト";

// HOMEアイコン
const home = {
  icon: "mdi-home",
  link: "", //今回は設定しない
};

// コピーライト
const copyright = {
  icon: "©",
  date: "2023",
  name: "ViviOmega",
};
</script>
