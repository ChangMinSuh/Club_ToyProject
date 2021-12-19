export const state = () => ({
  clubAppQuestions: [], //지원서 질문
  allMemberImpormations: [], // 동아리 멤버
  allApplicantImpormations: [], // 지원서
});

export const getters = {};
export const mutations = {
  setClubAppQuestions(state, payload) {
    state.clubAppQuestions = payload;
  },

  pushClubAppQuestions(state, payload) {
    state.clubAppQuestions.push(payload);
  },

  updateClubAppQuestions(state, payload) {
    const updateIndex = state.clubAppQuestions.findIndex(
      (clubAppQuestion) => clubAppQuestion.id === payload.id
    );
    if (updateIndex > 0) state.clubAppQuestions[updateIndex] = payload;
  },

  removeClubAppQuestions(state, payload) {
    const removeIndex = state.clubAppQuestions.findIndex(
      (clubAppQuestion) => clubAppQuestion.id === payload.clubAppQuestionId
    );
    console.log(removeIndex);
    if (removeIndex > 0) state.clubAppQuestions.splice(removeIndex, 1);
  },

  setAllMemberImpormations(state, payload) {
    state.allMemberImpormations = payload;
  },
  setAllApplicantImpormations(state, payload) {
    state.allApplicantImpormations = payload;
  },
};
export const actions = {
  async loadClubAppQuestions({ commit }, payload) {
    try {
      const res = await this.$axios.get(
        `/clubs/${payload.clubId}/app_question`
      );
      commit("setClubAppQuestions", res.data);
    } catch (err) {
      console.error(err);
    }
  },

  async pushClubAppQuestions({ commit }, payload) {
    try {
      const res = await this.$axios.post(
        `/clubs/${payload.clubId}/app_question`,
        {
          question: payload.question,
          answer_type: payload.answer_type,
        }
      );
      commit("pushClubAppQuestions", res.data);
    } catch (err) {
      console.error(err);
    }
  },

  async updateClubAppQuestions({ commit }, payload) {
    try {
      const res = await this.$axios.patch(
        `/clubs/${payload.clubId}/app_question/${payload.clubAppQuestionId}`,
        {
          question: payload.question,
        }
      );
      commit("updateClubAppQuestions", res.data);
    } catch (err) {
      console.error(err);
    }
  },
  async removeClubAppQuestions({ commit }, payload) {
    try {
      await this.$axios.delete(
        `/clubs/${payload.clubId}/app_question/${payload.clubAppQuestionId}`
      );
      commit("removeClubAppQuestions", payload);
    } catch (err) {
      console.error(err);
    }
  },

  async findAllUserImpormations({ commit }, payload) {
    try {
      const res = await this.$axios.get(`/clubs/${payload.clubId}/users`);
      commit("setAllMemberImpormations", res.data);
    } catch (err) {
      console.error(err);
    }
  },

  async findAllApplicantImpormations({ commit }, payload) {
    try {
      const res = await this.$axios.get(
        `/clubs/${payload.clubId}/app_question_answers`
      );
      commit("setAllApplicantImpormations", res.data);
    } catch (err) {
      console.error(err);
    }
  },

  async pushClubAppQuestionAnswers({ commit }, payload) {
    try {
      await this.$axios.post(`/clubs/${payload.clubId}/app_question_answers`, {
        clubAppQuestionAnswers: payload.clubAppQuestionAnswers,
      });
    } catch (err) {
      console.error(err);
    }
  },
};
