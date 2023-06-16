<template>
  <v-app>
    <v-app-bar color="primary">
      <template v-slot:prepend>
        <v-icon aria-hidden="false"> {{ home.icon }} </v-icon>
      </template>
      <template v-slot:title>
        <v-app-bar-title>{{ title }}</v-app-bar-title>
      </template>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
    <v-footer class="d-flex align-center justify-center">
      <div>
        {{ `${copyright.icon}　${copyright.date}　${copyright.name}` }}
      </div>
    </v-footer>
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
