<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" icon color="green">
        <v-icon> mdi-plus-circle </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">질문 추가</span>
      </v-card-title>
      <validation-observer ref="form" v-slot="{ invalid }">
        <v-form @submit.prevent="onSubmit">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <validation-provider
                    rules="required|max:1000"
                    v-slot="{ errors }"
                  >
                    <v-textarea
                      v-model="question"
                      label="question*"
                      required
                      counter="1000"
                      :error-messages="errors"
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="12" sm="6">
                  <validation-provider rules="required" v-slot="{ errors }">
                    <v-select
                      v-model="answerTypeSelect"
                      label="answer type*"
                      required
                      :items="ClubAppAnswerTypes"
                      :error-messages="errors"
                    />
                  </validation-provider>
                </v-col>
                <!--checkbox와 radio-group은 나중에 구현 -->
                <v-col
                  v-if="answerTypeSelect === ClubAppAnswerTypes[2]"
                  cols="12"
                >
                  <v-checkbox label="question*" required />
                </v-col>
                <v-col
                  v-if="answerTypeSelect === ClubAppAnswerTypes[3]"
                  cols="12"
                >
                  <v-radio-group label="question*" required>
                    <v-radio></v-radio>
                  </v-radio-group>
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
              :disabled="invalid"
              color="blue darken-1"
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

export default {
  data: () => ({
    dialog: false,
    ClubAppAnswerTypes: [
      "short_text",
      "long_text",
      //"check_box",
      //"radio_button",
    ],
    question: "",
    answerTypeSelect: "",
  }),
  computed: {
    ...clubsHelper.mapState(["onlineClub"]),
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  methods: {
    ...clubSettingsHelper.mapActions(["pushClubAppQuestions"]),

    async onSubmit() {
      try {
        await this.$refs.form.validate();
        await this.pushClubAppQuestions({
          clubId: this.onlineClub.id,
          question: this.question,
          answer_type: this.answerTypeSelect,
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
