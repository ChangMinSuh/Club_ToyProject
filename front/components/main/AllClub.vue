<template>
  <div>
    <v-card-title>전체 동아리</v-card-title>
    <div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn nuxt to="/club/all-wide">전체 보기</v-btn>
      </v-card-actions>
      <v-list>
        <v-list-item-group>
          <template
            v-for="(allClub, index) in allClubsPart(page, MaxClubInPage)"
          >
            <v-divider :key="index" />
            <v-list-item
              :key="allClub.name"
              nuxt
              :to="pathJoin('/club/ground/', allClub.name)"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ allClub.name }}
                </v-list-item-title>

                <v-list-item-subtitle>
                  회장: {{ allClub.Owner.nickname }}
                </v-list-item-subtitle>

                <v-list-item-subtitle>
                  {{ allClub.explanation }}&nbsp;
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-list-item-action-text
                  v-text="allClub.action"
                ></v-list-item-action-text>
              </v-list-item-action>
            </v-list-item>
          </template>
          <v-divider />
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
const usersHelper = createNamespacedHelpers("users");

export default {
  computed: {
    ...clubsHelper.mapState(["allClubs"]),
    ...clubsHelper.mapGetters(["allClubsLength", "allClubsPart"]),

    ...usersHelper.mapState(["me"]),
  },

  data: () => ({
    MaxClubInPage: 5,
    page: 1,
  }),
  methods: {
    pathJoin(...args) {
      return args.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        ""
      );
    },
  },
};
</script>

<style></style>
