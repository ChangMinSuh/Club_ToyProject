export const state = () => ({
  allPosts: [],
  onePost: null,
  serverRes: null,
});

// 저장소의 계산된 속성
export const getters = {};

export const mutations = {
  setAllPosts({ state }, payload) {
    state.allPosts = payload;
  },
  setOnePost({ state }, payload) {
    state.onePost = payload;
  },
};

export const actions = {};
