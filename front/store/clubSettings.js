export const state = () => ({
  clubAppQuestions: [], //지원서 질문
  allMembers: [], // 동아리 멤버
  allAppAnswers: [], // 지원서
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
    //console.log(removeIndex);
    if (removeIndex > 0) state.clubAppQuestions.splice(removeIndex, 1);
  },

  setAllMembers(state, payload) {
    state.allMembers = payload;
  },
  setAllAppAnswers(state, payload) {
    state.allAppAnswers = payload;
  },
};
export const actions = {
  async loadClubAppQuestions({ commit }, payload) {
    try {
      const res = await this.$axios.$get(
        `/clubs/${payload.clubId}/app/questions`
      );
      commit("setClubAppQuestions", res.data);
    } catch (err) {
      console.error(err);
    }
  },

  async pushClubAppQuestions({ commit }, payload) {
    try {
      const res = await this.$axios.$post(
        `/clubs/${payload.clubId}/app/questions`,
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
      const res = await this.$axios.$patch(
        `/clubs/${payload.clubId}/app/questions/${payload.clubAppQuestionId}`,
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
      await this.$axios.$delete(
        `/clubs/${payload.clubId}/app/questions/${payload.clubAppQuestionId}`
      );
      commit("removeClubAppQuestions", payload);
    } catch (err) {
      console.error(err);
    }
  },

  async findAllMembers({ commit }, payload) {
    try {
      const res = await this.$axios.$get(`/clubs/${payload.clubId}/members`);
      commit("setAllMembers", res.data);
    } catch (err) {
      console.error(err);
    }
  },

  async findAllAppAnswers({ commit }, payload) {
    try {
      const res = await this.$axios.$get(
        `/clubs/${payload.clubId}/app/answers`,
        {
          params: { status: payload.status },
        }
      );
      commit("setAllAppAnswers", res.data);
    } catch (err) {
      console.error(err);
    }
  },

  async pushClubAppAnswers({ commit }, payload) {
    try {
      //console.log(payload);
      await this.$axios.$post(`/clubs/${payload.clubId}/app/answers`, {
        clubAppAnswerItems: payload.clubAppAnswerItems,
        nickname: payload.nickname,
      });
    } catch (err) {
      console.error(err);
    }
  },

  async updateClubAppAnswerStatus({ commit }, payload) {
    try {
      const res = await this.$axios.$patch(
        `/clubs/${payload.clubId}/app/answers/${payload.clubAppAnswerId}/status`,
        {
          status: payload.status,
        }
      );
      commit("updateClubAppQuestions", res.data);
    } catch (err) {
      console.error(err);
    }
  },
};
