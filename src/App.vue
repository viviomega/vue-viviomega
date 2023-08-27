<template>
  <v-app>
    <v-app-bar :elevation="5" elevate-on-scroll>
      <v-toolbar-title
        ><v-img :src="logo" max-height="80"></v-img
      ></v-toolbar-title>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { firebaseApp } from "./firebase";
import logo from "@/assets/GitHub.png";

//サイトのタイトル

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
