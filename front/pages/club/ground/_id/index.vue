<template>
  <v-app>
    <v-main class="grey lighten-3">
      <v-container>
        <v-row>
          <v-col>
            {{ onlineClub.name }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <v-card rounded="lg">
              <ClubSidebar />
            </v-card>
          </v-col>

          <v-col>
            <v-card min-height="70vh" rounded="lg">
              <v-card-text>
                {{ onlineClub.name }}
              </v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">gg</v-col>
                  <v-col cols="6">g</v-col>
                  <v-col cols="6">g</v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <ClubChat />
    </v-main>
  </v-app>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const clubsHelper = createNamespacedHelpers("clubs");
const usersHelper = createNamespacedHelpers("users");

export default {
  middleware: ["isClubMember"],

  async asyncData({ store, params }) {
    const clubId = Number(params.id);
    await store.dispatch("clubChats/loadClubChats", { clubId });
    console.log(store.state.users.me?.ClubMembers);
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
