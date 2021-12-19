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
              <v-list color="transparent">
                <v-list-item v-for="n in 5" :key="n" link>
                  <v-list-item-content>
                    <v-list-item-title> List Item {{ n }} </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider v-if="isManager" />
                <v-list-item v-if="isManager" nuxt append to="setting">
                  <v-list-item-content>
                    <v-list-item-title> 동아리 관리 </v-list-item-title>
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
const usersHelper = createNamespacedHelpers("users");

export default {
  middleware: ["isClubMember"],

  async asyncData({ store, params }) {
    const clubId = Number(params.id);
    await store.dispatch("clubs/loadOneClubById", { clubId });
    await store.dispatch("clubChats/loadClubChats", { clubId });
    console.log(store.state.users.me?.clubManagers.includes(clubId));
    return {
      isManager: store.state.users.me?.clubManagers.includes(clubId),
    };
  },
  computed: {
    ...clubsHelper.mapState(["onlineClub"]),
    ...usersHelper.mapState(["me"]),
  },

  data: () => ({
    links: ["Dashboard", "Messages", "Profile", "Updates"],
  }),
};
</script>

<style>
/* This is for documentation purposes and will not be needed in your application */
</style>
