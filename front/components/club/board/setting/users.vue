<template>
  <v-container>
    <v-card-title>동아리 관리</v-card-title>
    <v-divider> </v-divider>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-header> 가입 질문 </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card-actions>
            <v-spacer></v-spacer>
            <ClubBoardSettingAddQuestionButton v-if="isQuestionChange" />
            <v-btn
              v-if="!isQuestionChange"
              @click="isQuestionChange = !isQuestionChange"
              >질문 수정</v-btn
            >
            <v-btn v-else @click="isQuestionChange = !isQuestionChange"
              >수정 완료</v-btn
            >
          </v-card-actions>
          <v-container>
            <v-row
              v-for="(clubAppQuestion, index) of clubAppQuestions"
              :key="index"
            >
              <v-col cols="1"> 질문 {{ index + 1 }} </v-col>
              <v-col>
                <v-textarea
                  :value="clubAppQuestion.question"
                  label="Solo"
                  rows="1"
                  auto-grow
                  solo
                  :readonly="readOnlyQuestion[index]"
                ></v-textarea>
              </v-col>
              <v-col cols="2" v-if="isQuestionChange">
                <v-card-actions>
                  <v-row v-if="!isUpdatingQuestion">
                    <v-col>
                      <v-btn icon color="blue" @click="updateBtn()">
                        <v-icon> mdi-pencil-circle </v-icon>
                      </v-btn>
                    </v-col>
                    <v-col>
                      <v-btn
                        icon
                        color="red"
                        @click="removeBtn(clubAppQuestion.id)"
                      >
                        <v-icon> mdi-minus-circle </v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row v-else>
                    <v-col>
                      <v-btn icon color="green" @click="updateBtn()">
                        <v-icon> mdi-check-circle </v-icon>
                      </v-btn>
                    </v-col>
                    <v-col>
                      <v-btn
                        icon
                        color="orange"
                        @click="removeBtn(clubAppQuestion.id)"
                      >
                        <v-icon> mdi-refresh-circle </v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-col>
            </v-row>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header> 동아리 멤버 </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-container fluid>
            <v-row>
              <v-col
                v-for="(allMember, index) of allMembers"
                :key="index"
                cols="4"
              >
                <v-list three-line>
                  <template>
                    <v-list-item>
                      <v-list-item-avatar>
                        <v-layout row justify-center>
                          <v-dialog
                            v-model="dialogMember[index]"
                            max-width="500px"
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                color="primary"
                                dark
                                slot="activator"
                                v-bind="attrs"
                                v-on="on"
                              >
                                <v-icon>mdi-account-details</v-icon>
                              </v-btn>
                            </template>
                            <v-card>
                              <v-card-title>
                                <span class="headline">회원 정보</span>
                              </v-card-title>
                              <v-card-text>
                                <v-list>
                                  <v-list-item>
                                    <v-list-item-content>
                                      <v-list-item-title>
                                        이름
                                      </v-list-item-title>
                                      <v-list-item-subtitle>
                                        {{ allMember.nickname }}
                                      </v-list-item-subtitle>
                                    </v-list-item-content>
                                  </v-list-item>
                                  <v-list-item>
                                    <v-list-item-content>
                                      <v-list-item-title>
                                        가입일
                                      </v-list-item-title>
                                      <v-list-item-subtitle>
                                        {{ allMember.createdAt }}
                                      </v-list-item-subtitle>
                                    </v-list-item-content>
                                  </v-list-item>
                                  <v-list-item>
                                    <v-list-item-content>
                                      <v-list-item-title>
                                        직책
                                      </v-list-item-title>
                                      <v-list-item-subtitle>
                                        {{ allMember.role }}
                                      </v-list-item-subtitle>
                                    </v-list-item-content>

                                    <v-list-item-content>
                                      <v-list-item-title>
                                        등급
                                      </v-list-item-title>
                                      <v-list-item-subtitle>
                                        {{ allMember.grade }}
                                      </v-list-item-subtitle>
                                    </v-list-item-content>
                                  </v-list-item>
                                </v-list>
                              </v-card-text>
                              <v-divider></v-divider>
                            </v-card>
                          </v-dialog>
                        </v-layout>
                      </v-list-item-avatar>

                      <v-list-item-content>
                        <v-list-item-title
                          v-html="allMember.nickname"
                        ></v-list-item-title>

                        <v-list-item-subtitle
                          v-html="allMember.role"
                        ></v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </v-list>
              </v-col>
            </v-row>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header> 지원 현황 </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list three-line>
            <template v-for="(allAppAnswer, index) in allAppAnswers">
              <v-list-item :key="index">
                <v-list-item-avatar>
                  <v-layout row justify-center>
                    <v-dialog v-model="dialog" persistent max-width="500px">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          color="primary"
                          dark
                          slot="activator"
                          v-bind="attrs"
                          v-on="on"
                          ><v-icon>mdi-account-details</v-icon></v-btn
                        >
                      </template>
                      <v-card>
                        <v-card-title>
                          <span class="headline"
                            >{{ allAppAnswer.nickname }}의 동아리 지원서</span
                          >
                        </v-card-title>
                        <v-card-text>
                          <v-container>
                            <v-row
                              v-for="(
                                clubAppAnswer, index
                              ) of allAppAnswer.ClubAppAnswerItems"
                              :key="index"
                            >
                              <v-col cols="12">
                                <span class="text-h5"
                                  >{{ index + 1 }}.
                                  {{ clubAppAnswer.question }}</span
                                >
                              </v-col>
                              <v-col cols="12">
                                <v-text-field
                                  v-if="
                                    clubAppAnswer.answer_type === 'short_text'
                                  "
                                  readonly
                                  :value="clubAppAnswer.answer"
                                />

                                <v-textarea
                                  v-if="
                                    clubAppAnswer.answer_type === 'long_text'
                                  "
                                  readonly
                                  :value="clubAppAnswer.answer"
                                />
                              </v-col>

                              <!--checkbox와 radio-group은 나중에 구현 -->
                            </v-row>
                          </v-container>
                          <small>*indicates required field</small>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="blue darken-1"
                            text
                            @click.native="dialog = false"
                            >닫기</v-btn
                          >
                          <v-btn
                            color="blue darken-1"
                            text
                            @click.native="rejectApp"
                            >거절하기</v-btn
                          >
                          <v-btn
                            color="blue darken-1"
                            text
                            @click.native="
                              acceptApp(
                                allAppAnswer.UserId,
                                allAppAnswer.id,
                                allAppAnswer.nickname
                              )
                            "
                            >수락하기</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-layout>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title
                    v-html="allAppAnswer.nickname"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    v-html="allAppAnswer.createdAt"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const clubsHelper = createNamespacedHelpers("clubs");
