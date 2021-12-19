<template>
  <v-container v-if="clubIntroduce !== null">
    <v-row>
      <v-col cols="9">
        <v-card-title>{{ clubIntroduce.information.name }}</v-card-title>
        <v-card-subtitle
          >회장:{{ clubIntroduce.information.Owner.nickname }} 개설일:
          {{
            clubIntroduce.information.createdAt.slice(0, 10)
          }}</v-card-subtitle
        >
        <v-card-subtitle
          >"{{ clubIntroduce.information.explanation }}"</v-card-subtitle
        >
      </v-col>
      <v-col cols="3">
        <v-card-action>
          <v-container>
            <v-row>
              <ClubJoinButton />
            </v-row>
            <v-row>
              <v-btn
                :disabled="!isMyClubs || !me"
                nuxt
                :to="pathJoin('/club/ground/', clubIntroduce.information.id)"
                >동아리 입장</v-btn
              >
            </v-row>
            <v-row>
              <v-card-text v-if="!me">
                <small> 로그인이 필요합니다. </small>
              </v-card-text>
              <v-card-text v-if="isSubmitAppQuestionAnswer">
                <small>동아리 신청중입니다.</small>
              </v-card-text>
            </v-row>
          </v-container>
        </v-card-action>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row>
      <v-card-text>
        {{ clubIntroduce.introduce.longExplanation }}
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
    ...clubsHelper.mapState([
      "clubIntroduce",
      "myClubs",
      "myAppQuestionAnswers",
    ]),

    ...usersHelper.mapState(["me"]),

    isMyClubs() {
      return this.myClubs.find(
        (myClub) => myClub.id === this.clubIntroduce?.information?.id
      )
        ? true
        : false;
    },

    isSubmitAppQuestionAnswer() {
      return this.myAppQuestionAnswers.find(
        (myAppQuestionAnswer) =>
          myAppQuestionAnswer.id === this.clubIntroduce?.information?.id
      )
        ? true
        : false;
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
