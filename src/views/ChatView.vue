<template>
  <v-container>
    <div class="d-flex justify-end">
      <!-- メッセージ送信 -->
      <v-card class="my-2" width="500" variant="outlined" color="primary">
        <template v-slot:text>
          <v-row>
            <v-col cols="2" class="pb-0 d-flex justify-start">
              <v-avatar color="primary">
                <v-icon v-if="!profileDate.icon">mdi-account</v-icon>
                <v-img v-else :src="profileDate.icon" alt="Icon" cover></v-img>
              </v-avatar>
            </v-col>
            <v-col cols="10" class="d-flex align-center pb-0">{{
              profileDate.name.length > 20
                ? currentUser.substring(0, 20) + "..."
                : profileDate.name
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

    <!-- メッセージ一覧 -->
    <v-card
      class="my-2"
      max-width="500"
      variant="outlined"
      v-for="(item, index) in items"
      :key="index"
      :color="item.uid == currentUser ? 'primary' : ''"
    >
      <template v-slot:text>
        <v-row>
          <v-col cols="2" class="pb-0 justify-start">
            <v-avatar color="primary">
              <v-icon v-if="!item.icon">mdi-account</v-icon>
              <v-img v-else :src="item.icon" alt="Icon" cover></v-img>
            </v-avatar>
          </v-col>
          <v-col cols="10" class="d-flex align-center pb-0">{{
            item.username > 20
              ? item.username.substring(0, 20) + "..."
              : item.username
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
import profileGet from "../plugins/profile";

const message = ref(null);

// 定数
const constant = {
  send: "送信",
};

// チャットデータ
const items = ref(null);

// ログインしているユーザーデータ
const currentUser = ref(null);

const profileDate = reactive({
  name: "",
  birthday: "",
  gender: null,
  pr: "",
  icon: null,
});
const iconImage = ref(null);

onMounted(() => {
  // ログイン情報の取得
  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user != null) {
      currentUser.value = user.uid;
      const data = await profileGet(user.uid);

      profileDate.name = data.name;
      profileDate.birthday = data.birthday;
      profileDate.gender = data.gender;
      profileDate.pr = data.pr;
      profileDate.icon = data.icon;
    } else currentUser.value = null;
  });
  // chatテーブルのDBを自動検知で更新を行う処理
  onValue(databaseRef(rldb, "chat"), (snapshot) => {
    items.value = { ...snapshot.val() };
  });
});

// チャット送信
const writeUserData = async () => {
  const now = new Date();
  await push(databaseRef(rldb, "chat"), {
    uid: currentUser.value,
    username: profileDate.name,
    icon: profileDate.icon,
    text: message.value,
    date: `${now.getFullYear()}/${
      now.getMonth() + 1
    }/${now.getDate()} ${now.getHours()}:${now.getMinutes()}`,
  });

  message.value = null;
};
</script>