const clubSettingsHelper = createNamespacedHelpers("clubSettings");

export default {
  data: () => ({
    isQuestionChange: false,
    isUpdatingQuestion: false,
    clubAppQuestionsTmp: [],
    readOnlyQuestion: [],
    dialog: false,
    dialogMember: [],
  }),
  computed: {
    ...clubsHelper.mapState(["onlineClub"]),
    ...clubSettingsHelper.mapState([
      "clubAppQuestions",
      "allMembers",
      "allAppAnswers",
    ]),
  },
  methods: {
    ...clubSettingsHelper.mapActions([
      "updateClubAppQuestions",
      "removeClubAppQuestions",
    ]),
    ...clubsHelper.mapActions(["addUserClubs"]),

    async updateBtn() {
      this.isUpdatingQuestion = true;
    },

    async removeBtn(clubAppQuestionId) {
      try {
        await this.removeClubAppQuestions({
          clubId: this.onlineClub.id,
          clubAppQuestionId,
        });
      } catch (err) {
        console.error(err);
      }
    },

    async rejectApp() {
      try {
      } catch (err) {
        console.error(err);
      }
    },

    async acceptApp(userId, clubAppAnswerId, nickname) {
      try {
        if (confirm("정말 수락하시겠습니까?")) {
          await this.addUserClubs({
            clubId: this.onlineClub.id,
            userId,
            clubAppAnswerId,
            nickname,
          });
          alert("회원이 되었습니다.");
          this.dialog = false;
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>

<style></style>
