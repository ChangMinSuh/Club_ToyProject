export const state = () => ({
  allPosts: [],
  onePost: null,
  serverRes: null,
});

// 저장소의 계산된 속성
export const getters = {
  allPostsPart: (state) => (page, MaxPostInPage) =>
    state.allPosts.slice((page - 1) * MaxPostInPage, page * MaxPostInPage),
};

export const mutations = {
  setAllPosts(state, payload) {
    state.allPosts = payload;
  },

  setOnePost(state, payload) {
    state.onePost = payload;
  },
};

export const actions = {
  async loadAllPosts({ commit }, payload) {
    try {
      const res = await this.$axios.$get(`clubs/${payload.clubId}/posts`);
      commit("setAllPosts", res.data);
    } catch (err) {
      console.error(err);
    }
  },

  async loadOnePost({ commit }, payload) {
    try {
      const res = await this.$axios.$get(
        `clubs/${payload.clubId}/posts/${payload.postId}`
      );
      commit("setOnePost", res.data);
    } catch (err) {
      console.error(err);
    }
  },

  async pushPost({ commit }, payload) {
    try {
      await this.$axios.$post(`clubs/${payload.clubId}/posts`, {
        title: payload.title,
        content: payload.content,
      });
    } catch (err) {
      console.error(err);
    }
  },

  async pushPostImages({ commit }, { clubId, images }) {
    try {
      console.log(images);
      const res = await this.$axios.$post(
        `clubs/${clubId}/posts/images`,
        images
      );
      return res.data;
    } catch (err) {
      console.error(err);
    }
  },

  async updatePost({}, payload) {
    try {
      await this.$axios.$patch(
        `clubs/${payload.clubId}/posts/${payload.postId}`,
        {
          title: payload.title,
          content: payload.content,
        }
      );
    } catch (err) {
      console.error(err);
    }
  },

  async removePost({}, payload) {
    try {
      await this.$axios.$delete(
        `clubs/${payload.clubId}/posts/${payload.postId}`
      );
    } catch (err) {
      console.error(err);
    }
  },
};
