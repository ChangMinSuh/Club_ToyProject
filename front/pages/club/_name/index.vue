<template>
  <v-app>
    <v-main class="grey lighten-3">
      <v-container>
        <v-row>
          {{ onlineClub.name }}
        </v-row>
        <v-row>
          <v-col cols="2">
            <v-card rounded="lg">
              <v-list color="transparent">
                <v-list-item v-for="n in 5" :key="n" link>
                  <v-list-item-content>
                    <v-list-item-title> List Item {{ n }} </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>

          <v-col>
            <v-card min-height="70vh" rounded="lg">
              <!--  -->
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

export default {
  async asyncData({ store, params }) {
    const clubName = params.name;
    await store.dispatch("clubs/loadOneClubByName", { clubName });
    await store.dispatch("clubChats/loadClubChats", { clubName });
    return;
  },
  computed: {
    ...clubsHelper.mapState(["onlineClub"]),
  },

  data: () => ({
    links: ["Dashboard", "Messages", "Profile", "Updates"],
  }),
};
</script>

<style>
/* This is for documentation purposes and will not be needed in your application */
</style>
