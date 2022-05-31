export const state = () => ({
  me: null,
  serverRes: null,
  access_token: "",
  refresh_token: "",
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
  setAccessToken(state, payload) {
    state.access_token = payload;
  },
  setRefreshToken(state, payload) {
    state.refresh_token = payload;
  },
};

export const actions = {
  async loadUser({ state, commit, dispatch }) {
    try {
      // ssr일때 vuex에 저장.
      if (process.server) {
        const authStrategy = this.$cookies.get("auth.strategy");
        if (!authStrategy) return;
        const access_token = this.$cookies.get(
          `auth.access_token.${authStrategy}`
        );
        const refresh_token = this.$cookies.get(
          `auth.refresh_token.${authStrategy}`
        );
        commit("setAccessToken", access_token);
        commit("setRefreshToken", refresh_token);
      }
      const res = await this.$axios.$get("/auth");
      commit("setMe", res.data);
    } catch (err) {
      // accessToken 만료
      console.error(err);
    }
  },

  async refresh({ state, commit }) {
    // access token이 만료되었을 때,
    // header에 접근하기 위해 $post 미사용.
    const refresh_token = `Bearer ${state.refresh_token}`;
    const res = await this.$axios.$post("/auth/refresh", { refresh_token });
    const { access_token, user } = res.data;
    commit("setMe", user);
    commit("setAccessToken", access_token);
  },

  async signup({ commit }, { email, nickname, password }) {
    try {
      const res = await this.$axios.$post("/users", {
        email,
        nickname,
        password,
      });
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
      const res = await this.$axios.$post("/auth/login", {
        email,
        password,
      });
      const { access_token, refresh_token, user } = res.data;
      commit("setMe", user);
      commit("setAccessToken", access_token);
      commit("setRefreshToken", refresh_token);
    } catch (err) {
      commit("setServerRes", {
        message: err.response.data.error.message,
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
