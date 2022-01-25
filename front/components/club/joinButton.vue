<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :disabled="!me || isMyClubs || isWaitingAppAnswer"
        v-bind="attrs"
        v-on="on"
        >동아리 가입</v-btn
      >
    </template>
    <v-card>
      <validation-observer ref="form" v-slot="{ invalid }">
        <v-form @submit.prevent="onSubmit">
          <v-card-title>
            <span class="text-h5"
              >{{ clubIntroduce.Club.name }} 가입 신청서
            </span>
          </v-card-title>
          <v-card-text>
            {{ answers }}
            <v-container>
              <v-row>
                <v-col cols="12">
                  <span class="text-h5"
                    >0. 동아리에서 사용할 닉네임을 적어주세요.</span
                  >
                </v-col>
                <v-col cols="12">
                  <validation-provider
                    rules="required|max:20"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      v-model="nickname"
                      label="question*"
                      required
                      counter="20"
                      :error-messages="errors"
                    />
                  </validation-provider>
                </v-col>
              </v-row>
              <v-row
                v-for="(clubAppQuestion, index) of clubAppQuestions"
                :key="index"
              >
                <v-col cols="12">
                  <span class="text-h5"
                    >{{ index + 1 }}. {{ clubAppQuestion.question }}</span
                  >
                </v-col>
                <v-col cols="12">
                  <validation-provider rules="required" v-slot="{ errors }">
                    <v-text-field
                      v-if="clubAppQuestion.answer_type === 'short_text'"
                      v-model="answers[index]"
                      label="question*"
                      required
                      :error-messages="errors"
                    />
                  </validation-provider>
                  <validation-provider rules="required" v-slot="{ errors }">
                    <v-textarea
                      v-if="clubAppQuestion.answer_type === 'long_text'"
                      label="question*"
                      v-model="answers[index]"
                      counter
                      required
                      :error-messages="errors"
                    />
                  </validation-provider>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Close
            </v-btn>
            <v-btn
              type="submit"
              color="blue darken-1"
              :disabled="invalid"
              text
              @click="dialog = false"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </validation-observer>
    </v-card>
  </v-dialog>
</template>
<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { createNamespacedHelpers } from "vuex";

const clubsHelper = createNamespacedHelpers("clubs");
const clubSettingsHelper = createNamespacedHelpers("clubSettings");
const usersHelper = createNamespacedHelpers("users");
export default {
  computed: {
    ...clubSettingsHelper.mapState(["clubAppQuestions"]),
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
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    dialog: false,
    answers: [],
    nickname: "",
  }),

  methods: {
    ...clubSettingsHelper.mapActions(["pushClubAppAnswers"]),

    async onSubmit() {
      try {
        await this.$refs.form.validate();
        const clubAppAnswerItems = this.answers.map((answer, index) => ({
          answer,
          answer_type: this.clubAppQuestions[index].answer_type,
          question: this.clubAppQuestions[index].question,
        }));
        const clubId = this.clubIntroduce?.Club?.id;
        await this.pushClubAppAnswers({
          nickname: this.nickname,
          clubAppAnswerItems,
          clubId,
        });
        this.answers = [];
        this.$nuxt.refresh();
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>
