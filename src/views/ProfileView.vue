<template>
  <div>
    <v-container v-if="currentUser && docFlg === 'readonly'">
      <v-card max-width="500" class="mx-auto">
        <v-card-actions>
          <v-row>
            <v-col cols="12" class="text-center">
              <v-avatar size="150">
                <v-img :src="state.icon" alt="Icon" cover></v-img>
              </v-avatar>
            </v-col>
            <v-divider></v-divider>
            <v-col cols="12">
              <div class="text-caption mb-2">
                {{ constant.name }}
              </div>
              <div>{{ state.name }}</div>
            </v-col>
            <v-divider></v-divider>
            <v-col cols="12">
              <div class="text-caption mb-2">{{ constant.birthday }}</div>
              <div>{{ state.birthday.split("-").join("/") }}</div>
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
            <v-col cols="12" v-if="currentUser == id">
              <v-btn variant="tonal" color="primary" @click="docFlg = 'edit'">
                {{ constant.change }}</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-container>
    <v-container v-if="currentUser && docFlg === 'edit'">
      <ProfileComponent
        :buttonName="constant.buttonName"
        :profile="state"
        @submit="editProfile"
      />
    </v-container>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { db, storage } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { ref as storageRef, getDownloadURL } from "firebase/storage";

import ProfileComponent from "../components/ProfileComponent.vue";

// 定数
const constant = {
  name: "アカウント名",
  birthday: "生年月日",
  gender: "性別",
  pr: "自己PR",
  change: "情報の変更",
  buttonName: "情報の編集",
};

// プロフィール情報の初期化
const state = reactive({
  name: "",
  birthday: "",
  gender: null,
  pr: "",
  icon: "",
});

// ログインしているユーザーデータ
const currentUser = ref(null);
// 指定されたDocの有無
const docFlg = ref("readonly");

const route = useRoute();
const { id } = route.params;

onMounted(async () => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user != null) currentUser.value = user.uid;
    else currentUser.value = null;
  });

  // DBからデータ取得
  const docRef = doc(db, "profile", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    // 成功時の処理
    console.log("Document data:", docSnap.data());

    // プロフィールデータを設定
    state.name = docSnap.data().name;
    state.birthday = docSnap.data().birthday;
    state.gender = docSnap.data().gender;
    state.pr = docSnap.data().pr;
  } else {
    // 失敗時の処理
    console.log("No such document!", docSnap.exists());
    docFlg.value = docSnap.exists();
  }

  // 画像URL参照
  const spaceRef = storageRef(storage, docSnap.data().icon);
  getDownloadURL(spaceRef)
    .then((url) => {
      state.icon = url;
    })
    .catch((err) => console.log(err));
});

// PR情報の編集
const editProfile = async (value) => {
  console.log(value);
};
</script>
