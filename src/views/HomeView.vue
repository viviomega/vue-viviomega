<template>
  <v-container class="d-flex justify-center my-15">
    <!-- サインイン -->
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-text-field
          style="max-width: 500px"
          density="compact"
          variant="outlined"
          label="Search templates"
          append-inner-icon="mdi-magnify"
          single-line
          hide-details
        ></v-text-field>
      </v-col>
      <v-col cols="12" class="d-flex justify-center">
        <v-card variant="outlined" width="100%" max-width="500">
          <template v-slot:title> {{ insertBox.title }} </template>
          <template v-slot:subtitle> {{ insertBox.date }} </template>
          <template v-slot:text> {{ insertBox.constent }} </template>
          <v-card-actions class="d-flex justify-end">
            <v-btn variant="outlined"> {{ insertBox.insert }} </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" class="d-flex justify-center">
        <v-card variant="outlined" width="100%" max-width="500">
          <template v-slot:title> {{ constentBox.title }} </template>
          <template v-slot:subtitle> {{ constentBox.date }} </template>
          <template v-slot:text> {{ constentBox.constent }} </template>
          <v-card-actions class="d-flex justify-end">
            <v-btn variant="outlined"> {{ constentBox.insert }} </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <!-- サインイン -->
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// ルーティング
import { useRoute, useRouter } from "vue-router";

const insertBox = {
  title: "This is a title",
  date: "YYYY/mm/dd",
  constent: `A new study has found that more and more people are experiencing mental health problems.`,
  insert: "Insert",
};

const constentBox = {
  title: "...",
  date: "...",
  constent: "...",
  insert: "Inspection",
};

// ログインしているユーザーデータ
const currentUser = ref(null);
const router = useRouter();

const tab = ref();

// ライフサイクルmounted
onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    console.log(user);
    if (user === null) router.push("/login");
    else currentUser.value = user;
  });
});
</script>
