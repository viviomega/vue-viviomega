<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12" lg="7">
        <v-card elevation="2" class="px-5 py-3">
          <v-card-text>
            <v-tabs v-model="tab">
              <v-tab :value="1">{{ constant.signin }}</v-tab>
              <v-tab :value="2">{{ constant.sinup }}</v-tab>
            </v-tabs>
          </v-card-text>
          <v-window v-model="tab">
            <!-- サインイン -->
            <v-window-item :value="1">
              <v-card-text>
                <v-text-field
                  type="email"
                  :label="constant.email"
                  variant="underlined"
                  class="mb-5"
                ></v-text-field>
                <v-text-field
                  type="password"
                  :label="constant.password"
                  variant="underlined"
                  class="mb-5"
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary">
                  {{ constant.signin }}
                </v-btn>
              </v-card-actions>
            </v-window-item>
            <v-window-item :value="2">
              <v-card-text>
                <v-text-field
                  :label="constant.username"
                  variant="underlined"
                  class="mb-5"
                ></v-text-field>
                <v-text-field
                  type="email"
                  :label="constant.email"
                  variant="underlined"
                  class="mb-5"
                ></v-text-field>
                <v-text-field
                  type="password"
                  :label="constant.password"
                  variant="underlined"
                  class="mb-5"
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary">
                  {{ constant.sinup }}
                </v-btn>
              </v-card-actions>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";

const tab = ref();

// 定数
const constant = {
  email: "Email",
  password: "Password",
  signin: "Sign In",
  sinup: "Sin Up",
  username: "UserName",
  signout: "signOut",
};
</script>
