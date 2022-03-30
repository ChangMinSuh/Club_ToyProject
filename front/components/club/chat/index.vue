<template>
  <div>
    <v-menu
      :close-on-click="false"
      :close-on-content-click="false"
      offset-y
      top
    >
      <template #activator="{ on, attrs }">
        <v-btn
          fab
          fixed
          large
          dark
          class="v-btn--chat"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-chat</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-app-bar tile>
          <v-toolbar-title class="text-h6 pl-0"> Messages </v-toolbar-title>

          <v-spacer></v-spacer>
          <template>
            <div class="text-center">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>추가</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>설정</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </template>
        </v-app-bar>

        <v-card width="350" height="450" class="overflow-y-auto" tile>
          <v-list-item-group>
            <template v-for="(clubChatRoom, index) in clubChatRooms">
              <v-divider :key="index" />
              <v-list-item
                :key="clubChatRoom.id"
                @click="goInChatRoom(clubChatRoom.id)"
              >
                <v-list-item-content>
                  <v-row>
                    <v-col cols="10">
                      <v-list-item-title>
                        {{ clubChatRoom.name }}
                      </v-list-item-title>

                      <v-list-item-subtitle> </v-list-item-subtitle>

                      <v-list-item-subtitle>
                        {{ clubChatRoom.explanation }}
                      </v-list-item-subtitle>
                    </v-col>
                    <v-col>
                      <v-icon color="red">{{ clubChatRoom.unreadCnt }}</v-icon>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-divider />
          </v-list-item-group>
        </v-card>

        <!-- club chat room -->
        <v-expand-x-transition mode="out-in">
          <v-card
            v-if="roomId > 0"
            class="transition-fast-in-fast-out v-card--reveal"
            style="height: 100%"
          >
            <v-app-bar>
              <v-btn icon @click="goOutChatRoom">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>

              <v-toolbar-title class="text-h6 pl-0"> Messages </v-toolbar-title>

              <v-spacer></v-spacer>

              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-app-bar>
            <v-card height="350" tile class="overflow-y-auto">
              <!-- 채팅창 내용 -->
              <v-card-text>
                <v-row>
                  <v-col
                    cols="12"
                    v-for="(clubChat, index) of clubChats"
                    :key="index"
                  >
                    <v-chip
                      color="orange"
                      x-small
                      v-if="
                        myClubMember.id !== clubChat.ClubMember.id &&
                        loggedInAt < clubChat.createdAt
                      "
                    >
                      new
                    </v-chip>
                    <v-chip
                      color="blue"
                      x-small
                      v-if="
                        clubChat.ClubMember &&
                        myClubMember.id !== clubChat.ClubMember.id
                      "
                    >
                      {{ clubChat.ClubMember.nickname }}
                    </v-chip>
                    {{ $dayjs(clubChat.createdAt).fromNow() }}
                    <v-card
                      v-if="
                        clubChat.ClubMember &&
                        myClubMember.id !== clubChat.ClubMember.id
                      "
                    >
                      {{ clubChat.content }}
                    </v-card>
                    <v-card v-else color="yellow"
                      >{{ clubChat.content }}
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
            <v-footer>
              <v-row>
                <v-col cols="10" color="white">
                  <v-sheet max-height="200" class="overflow-y-auto">
                    <v-textarea
                      v-model="inputChat"
                      rows="1"
                      auto-grow
                      no-resize
                      @keydown.enter.prevent="pushChat"
                    ></v-textarea>
                  </v-sheet>
                </v-col>
                <v-col cols="2" align-self="center">
                  <v-btn
                    :disabled="!inputChat"
                    outlined
                    x-small
                    fab
                    color="indigo"
                    @click="pushChat"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-footer>
          </v-card>
        </v-expand-x-transition>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const usersHelper = createNamespacedHelpers("users");
const clubsHelper = createNamespacedHelpers("clubs");
const clubChatsHelper = createNamespacedHelpers("clubChats");

export default {
  data: () => ({
    inputChat: "",
    roomId: 0,
    loggedInAt: null,
  }),

  computed: {
    ...usersHelper.mapState(["me"]),
    ...clubsHelper.mapState(["onlineClub", "myClubMember"]),
    ...clubChatsHelper.mapState(["clubChatRooms", "clubChats"]),
  },

  mounted() {
    this.socket = this.$nuxtSocket({
      // nuxt-socket-io opts:
      name: "home",
      channel: `/clubChat-${this.onlineClub.name}`,
      // socket.io-client opts:
      withCredentials: true,
      reconnection: false,
    });

    this.socket.emit("loginChat", {
      clubChatRooms: this.clubChatRooms,
    });

    this.socket.on("chat", (data, cb) => {
      console.log("chat", data);
      // 같은 채팅방 사람인지.
      if (this.roomId === data.ClubChatRoomId)
        this.$store.dispatch("clubChats/addClubChats", data);
      else {
        // 채팅 목록에 있을때 채팅이 온다면,
        this.$store.dispatch("clubChats/setClubChatRoomsTimePlusOne", {
          roomId: data.ClubChatRoomId,
        });
      }
    });

    this.$store.dispatch("clubChats/loadUnreadClubChats", {
      clubId: this.onlineClub.id,
    });
  },
  methods: {
    ...clubChatsHelper.mapActions([
      "setClubChats",
      "loadClubChats",
      "loadClubChatRooms",
      "loadUnreadClubChats",
      "setClubChatRoomsTimeZero",
      "setClubChatRoomsLoggedInAt",
    ]),

    async goInChatRoom(roomId) {
      this.roomId = roomId;
      this.loggedInAtUpdate();
      await this.loadClubChats({ clubId: this.onlineClub.id, roomId: roomId });
    },

    async goOutChatRoom() {
      const loggedInAt = new Date();
      console.log("loggedInAt", loggedInAt);
      await this.socket.emit("exitRoom", {
        ClubChatRoomId: this.roomId,
        ClubMemberId: this.myClubMember.id,
        loggedInAt,
      });
      this.setClubChatRoomsLoggedInAt({ roomId: this.roomId, loggedInAt });
      this.setClubChatRoomsTimeZero({ roomId: this.roomId });
      this.setClubChats([]);
      this.roomId = 0;
    },
    // 채팅
    async pushChat(e) {
      if (e.ctrlKey) {
        this.inputChat = this.inputChat + "\n";
        return;
      }
      if (!this.inputChat.trim()) return;
      await this.socket.emit("chat", {
        content: this.inputChat.trim(),
        ClubChatRoomId: this.roomId,
        ClubMember: this.myClubMember,
      });
      this.inputChat = "";
    },

    loggedInAtUpdate() {
      console.log("clubChatRooms", this.clubChatRooms);
      this.loggedInAt = this.clubChatRooms.find(
        (clubChatRoom) => clubChatRoom.id === this.roomId
      )?.loggedInAt;
    },
  },
};
</script>

<style>
.v-btn--chat {
  bottom: 10px;
  margin: 0 0 16px 16px;
}
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>
