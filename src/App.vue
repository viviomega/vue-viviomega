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

<script>
export default {
  name: "App",

  data: () => ({
    title: "びびおめがサイト", //サイトのタイトル
    // HOMEアイコン
    home: {
      icon: "mdi-home",
      link: "", //今回は設定しない
    },
    // コピーライトp
    copyright: {
      icon: "©",
      date: "2023",
      name: "ViviOmega",
    },
  }),
};
</script>
