export const state = () => ({
  myClubs: [],
  allClubs: [],
  onlineClub: null,
  serverRes: null,
});

export const getters = {
  myClubsLength: (state) => state.myClubs.length,
  myClubsPart: (state) => (page, MaxClubInPage) =>
    state.myClubs.slice((page - 1) * MaxClubInPage, page * MaxClubInPage),

  allClubsLength: (state) => state.allClubs.length,
  allClubsPart: (state) => (page, MaxClubInPage) =>
    state.allClubs.slice((page - 1) * MaxClubInPage, page * MaxClubInPage),
};

export const mutations = {
  setMyClubs(state, payload) {
    state.myClubs = payload;
  },
  setAllClub(state, payload) {
    state.allClubs = payload;
  },
  setServerRes(state, payload) {
    state.serverRes = payload;
  },

  setOnlineClub(state, payload) {
    state.onlineClub = payload;
  },
};

export const actions = {
  async loadAllClubs({ state, commit, dispatch }) {
    try {
      const res = await this.$axios.get("/clubs", {
        withCredentials: true,
      });
      commit("setAllClub", res?.data);
    } catch (err) {
      console.error(err);
    }
  },

  async loadMyClubs({ state, commit, dispatch }) {
    try {
      const res = await this.$axios.get("/clubs/my", {
        withCredentials: true,
      });
      commit("setMyClubs", res?.data);
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
      return true;
    } catch (err) {
      console.error(err);
      return false;
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
