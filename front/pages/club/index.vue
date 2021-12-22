<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-card rounded="lg" height="700"><ClubAll /></v-card>
      </v-col>
      <v-col cols="8">
        <v-card rounded="lg" height="700"><ClubIntroduce /></v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  async asyncData({ store, app, req }) {
    await store.dispatch("clubs/loadAllClubs");
    if (store.state.users.me) {
      await store.dispatch("clubs/loadMyClubs");
      await store.dispatch("clubs/loadMyAppAnswers");
    }
  },
};
</script>

<style></style>
