<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        :disabled="!me || isMyClubs || isSubmitAppAnswer"
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
              >{{ clubIntroduce.information.name }} 가입 신청서
            </span>
          </v-card-title>
          <v-card-text>
            {{ answers }}
            <v-container>
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
        (myClub) => myClub.id === this.clubIntroduce?.information?.id
      )
        ? true
        : false;
    },

    isSubmitAppAnswer() {
      return this.myAppAnswers.find(
        (myAppAnswer) => myAppAnswer.id === this.clubIntroduce?.information?.id
      )
        ? true
        : false;
    },
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    dialog: false,
    answers: [],
  }),

  methods: {
    ...clubSettingsHelper.mapActions(["pushClubAppAnswers"]),
    async onSubmit() {
      try {
        await this.$refs.form.validate();
        const clubAppAnswers = this.answers.map((answer, index) => ({
          answer,
          answer_type: this.clubAppQuestions[index].answer_type,
          question: this.clubAppQuestions[index].question,
        }));
        const clubId = this.clubIntroduce?.information?.id;
        await this.pushClubAppAnswers({
          clubAppAnswers,
          clubId,
        });
        this.answers = [];
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>
