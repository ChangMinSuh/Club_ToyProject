<template>
  <v-list color="transparent">
    <v-list-item
      v-for="(sidebarList, index) of sidebarLists"
      nuxt
      :to="sidebarList.link"
      :key="index"
      link
    >
      <v-list-item-content>
        <v-list-item-title> {{ sidebarList.name }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider v-if="isManager" />
    <v-list-item
      v-if="isManager"
      nuxt
      :to="`/club/ground/${onlineClub.id}/setting`"
    >
      <v-list-item-content>
        <v-list-item-title> 동아리 관리 </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const clubsHelper = createNamespacedHelpers("clubs");
const usersHelper = createNamespacedHelpers("users");

export default {
  data: () => ({}),

  computed: {
    ...usersHelper.mapState(["me"]),
    ...clubsHelper.mapState(["onlineClub"]),

    ...clubsHelper.mapGetters(["clubId"]),
    sidebarLists() {
      return [
        { name: "메인", link: `/club/ground/${this.clubId}` },
        { name: "전체 게시판", link: `/club/ground/${this.clubId}/post` },
        //{ name: "채팅", link: `/club/ground/${this.clubId}/chatting` },
      ];
    },
    isManager() {
      return (
        this.me?.ClubMembers?.find(({ ClubId }) => ClubId === this.clubId)
          .role === "manager"
      );
    },
  },
};
</script>

<style></style>
