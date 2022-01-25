export const state = () => ({
  myClubs: [],
  myClubMember: null,
  myAppAnswers: [],
  allClubs: [],
  onlineClub: null,
  serverRes: null,
  clubIntroduce: null,
});

export const getters = {
  myClubsLength: (state) => state.myClubs.length,
  myClubsPart: (state) => (page, MaxClubInPage) =>
    state.myClubs.slice((page - 1) * MaxClubInPage, page * MaxClubInPage),

  allClubsLength: (state) => state.allClubs.length,
  allClubsPart: (state) => (page, MaxClubInPage) =>
    state.allClubs.slice((page - 1) * MaxClubInPage, page * MaxClubInPage),

  clubId: (state) => state.onlineClub.id,
};

export const mutations = {
  setMyClubs(state, payload) {
    state.myClubs = payload;
  },
  setMyClubMember(state, payload) {
    state.myClubMember = payload;
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

  setClubIntroduce(state, payload) {
    state.clubIntroduce = payload;
  },

  setMyAppAnswers(state, payload) {
    state.myAppAnswers = payload;
  },
};

export const actions = {
  async loadMyClubMember({ commit, rootState }, payload) {
    const myClubMember = rootState.users.me?.ClubMembers?.find((clubMember) => {
      return clubMember.ClubId === payload.clubId;
    });
    commit("setMyClubMember", myClubMember);
  },

  async loadAllClubs({ state, commit, dispatch }) {
    try {
      const res = await this.$axios.$get("/clubs", {
        withCredentials: true,
      });
      commit("setAllClub", res?.data);
    } catch (err) {
      console.error(err);
    }
  },

  async loadMyClubs({ state, commit, dispatch }) {
    try {
      const res = await this.$axios.$get("/clubs/me", {
        withCredentials: true,
      });
      commit("setMyClubs", res?.data);
    } catch (err) {
      console.error(err);
    }
  },

  async loadMyAppAnswers({ commit }, payload) {
    try {
      const res = await this.$axios.$get("/clubs/me/app/answers");
      commit("setMyAppAnswers", res.data);
    } catch (err) {
      console.error(err);
    }
  },

  async loadOneClubById({ commit }, { clubId }) {
    try {
      const res = await this.$axios.$get(`/clubs/${clubId}`);
      commit("setOnlineClub", res.data);
      return true;
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  async createClubs({ state, commit, dispatch }, payload) {
    try {
      const res = await this.$axios.$post("/clubs", payload, {
        withCredentials: true,
      });
    } catch (err) {
      console.error(err);
    }
  },
  async getClubIntroduce({ commit }, payload) {
    try {
      const res = await this.$axios.$get(`/clubs/${payload.id}/introduce`, {
        withCredentials: true,
      });
      const clubIntroduce = {
        Club: payload,
        introduce: res.data,
      };
      commit("setClubIntroduce", clubIntroduce);
    } catch (err) {
      console.error(err);
    }
  },

  setMyClubs({ commit }, payload) {
    commit("setMyClubs", payload);
  },

  async addUserClubs({ commit }, payload) {
    await this.$axios.$post(`/clubs/${payload.clubId}/members`, {
      userId: payload.userId,
      clubAppAnswerId: payload.clubAppAnswerId,
      nickname: payload.nickname,
    });
  },
};
