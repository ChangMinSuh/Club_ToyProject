export const state = () => ({
  allPosts: [],
  onePost: null,
  serverRes: null,
  myImages: [],
});

// 저장소의 계산된 속성
export const getters = {
  allPostsPart: (state) => (page, MaxPostInPage) =>
    state.allPosts.slice((page - 1) * MaxPostInPage, page * MaxPostInPage),
  allMyImagesPart: (state) => (page, MaxMyImagesInPage) =>
    state.myImages.slice(
      (page - 1) * MaxMyImagesInPage,
      page * MaxMyImagesInPage
    ),
  myImagesLength: (state) => state.myImages.length,
};

export const mutations = {
  setAllPosts(state, payload) {
    state.allPosts = payload;
  },

  setOnePost(state, payload) {
    state.onePost = payload;
  },

  setMyImages(state, payload) {
    state.myImages = payload;
  },
  unshiftMyImages(state, payload) {
    state.myImages.unshift(...payload);
  },
  updateMyImage(state, payload) {
    const index = state.myImages.findIndex((image) => image.id === payload.id);
    state.myImages.splice(index, 1, payload);
  },
  removeMyImage(state, payload) {
    const index = state.myImages.findIndex(
      (image) => image.id === payload.fileId
    );
    state.myImages.splice(index, 1);
  },
};

export const actions = {
  async loadAllPosts({ commit }, payload) {
    try {
      const res = await this.$axios.$get(`clubs/${payload.clubId}/posts`, {
        params: {
          showStatus: payload.showStatus,
        },
      });
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

  async loadMyImages({ commit }, payload) {
    try {
      const res = await this.$axios.$get(
        `clubs/${payload.clubId}/images/member`
      );
      commit("setMyImages", res.data);
    } catch (err) {
      console.error(err);
    }
  },

  async pushPost({ commit }, payload) {
    try {
      console.log(payload);
      await this.$axios.$post(`clubs/${payload.clubId}/posts`, {
        title: payload.title,
        content: payload.content,
        showStatus: payload.showStatus,
      });
    } catch (err) {
      console.error(err);
    }
  },

  async pushPostImages({ commit }, { clubId, images }) {
    try {
      const res = await this.$axios.$post(`clubs/${clubId}/images`, images);
      commit("unshiftMyImages", res.data);
      return res.data;
    } catch (err) {
      console.error(err);
    }
  },

  async updatePost({}, payload) {
    try {
      await this.$axios.$patch(
        `clubs/${payload.clubId}/posts/${payload.postId}`,
        payload.body
      );
    } catch (err) {
      console.error(err);
    }
  },

  async updateClubFile({ commit }, payload) {
    try {
      const res = await this.$axios.$patch(
        `clubs/${payload.clubId}/files/${payload.fileId}`,
        {
          isShow: payload.isShow,
        }
      );
      commit("updateMyImage", res.data);
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

  async removeClubFile({ commit }, payload) {
    try {
      await this.$axios.$delete(
        `clubs/${payload.clubId}/files/${payload.fileId}`
      );
      commit("removeMyImage", { fileId: payload.fileId });
    } catch (err) {
      console.error(err);
    }
  },
};
