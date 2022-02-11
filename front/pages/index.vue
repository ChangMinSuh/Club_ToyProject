<template>
  <v-app>
    <v-main class="grey lighten-3">
      <v-container>
        <v-row>
          <v-col cols="6">
            <v-card rounded="lg" height="600"><MainAllClub /></v-card>
          </v-col>
          <v-col cols="6">
            <v-card rounded="lg" height="600"><MainMyClub /></v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-card rounded="lg" height="600"></v-card>
          </v-col>
          <v-col cols="4">
            <v-card rounded="lg" height="600"></v-card>
          </v-col>
          <v-col cols="4">
            <v-card rounded="lg" height="600"></v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  async asyncData({ store, app, req, $axios }) {
    await store.dispatch("clubs/loadAllClubs");
    if (store.state.users.me) {
      await store.dispatch("clubs/loadMyClubs");
    }
  },
};
</script>

<style></style>
