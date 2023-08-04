<template>
  <div>
    <v-container v-if="currentUser && docFlg === 'readonly'">
      <v-card max-width="500" class="mx-auto">
        <v-card-actions>
          <v-row>
            <v-col cols="12" class="text-center">
              <v-avatar
                v-if="state.icon"
                size="150"
                style="cursor: pointer"
                @click="dialog = true"
              >
                <v-img :src="state.icon" alt="Icon" cover></v-img>
              </v-avatar>
              <v-avatar
                v-else
                size="150"
                style="cursor: pointer"
                @click="dialog = true"
              >
                <v-icon size="150">mdi-account</v-icon>
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

    <!-- アイコン画像の登録と編集 -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-text>
          <v-alert
            v-if="iconError.flg"
            width="100%"
            type="error"
            :title="iconError.title"
            :text="iconError.text"
          ></v-alert>
        </v-card-text>

        <v-card-text class="text-center">
          <v-avatar
            v-if="iconFile"
            size="150"
            style="cursor: pointer"
            @click="dialog = true"
          >
            <v-img :src="previewURL" alt="previIcon" cover></v-img>
          </v-avatar>
        </v-card-text>

        <v-card-text>
          <v-file-input
            v-model="iconFile"
            :label="constant.icon"
            accept=".jpg,.png"
            @change="uploadFile"
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="addIcon">登録</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { db, storage } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import {
  uploadBytes,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
import ProfileComponent from "../components/ProfileComponent.vue";

// 定数
const constant = {
  name: "アカウント名",
  birthday: "生年月日",
  gender: "性別",
  pr: "自己PR",
  change: "情報の変更",
  buttonName: "情報の編集",
  icon: "アイコン画像",
};

// プロフィール情報の初期化
const state = reactive({
  name: "",
  birthday: "",
  gender: null,
  pr: "",
  icon: null,
});

// ログインしているユーザーデータ
const currentUser = ref(null);
// 指定されたDocの有無
const docFlg = ref("readonly");

const route = useRoute();
const { id } = route.params;

// ダイアログフラグ
const dialog = ref(false);

// 画像指定エラーフラグ
const iconError = reactive({
  flg: false,
  title: "添付ファイルエラー",
  text: "",
});

// プレビューURL
const previewURL = ref();
const iconFile = ref();

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
    state.icon = docSnap.data().icon;
  } else {
    // 失敗時の処理
    console.log("No such document!", docSnap.exists());
    docFlg.value = docSnap.exists();
  }
});

// PR情報の編集
const editProfile = async (value) => {
  console.log(value);
};

// アイコン画像の登録
const addIcon = async () => {
  iconError.flg = false;

  if (iconFile.value[0] == null) {
    iconError.title = "添付ファイルエラー";
    iconError.text = "ファイルを設定してください";
    iconError.flg = true;
    return;
  }

  const fileExtension = iconFile.value[0].name.substr(-3);
  const iconName = `icon/${currentUser.value}_icon.${fileExtension}`;

  // 画像をストレージに保存
  const imageRef = storageRef(storage, iconName);

  await uploadBytes(imageRef, iconFile.value[0]).then((snapshot) => {
    console.log("Uploaded a blob or file!");
  });

  getDownloadURL(imageRef)
    .then(async (url) => {
      // アイコン情報を更新
      const washingtonRef = doc(db, "profile", currentUser.value);
      await updateDoc(washingtonRef, {
        icon: url,
      });
    })
    .catch((err) => console.log(err));

  dialog.value = false;
};

// アイコン画像のプレビュー
const uploadFile = () => {
  previewURL.value = URL.createObjectURL(iconFile.value[0]);
  console.log(previewURL.value);
};
</script>
