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
      <v-card width="350">
        <div v-if="roomId <= 0">
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
                    <v-list-item-group>
                      <v-list-item
                        @click="
                          overlay.createChatRoom = !overlay.createChatRoom
                        "
                      >
                        추가
                      </v-list-item>
                    </v-list-item-group>
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
                  :key="clubChatRoom.id + 'l'"
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
                        <v-icon color="red">{{
                          clubChatRoom.unreadCnt
                        }}</v-icon>
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <v-divider />
            </v-list-item-group>
            <!-- 설정 -->
            <v-overlay :absolute="absolute" :value="overlay.createChatRoom">
              <validation-observer v-slot="{ invalid }">
                <validation-provider
                  rules="required|max:20"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="input.createChatRoom.name"
                    label="name*"
                    required
                    counter="20"
                    :error-message="errors"
                  >
                  </v-text-field>
                </validation-provider>
                <validation-provider rules="max:50" v-slot="{ errors }">
                  <v-text-field
                    v-model="input.createChatRoom.explanation"
                    label="explanation"
                    counter="50"
                    :error-message="errors"
                  >
                  </v-text-field>
                </validation-provider>
                <v-btn color="red" @click="overlay.createChatRoom = false">
                  뒤로
                </v-btn>
                <v-btn
                  color="success"
                  @click="createChatRoom"
                  :disabled="invalid"
                >
                  생성
                </v-btn>
              </validation-observer>
            </v-overlay>
          </v-card>
        </div>
        <!-- club chat room -->
        <div
          v-else-if="roomId > 0 && !setting.inviteMember"
          class="transition-fast-in-fast-out"
        >
          <v-app-bar>
            <v-btn icon @click="goOutChatRoom">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            <v-toolbar-title class="text-h6 pl-0"> Messages </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item-group>
                  <v-list-item
                    @click="setting.inviteMember = !setting.inviteMember"
                  >
                    초대
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
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
                      clubChat.ClubMember &&
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
                  <v-card v-else color="yellow">{{ clubChat.content }} </v-card>
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
        </div>
        <div
          v-else-if="setting.inviteMember"
          class="transition-fast-in-fast-out"
        >
          <v-app-bar>
            <v-btn icon @click="setting.inviteMember = false">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>

            <v-toolbar-title class="text-h6 pl-0"> 설정 </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item-group>
                  <v-list-item
                    @click="setting.inviteMember = !setting.inviteMember"
                  >
                    검색
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-menu>
          </v-app-bar>
          <div v-if="inviteableMember.length">
            <validation-observer v-slot="{ invalid }">
              <v-card height="350" tile class="overflow-y-auto">
                <v-container>
                  <v-row>
                    <v-col
                      cols="4"
                      :key="index"
                      v-for="(clubMember, index) of inviteableMember"
                    >
                      <validation-provider
                        rules="required|max:20"
                        v-slot="{ errors }"
                      >
                        <v-checkbox
                          v-model="input.inviteMembersId"
                          :label="clubMember.nickname"
                          :value="clubMember.id"
                          required
                          counter="20"
                          :error-message="errors"
                        >
                        </v-checkbox>
                      </validation-provider>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
              <v-footer>
                <v-btn color="red" @click="setting.inviteMember = false">
                  뒤로
                </v-btn>
                <v-btn
                  color="success"
                  @click="inviteMember"
                  :disabled="invalid"
                >
                  초대
                </v-btn>
              </v-footer>
            </validation-observer>
          </div>
          <div v-else>
            <v-card height="350" tile> 모두 가입 완료 </v-card>
            <v-footer>
              <v-btn color="red" @click="setting.inviteMember = false">
                뒤로
              </v-btn>
            </v-footer>
          </div>
        </div>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";

import { createNamespacedHelpers } from "vuex";

const usersHelper = createNamespacedHelpers("users");
const clubsHelper = createNamespacedHelpers("clubs");
const clubChatsHelper = createNamespacedHelpers("clubChats");

