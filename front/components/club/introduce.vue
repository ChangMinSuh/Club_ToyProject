<template>
  <v-container v-if="clubIntroduce !== null">
    <v-row>
      <v-col cols="9">
        <v-card-title>{{ clubIntroduce.Club.name }}</v-card-title>
        <v-card-subtitle
          >회장:{{ clubIntroduce.Club.Owner.nickname }} 개설일:
          {{ clubIntroduce.Club.createdAt.slice(0, 10) }}</v-card-subtitle
        >
        <v-card-subtitle
          >"{{ clubIntroduce.Club.explanation }}"</v-card-subtitle
        >
      </v-col>
      <v-col cols="3">
        <v-container>
          <v-row>
            <ClubJoinButton />
          </v-row>
          <v-row>
            <v-btn
              :disabled="!isMyClubs || !me"
              nuxt
              :to="pathJoin('/club/ground/', clubIntroduce.Club.id)"
              >동아리 입장</v-btn
            >
          </v-row>
          <v-row>
            <v-card-text v-if="!me">
              <small> 로그인이 필요합니다. </small>
            </v-card-text>
            <v-card-text v-if="isWaitingAppAnswer">
              <small>동아리 신청중입니다.</small>
            </v-card-text>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row>
      <v-card-text>
        <!-- {{ clubIntroduce.introduce.longExplanation }} -->
      </v-card-text>
    </v-row>
  </v-container>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const clubsHelper = createNamespacedHelpers("clubs");
const usersHelper = createNamespacedHelpers("users");

export default {
  computed: {
    ...clubsHelper.mapState(["clubIntroduce", "myClubs", "myAppAnswers"]),

    ...usersHelper.mapState(["me"]),

    isMyClubs() {
      return this.myClubs.find(
        (myClub) => myClub.id === this.clubIntroduce?.Club?.id
      )
        ? true
        : false;
    },

    isWaitingAppAnswer() {
      return this.myAppAnswers.find(
        (myAppAnswer) => myAppAnswer.ClubId === this.clubIntroduce?.Club?.id
      );
    },
  },
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
