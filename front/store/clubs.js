export const state = () => ({
  myClubs: [],
  onlineClub: null,
  serverRes: null,
});

export const getters = {
  myClubsLength: (state) => state.myClubs.length,
  myClubsPart: (state) => (page, MaxClubInPage) =>
    state.myClubs.slice((page - 1) * MaxClubInPage, page * MaxClubInPage),
};

export const mutations = {
  setMyClubs(state, payload) {
    state.myClubs = payload;
  },
  setServerRes(state, payload) {
    state.serverRes = payload;
  },

  setOnlineClub(state, payload) {
    state.onlineClub = payload;
  },
};

export const actions = {
  async loadMyClubs({ state, commit, dispatch }) {
    try {
      const res = await this.$axios.get("/clubs/my", {
        withCredentials: true,
      });
      commit("setMyClubs", res.data);
    } catch (err) {
      console.error(err);
    }
  },

  async loadOneClubByName({ commit }, { clubName }) {
    try {
      const res = await this.$axios.get(
        `/clubs/${encodeURIComponent(clubName)}`,
        {
          withCredentials: true,
        }
      );
      commit("setOnlineClub", res.data);
    } catch (err) {
      console.error(err);
    }
  },

  async createClubs({ state, commit, dispatch }, payload) {
    try {
      const res = await this.$axios.post("/clubs", payload, {
        withCredentials: true,
      });
    } catch (err) {
      console.error(err);
    }
  },

  setMyClubs({ commit }, payload) {
    commit("setMyClubs", payload);
  },
};
