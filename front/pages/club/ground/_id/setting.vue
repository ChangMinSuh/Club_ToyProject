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
                <v-list-item nuxt :to="mainUrl" link>
                  <v-list-item-content>
                    <v-list-item-title> 메인 </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider />
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
              <ClubSettingBoardUsers />
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
  middleware: ["isClubMember", "isClubManager"],

  async asyncData({ store, params }) {
    const clubId = Number(params.id);
    await store.dispatch("clubs/loadOneClubById", { clubId });
    await store.dispatch("clubChats/loadClubChats", { clubId });
    await store.dispatch("clubSettings/loadClubAppQuestions", { clubId });
    await store.dispatch("clubSettings/findAllUserImpormations", { clubId });
    await store.dispatch("clubSettings/findAllApplicantImpormations", {
      clubId,
    });
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
