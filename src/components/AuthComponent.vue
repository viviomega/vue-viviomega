<template></template>
<script setup>
import { onMounted, defineEmits } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";

const emit = defineEmits({
  currentUser: {},
});

const router = useRouter();

onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user === null) router.push("/login");
    else emit("currentUser", user);
  });
});
</script>
