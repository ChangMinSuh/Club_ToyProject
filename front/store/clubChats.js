export const state = () => ({
  clubChats: [],
  myClubChatRoom: null,
  clubChatRooms: [],
  serverRes: null,
});

export const getters = {
  membersIdInMyClubChatRoom: (state) =>
    state.myClubChatRoom?.ClubChatRoomMembers?.map(
      (clubChatRoomMember) => clubChatRoomMember.ClubMemberId
    ),
};

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
  setMyClubChatRoom(state, payload) {
    state.myClubChatRoom = payload;
  },

  addClubChats(state, payload) {
    state.clubChats.push(payload);
  },
  addClubChatRooms(state, payload) {
    state.clubChatRooms.push(payload);
  },
  addClubChatRoomMembersInMyClubChatRoom(state, payload) {
    state.myClubChatRoom.ClubChatRoomMembers =
      state.myClubChatRoom?.ClubChatRoomMembers.concat(payload);
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
      const { ClubChats, ...myClubChatRoom } = res.data;
      commit("setClubChats", res.data.ClubChats);
      commit("setMyClubChatRoom", myClubChatRoom);
    } catch (err) {
      console.error(err);
    }
  },

  async loadClubChatRooms(
    { state, commit, dispatch },
    { myClubChatRoomMembers }
  ) {
    console.log(myClubChatRoomMembers);
    const clubChatRooms = await myClubChatRoomMembers?.map((item) => {
      const result = item.ClubChatRoom;
      result.loggedInAt = item.loggedInAt;
      result.unreadCnt = 0;
      return result;
    });
    commit("setClubChatRooms", clubChatRooms);
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

  async createClubChatRoom({ commit }, { clubId, body }) {
    const res = await this.$axios.$post(`/clubs/${clubId}/chatrooms`, body);
    console.log("addClubChatRoom", res.data);
    commit("addClubChatRooms", res.data);
  },

  async addClubChatRoomMembersInMyClubChatRoom({ commit }, payload) {
    commit("addClubChatRoomMembersInMyClubChatRoom", payload);
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
};
