<template>
  <v-card max-width="500" class="mx-auto">
    <v-card-actions>
      <v-row>
        <!-- アカウント名 -->
        <v-col cols="12">
          <v-text-field
            v-model="state.name"
            :error-messages="v$.name.$errors.map((e) => e.$message)"
            :label="constant.name"
            @input="v$.name.$touch"
            @blur="v$.name.$touch"
          >
          </v-text-field>
        </v-col>
        <!-- 生年月日 -->
        <v-col cols="12">
          <v-text-field
            v-model="state.birthday"
            :label="constant.birthday"
            :error-messages="v$.birthday.$errors.map((e) => e.$message)"
            type="date"
            @input="v$.birthday.$touch"
            @blur="v$.birthday.$touch"
          >
          </v-text-field>
        </v-col>
        <!-- 性別 -->
        <v-col cols="12">
          <v-select
            v-model="state.gender"
            :items="constant.genderList"
            :label="constant.gender"
            required
            :error-messages="v$.gender.$errors.map((e) => e.$message)"
            @change="v$.gender.$touch"
            @blur="v$.gender.$touch"
          ></v-select>
        </v-col>
        <!-- 自己PR -->
        <v-col cols="12">
          <v-textarea
            v-model="state.pr"
            :label="constant.pr"
            :error-messages="v$.pr.$errors.map((e) => e.$message)"
            @input="v$.pr.$touch"
            @blur="v$.pr.$touch"
          ></v-textarea>
        </v-col>
        <v-col cols="12">
          <v-btn
            variant="tonal"
            color="primary"
            block
            @click="submit"
            type="submit"
            >{{ buttonName }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>
<script setup>
import { reactive, defineProps, defineEmits } from "vue";

// Vuelidateパッケージ
import { useVuelidate } from "@vuelidate/core";
// Builtin
import { required, maxLength, helpers } from "@vuelidate/validators";

import { requiredMessage, maxLengthMessage } from "../plugins/validatorMessage";

// 定数
const constant = {
  name: "アカウント名",
  birthday: "生年月日",
  gender: "性別",
  genderList: ["男性", "女性"],
  pr: "自己PR",
};

// プロパティの初期化
const props = defineProps({
  profile: {
    type: Object,
    require: false,
    default: () => ({
      name: "",
      birthday: "",
      gender: null,
      pr: "",
    }),
  },
  buttonName: {
    type: String,
    require: false,
    default: () => "",
  },
  //
});

// emitの初期化
const emit = defineEmits({
  submit: {
    name: "",
    birthday: "",
    gender: null,
    pr: "",
  },
});

// プロパティの値を受け取りリアクティブ宣言
const state = reactive({
  ...props.profile,
});

// バリデーションルール
const rules = {
  name: {
    required: helpers.withMessage(requiredMessage("アカウント名"), required),
  },
  birthday: {
    required: helpers.withMessage(requiredMessage("生年月日"), required),
  },
  gender: {
    required: helpers.withMessage(requiredMessage("性別"), required),
  },
  pr: {
    maxLengthValue: helpers.withMessage(
      maxLengthMessage("自己PR", 200),
      maxLength(200)
    ),
  },
};

// モデルにバリデーションを適応
const v$ = useVuelidate(rules, state);

// ボタンの処理
const submit = async () => {
  // バリデーションエラー時は処理を停止
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;

  emit("submit", state);
};
</script>
