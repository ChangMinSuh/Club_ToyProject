export const state = () => ({
  clubChats: [],
  serverRes: null,
});

export const getters = {};

export const mutations = {
  setClubChats(state, payload) {
    state.clubChats = payload;
  },
  addClubChats(state, payload) {
    state.clubChats.push(payload);
  },
};

export const actions = {
  async loadClubChats({ state, commit, dispatch }, { clubId }) {
    try {
      const res = await this.$axios.get(`/clubs/${clubId}/chats`, {
        withCredentials: true,
      });
      commit("setClubChats", res.data);
    } catch (err) {
      console.error(err);
    }
  },

  addClubChats({ commit }, payload) {
    commit("addClubChats", payload);
  },
};
