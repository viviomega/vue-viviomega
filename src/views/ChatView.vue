<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12" lg="10">
        <v-card elevation="2" height="80vh" class="d-flex flex-column px-3">
          <v-card-text>
            <v-list lines="two" v-if="items">
              <v-list-item
                :class="item.uid == currentUser.uid ? 'text-end' : ''"
                style="padding: 0"
                v-for="(item, index) in items"
                :key="index"
                :title="item.username"
                :subtitle="item.text"
              ></v-list-item>
            </v-list>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="mt-5">
            <v-textarea
              v-model="message"
              variant="outlined"
              auto-grow
              rows="1"
              max-rows="3"
              append-icon="mdi-comment-outline"
              @click:append="writeUserData"
            ></v-textarea>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { rldb } from "../firebase";
import { ref as databaseRef, push, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";
import profileGet from "../plugins/profile";

const router = useRouter();

const message = ref(null);

const currentUser = reactive({
  uid: "",
  username: "",
});

// チャットデータ
const items = ref(null);

// チャット送信
const writeUserData = async () => {
  const now = new Date();
  await push(databaseRef(rldb, "chat"), {
    uid: currentUser.uid,
    username: currentUser.username,
    text: message.value,
    date: `${now.getFullYear()}/${
      now.getMonth() + 1
    }/${now.getDate()} ${now.getHours()}:${now.getMinutes()}`,
  });

  message.value = null;
};

onMounted(() => {
  // ログイン情報の取得
  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user != null) {
      const data = await profileGet(user.uid);
      currentUser.uid = user.uid;
      currentUser.username = data.name;
    } else router.push("/login");
    console.log(currentUser);
  });

  // chatテーブルのDBを自動検知で更新を行う処理
  onValue(databaseRef(rldb, "chat"), (snapshot) => {
    items.value = { ...snapshot.val() };
  });
});
</script>
