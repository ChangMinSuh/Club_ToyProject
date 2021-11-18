<template>
  <v-app-bar app color="blue lighten-4" flat>
    <v-container class="py-0 fill-height">
      <v-avatar class="mr-10" color="grey darken-1" size="32"></v-avatar>

      <v-btn v-for="(link, idx) in links" :key="idx" text :to="link.url" nuxt>
        {{ link.name }}
      </v-btn>

      <v-spacer></v-spacer>

      <v-responsive max-width="260">
        <v-text-field
          dense
          flat
          hide-details
          rounded
          solo-inverted
        ></v-text-field>
      </v-responsive>
    </v-container>
  </v-app-bar>
</template>

<script>
export default {
  data: () => ({
    links: [
      {
        name: "메인",
        url: "/",
      },
      {
        name: "토론회",
        url: "/board",
      },
    ],
  }),
};
</script>

<style></style>