export default {
  data: () => ({
    inputChat: "",
    roomId: 0,
    loggedInAt: null,
    absolute: true,
    overlay: {
      createChatRoom: false,
    },
    input: {
      createChatRoom: {
        name: "",
        explanation: "",
      },
      inviteMembersId: [],
    },
    setting: {
      inviteMember: false,
    },
  }),

  computed: {
    ...usersHelper.mapState(["me", "access_token"]),
    ...clubsHelper.mapState(["onlineClub", "myClubMember"]),
    ...clubChatsHelper.mapState(["clubChatRooms", "clubChats"]),

    ...clubChatsHelper.mapGetters(["membersIdInMyClubChatRoom"]),

    inviteableMember() {
      return this.onlineClub.ClubMembers.filter(
        (member) => this.membersIdInMyClubChatRoom.indexOf(member.id) < 0
      );
    },
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  mounted() {
    this.socket = this.$nuxtSocket({
      // nuxt-socket-io opts:
      name: "home",
      channel: `/clubChat-${this.onlineClub.name}`,
      // socket.io-client opts:
      withCredentials: true,
      reconnection: false,
      auth: {
        access_token: `${this.access_token}`,
      },
    });

    this.socket.emit("login", {
      clubMember: this.myClubMember,
    });

    this.socket.on("myClubChatRoomMembers", async (data) => {
      console.log(data);
      await this.$store.dispatch("clubChats/loadClubChatRooms", data);
      this.$store.dispatch("clubChats/loadUnreadClubChats", {
        clubId: this.onlineClub.id,
      });
    });

    function addClubChat(data, that) {
      console.log("addClubChat:", data, that);
      if (that.roomId === data.ClubChatRoomId)
        that.$store.dispatch("clubChats/addClubChats", data);
      else {
        // 채팅 목록에 있을때 채팅이 온다면,
        that.$store.dispatch("clubChats/setClubChatRoomsTimePlusOne", {
          roomId: data.ClubChatRoomId,
        });
      }
    }

    this.socket.on("newClubChatRoomMembers", (data, cb) => {
      this.$store.dispatch(
        "clubChats/addClubChatRoomMembersInMyClubChatRoom",
        data.newClubChatRoomMembers
      );
      addClubChat(data.chatData, this);
    });

    this.socket.on("chat", (data, cb) => {
      addClubChat(data, this);
    });

    this.socket.on("refreshEmit", (data, cb) => {
      this.refresh();
      this.socket.auth["access_token"] = this.access_token;
      console.log("front access_token:", this.socket.auth["access_token"]);
      this.socket.disconnect().connect();
      this.socket.emit(
        "login",
        {
          clubMember: this.myClubMember,
        },
        () => {
          this.socket.emit("chat", data);
        }
      );
    });
  },
  methods: {
    ...usersHelper.mapActions(["refresh"]),

    ...clubChatsHelper.mapActions([
      "setClubChats",
      "loadClubChats",
      "loadClubChatRooms",
      "loadUnreadClubChats",
      "setClubChatRoomsTimeZero",
      "setClubChatRoomsLoggedInAt",
      "createClubChatRoom",
      "createClubChatRoomMembers",
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

      this.socket.emit(
        "chat",
        {
          content: this.inputChat.trim(),
          ClubChatRoomId: this.roomId,
          ClubMember: this.myClubMember,
        },
        // (res) => {
        //   if (!res.content) {
        //     this.refresh();
        //     this.socket.auth["access_token"] = this.access_token;
        //     console.log(
        //       "front access_token:",
        //       this.socket.auth["access_token"]
        //     );
        //     this.socket.disconnect().connect();
        //     this.socket.emit(
        //       "login",
        //       {
        //         clubMember: this.myClubMember,
        //       },
        //       () => {
        //         this.socket.emit("chat", {
        //           content: this.inputChat.trim(),
        //           ClubChatRoomId: this.roomId,
        //           ClubMember: this.myClubMember,
        //         });
        //       }
        //     );
        //   }
        // }
        () => {
          this.inputChat = "";
        }
      );
    },

    loggedInAtUpdate() {
      console.log("clubChatRooms", this.clubChatRooms);
      this.loggedInAt = this.clubChatRooms.find(
        (clubChatRoom) => clubChatRoom.id === this.roomId
      )?.loggedInAt;
    },
    async createChatRoom() {
      await this.createClubChatRoom({
        clubId: this.onlineClub.id,
        body: this.input.createChatRoom,
      });
      this.overlay.createChatRoom = !this.overlay.createChatRoom;
      this.input.createChatRoom.name = "";
      this.input.createChatRoom.explanation = "";
    },

    async inviteMember() {
      await this.socket.emit("inviteMember", {
        roomId: this.roomId,
        body: {
          clubMembersId: this.input.inviteMembersId,
        },
      });
      // await this.createClubChatRoomMembers({
      //   clubId: this.onlineClub.id,
      //   roomId: this.roomId,
      //   body: {
      //     clubMembersId: this.input.inviteMembersId,
      //   },
      // });
      this.setting.inviteMember = false;
      this.input.inviteMembersId = [];
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
