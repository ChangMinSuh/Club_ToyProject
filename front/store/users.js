export const state = () => ({
  me: null,
  serverRes: null,
});

// 저장소의 계산된 속성
export const getters = {
  meAvatar: (state) => state.me?.nickname?.slice(0, 2),
};

export const mutations = {
  setMe(state, payload) {
    state.me = payload;
  },
  setServerRes(state, payload) {
    state.serverRes = payload;
  },
};

export const actions = {
  async loadUser({ state, commit, dispatch }) {
    try {
      const res = await this.$axios.post(
        "/auth/load",
        {},
        {
          withCredentials: true,
        }
      );
      commit("setMe", res.data);
      return null;
    } catch (err) {
      // accessToken 만료
      return null;
    }
  },

  async refresh({ state, commit }) {
    try {
      // access token이 만료되었을 때,
      const res = await this.$axios.post(
        "/auth/refresh",
        {},
        {
          withCredentials: true,
        }
      );
      commit("setMe", res.data);
      console.log(res.headers);
      const cookies = res?.headers["set-cookie"];
      return cookies;
    } catch (err) {
      commit("setServerRes", {
        message: err.response?.data?.message,
        status: err.response?.status,
      });
    }
  },

  async signup({ commit }, { email, nickname, password }) {
    try {
      const res = await this.$axios.$post(
        "/auth/signup",
        {
          email,
          nickname,
          password,
        },
        {
          withCredentials: true,
        }
      );
      commit("setMe", res.data);
    } catch (err) {
      commit("setServerRes", {
        message: err.response.data.message,
        status: err.response.status,
      });
    }
  },

  async login({ state, commit }, { email, password }) {
    try {
      commit("setServerRes", null);
      const res = await this.$axios.post(
        "/auth/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res);
      commit("setMe", res.data);
    } catch (err) {
      commit("setServerRes", {
        message: err.response.data.message,
        status: err.response.status,
      });
    }
  },

  async logout({ commit }) {
    try {
      await this.$axios.$post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );
      commit("setMe", null);
    } catch (err) {
      commit("setServerRes", {
        message: err.response.data.message,
        status: err.response.status,
      });
    }
  },

  setServerRes({ commit }, payload) {
    commit("setServerRes", payload);
  },
};
