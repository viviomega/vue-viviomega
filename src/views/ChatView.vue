<template>
  <v-container>
    <div class="d-flex justify-end">
      <v-card class="my-2" width="500" variant="outlined" color="primary">
        <template v-slot:text>
          <v-row>
            <v-col cols="2" class="pb-0">
              <v-avatar color="surface-variant" class="mx-2"></v-avatar>
            </v-col>
            <v-col cols="10" class="d-flex align-center pb-0">{{
              currentUser
            }}</v-col>
            <v-col cols="2"></v-col>
            <v-col cols="10">
              <v-textarea
                v-model="message"
                variant="underlined"
                rows="3"
              ></v-textarea>
            </v-col>
            <v-col class="text-end" cols="12">
              <v-btn
                elevated
                color="primary"
                prepend-icon="mdi-chat"
                @click="writeUserData"
              >
                {{ constant.send }}
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </v-card>
    </div>

    <v-card
      class="my-2"
      max-width="500"
      variant="outlined"
      v-for="(item, index) in items"
      :key="index"
    >
      <template v-slot:text>
        <v-row>
          <v-col cols="2" class="pb-0">
            <v-avatar color="surface-variant" class="mx-2"></v-avatar>
          </v-col>
          <v-col cols="10" class="d-flex align-center pb-0">{{
            item.username
          }}</v-col>
          <v-col cols="2"></v-col>
          <v-col cols="10">{{ item.text }}</v-col>
          <v-col cols="2"></v-col>
          <v-col class="text-end" cols="10">{{ item.date }}</v-col>
        </v-row>
      </template>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { rldb } from "../firebase";
import { ref as databaseRef, push, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const message = ref(null);

// 定数
const constant = {
  send: "送信",
};

const items = ref(null);

// ログインしているユーザーデータ
const currentUser = ref(null);

onMounted(async () => {
  // ログイン情報の取得
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user != null) currentUser.value = user.uid;
    else currentUser.value = null;
    console.log(currentUser.value);
  });

  onValue(databaseRef(rldb, "chat"), (snapshot) => {
    console.log(snapshot.val());
    items.value = { ...snapshot.val() };
  });
});

// チャット送信
const writeUserData = async () => {
  const now = new Date();
  await push(databaseRef(rldb, "chat"), {
    username: currentUser.value,
    text: message.value,
    date: `${now.getFullYear()}/${
      now.getMonth() + 1
    }/${now.getDate()} ${now.getHours()}:${now.getMinutes()}`,
  });

  message.value = null;
};
</script>
