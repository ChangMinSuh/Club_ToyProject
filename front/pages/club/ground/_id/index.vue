<template>
  <v-app>
    <v-card-text>
      {{ onlineClub.name }}
    </v-card-text>
  </v-app>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const clubsHelper = createNamespacedHelpers("clubs");
const usersHelper = createNamespacedHelpers("users");

export default {
  layout: "ClubLayout",

  async asyncData({ store, params }) {
    const clubId = Number(params.id);
    await store.dispatch("clubChats/loadClubChatRooms", { clubId });
  },
  computed: {
    ...clubsHelper.mapState(["onlineClub"]),
    ...usersHelper.mapState(["me"]),
  },

  data: () => ({}),
};
</script>

<style>
/* This is for documentation purposes and will not be needed in your application */
</style>
