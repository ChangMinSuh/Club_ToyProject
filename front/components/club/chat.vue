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
      <v-container>
        <v-row>
          <v-card width="300" height="400" tile class="overflow-y-auto">
            <v-card-text height="350">
              <v-container>
                <v-row v-for="(clubChat, index) of clubChats" :key="index">
                  <v-avatar
                    color="blue"
                    x-small
                    v-if="me.userId !== clubChat.UserId"
                  >
                    <span class="white--text text-h5">{{
                      clubChat.User.nickname.slice(0, 2)
                    }}</span>
                  </v-avatar>
                  <v-spacer v-if="me.userId === clubChat.UserId" />
                  <v-chip> {{ clubChat.content }}</v-chip>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-row>

        <v-row>
          <v-col cols="10">
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
      </v-container>
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
  }),

  computed: {
    ...usersHelper.mapState(["me"]),
    ...clubsHelper.mapState(["onlineClub"]),
    ...clubChatsHelper.mapState(["clubChats"]),
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

    this.socket.on("chat", (data, cb) => {
      console.log("socket.on chat", data, cb);
      this.$store.dispatch("clubChats/addClubChats", data);
    });
  },
  methods: {
    async pushChat(e) {
      if (e.ctrlKey) {
        this.inputChat = this.inputChat + "\n";
        return;
      }
      if (!this.inputChat.trim()) return;
      await this.socket.emit("chat", {
        content: this.inputChat.trim(),
        ClubId: this.onlineClub.id,
        clubName: this.onlineClub.name,
      });
      this.inputChat = "";
    },

    newLine() {},
  },
};
</script>

<style>
.v-btn--chat {
  bottom: 10px;
  margin: 0 0 16px 16px;
}
</style>
