import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    // ログイン画面
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    // プロフィール画面
    path: "/profile/:id",
    name: "profile",
    component: () => import("../views/ProfileView.vue"),
  },
  {
    // チャット画面
    path: "/chat",
    name: "chat",
    component: () => import("../views/ChatView.vue"),
  },
  {
    // チャット画面
    path: "/chat/room/create",
    name: "room",
    component: () => import("../views/RoomCreate.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
