<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col cols="2">
          <v-card rounded="lg">
            <v-list color="transparent">
              <v-list-item link>
                <v-list-item-content>
                  <v-list-item-title>회원관리</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <v-col>
          <v-card min-height="70vh" rounded="lg">
            <ClubBoardSettingUsers />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const clubsHelper = createNamespacedHelpers("clubs");
const usersHelper = createNamespacedHelpers("users");

export default {
  layout: "ClubLayout",
  middleware: ["isClubManager"],

  async asyncData({ store, params }) {
    const clubId = Number(params.id);
    await Promise.all([
      store.dispatch("clubSettings/loadClubAppQuestions", { clubId }),
      store.dispatch("clubSettings/findAllMembers", { clubId }),
      store.dispatch("clubSettings/findAllAppAnswers", {
        clubId,
        status: "waiting",
      }),
    ]);
    return {
      mainUrl: `/club/ground/${clubId}`,
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
