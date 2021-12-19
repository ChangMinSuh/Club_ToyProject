<template>
  <div>
    <v-card-title>내 동아리</v-card-title>
    <div v-if="!me">
      <v-card-text> 로그인을 해보세요! </v-card-text>
    </div>
    <div v-else>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn nuxt to="/club/create">새 동아리</v-btn>
      </v-card-actions>
      <v-list>
        <v-list-item-group>
          <template v-for="(myClub, index) in myClubsPart(page, MaxClubInPage)">
            <v-divider :key="index" />
            <v-list-item
              :key="myClub.name"
              nuxt
              :to="pathJoin('/club/ground/', myClub.id)"
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ myClub.name }}
                </v-list-item-title>

                <v-list-item-subtitle>
                  회장: {{ myClub.Owner.nickname }}
                </v-list-item-subtitle>

                <v-list-item-subtitle>
                  {{ myClub.explanation }}&nbsp;
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-list-item-action-text
                  v-text="myClub.action"
                ></v-list-item-action-text>

                <v-icon color="grey lighten-1"> mdi-star-outline </v-icon>

                <!-- <v-icon v-else color="yellow darken-3"> mdi-star </v-icon> -->
              </v-list-item-action>
            </v-list-item>
          </template>
          <v-divider />
        </v-list-item-group>
      </v-list>

      <v-pagination
        v-model="page"
        :length="Math.ceil(myClubsLength / MaxClubInPage)"
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
    ...clubsHelper.mapState(["myClubs"]),
    ...clubsHelper.mapGetters(["myClubsLength", "myClubsPart"]),

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
