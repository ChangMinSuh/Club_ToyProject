export const state = () => ({
  clubChats: [],
  clubChatRooms: [],
  serverRes: null,
});

export const getters = {};

export const mutations = {
  setClubChats(state, payload) {
    state.clubChats = payload;
  },
  setClubChatRooms(state, payload) {
    state.clubChatRooms = payload;
  },

  setAllClubChatRoomsTimes(state, { unreadCnts }) {
    console.log(unreadCnts);
    unreadCnts.forEach(
      (unreadCnt, index) => (state.clubChatRooms[index].unreadCnt = unreadCnt)
    );
  },
  setClubChatRoomsTimePlusOne(state, { roomId }) {
    const index = state.clubChatRooms.findIndex(
      (clubChatRoom) => clubChatRoom.id === roomId
    );
    state.clubChatRooms[index].unreadCnt++;
  },
  setClubChatRoomsTimeZero(state, { roomId }) {
    const index = state.clubChatRooms.findIndex(
      (clubChatRoom) => clubChatRoom.id === roomId
    );
    state.clubChatRooms[index].unreadCnt = 0;
  },
  setClubChatRoomsLoggedInAt(state, { roomId, loggedInAt }) {
    const index = state.clubChatRooms.findIndex(
      (clubChatRoom) => clubChatRoom.id === roomId
    );
    state.clubChatRooms[index].loggedInAt = loggedInAt;
  },

  addClubChats(state, payload) {
    state.clubChats.push(payload);
  },
  addClubChatRooms(state, payload) {
    state.clubChatRooms.push(payload);
  },
};

export const actions = {
  async loadClubChats({ state, commit, dispatch }, { clubId, roomId }) {
    try {
      const res = await this.$axios.$get(
        `/clubs/${clubId}/chatrooms/${roomId}`,
        {
          withCredentials: true,
        }
      );
      commit("setClubChats", res.data);
    } catch (err) {
      console.error(err);
    }
  },

  async loadUnreadClubChats({ state, commit }, { clubId }) {
    try {
      const unreadCnts = [];
      const promises = state.clubChatRooms.map(async (clubChatRoom, index) => {
        const res = await this.$axios.$get(
          `/clubs/${clubId}/chatrooms/${clubChatRoom.id}/unread?loggedInAt=${clubChatRoom.loggedInAt}`
        );
        console.log(res);
        unreadCnts[index] = res.data;
      });
      await Promise.all(promises);
      console.log(unreadCnts);
      commit("setAllClubChatRoomsTimes", { unreadCnts });
    } catch (err) {
      console.error(err);
    }
  },

  addClubChats({ commit }, payload) {
    commit("addClubChats", payload);
  },
  setClubChats({ commit }, payload) {
    commit("setClubChats", payload);
  },
  async setClubChatRoomsTimePlusOne({ commit }, { roomId }) {
    commit("setClubChatRoomsTimePlusOne", { roomId });
  },
  setClubChatRoomsTimeZero({ commit }, { roomId }) {
    commit("setClubChatRoomsTimeZero", { roomId });
  },

  async setClubChatRoomsLoggedInAt({ commit }, { roomId, loggedInAt }) {
    commit("setClubChatRoomsLoggedInAt", { roomId, loggedInAt });
  },

  loadClubChatRooms({ state, commit, dispatch }, { myClubChatRoomMembers }) {
    console.log(myClubChatRoomMembers)
    const clubChatRooms = myClubChatRoomMembers?.map((item) => {
      const result = item.ClubChatRoom;
      result.loggedInAt = item.loggedInAt;
      result.unreadCnt = 0;
      return result;
    });
    commit("setClubChatRooms", clubChatRooms);
  },
};
