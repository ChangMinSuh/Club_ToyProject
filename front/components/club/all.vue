<template>
  <div>
    <div>
      <v-list>
        <v-list-item-group>
          <template
            v-for="(allClub, index) in allClubsPart(page, MaxClubInPage)"
          >
            <v-list-item
              :key="allClub.name"
              @click="showClubIntroduce(allClub)"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ allClub.name }}
                </v-list-item-title>

                <v-list-item-subtitle>
                  회장: {{ allClub.Owner.nickname }}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-list-item-action-text
                  v-text="allClub.action"
                ></v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
            <v-divider :key="index" />
          </template>
        </v-list-item-group>
      </v-list>

      <v-pagination
        v-model="page"
        :length="Math.ceil(allClubsLength / MaxClubInPage)"
        circle
      />
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const clubsHelper = createNamespacedHelpers("clubs");
const clubSettingsHelper = createNamespacedHelpers("clubSettings");
const usersHelper = createNamespacedHelpers("users");

export default {
  computed: {
    ...clubsHelper.mapState(["allClubs", "clubIntroduce"]),
    ...clubsHelper.mapGetters(["allClubsLength", "allClubsPart"]),

    ...usersHelper.mapState(["me"]),
  },

  data: () => ({
    MaxClubInPage: 10,
    page: 1,
  }),
  methods: {
    ...clubsHelper.mapActions(["getClubIntroduce"]),
    ...clubSettingsHelper.mapActions(["loadClubAppQuestions"]),

    async showClubIntroduce(allClub) {
      console.log("allclub:", allClub);
      await this.getClubIntroduce(allClub);
      await this.loadClubAppQuestions({
        clubId: this.clubIntroduce?.information?.id,
      });
    },
  },
};
</script>

<style></style>
