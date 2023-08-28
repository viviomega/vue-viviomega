<template>
  <v-container>
    <v-row class="d-flex justify-center">
      <v-col cols="12" lg="10">
        <v-card elevation="2" height="80vh" class="d-flex flex-column px-3">
          <v-card-text>
            <v-list lines="two">
              <v-list-item
                :class="n % 2 == 1 ? 'text-end' : ''"
                style="padding: 0"
                v-for="n in 3"
                :key="n"
                :title="'Item ' + n"
                subtitle="Lorem ipsum dolor sit amet consectetur adipisicing elit"
              ></v-list-item>
            </v-list>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="mt-5">
            <v-textarea
              variant="outlined"
              auto-grow
              rows="1"
              max-rows="3"
              append-icon="mdi-comment-outline"
            ></v-textarea>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
