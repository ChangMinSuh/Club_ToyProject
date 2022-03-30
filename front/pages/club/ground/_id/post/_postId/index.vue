<template>
  <v-app>
    <v-main class="grey lighten-3">
      <v-container>
        <v-row>
          <v-col>
            {{ onlineClub.name }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <v-card rounded="lg">
              <ClubSidebar />
            </v-card>
          </v-col>

          <v-col>
            <v-card>
              <v-card-title primary-title>
                {{ onePost.title }}
              </v-card-title>

              <v-card-text>
                <v-row>
                  <v-spacer></v-spacer>
                  등급:
                  {{ onePost.ClubMember.grade }}
                  {{ onePost.ClubMember.nickname }}
                </v-row>
              </v-card-text>
              <v-card-text v-html="$md.render(onePost.content)"> </v-card-text>

              <v-card-actions>
                <v-btn small color="primary" @click="back">이전</v-btn>
                <v-btn
                  v-if="isPostWriter"
                  small
                  color="primary"
                  nuxt
                  to="update"
                  append
                >
                  수정
                </v-btn>
                <v-btn
                  v-if="isPostWriter"
                  small
                  color="primary"
                  @click="deletePost"
                  >삭제</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <ClubChat />
    </v-main>
  </v-app>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const clubsHelper = createNamespacedHelpers("clubs");
const clubPostsHelper = createNamespacedHelpers("clubPosts");
const usersHelper = createNamespacedHelpers("users");

export default {
  middleware: ["isClubMember"],

  async asyncData({ store, params }) {
    const clubId = Number(params.id);
    const postId = Number(params.postId);
    await store.dispatch("clubPosts/loadOnePost", { clubId, postId });

    return {
      isPostWriter:
        store.state.clubs?.myClubMember?.id ===
        store.state.clubPosts?.onePost?.ClubMember?.id,
    };
  },
  computed: {
    ...clubsHelper.mapState(["onlineClub"]),
    ...clubPostsHelper.mapState(["onePost"]),
    ...usersHelper.mapState(["me"]),
  },
  data: () => ({}),

  methods: {
    ...clubPostsHelper.mapActions(["removePost"]),

    back() {
      history.back();
    },

    async deletePost() {
      try {
        if (confirm("정말 삭제하시겠습니까?")) {
          await this.removePost({
            clubId: this.onlineClub.id,
            postId: this.onePost.id,
          });
          alert("삭제 되었습니다");
          history.back();
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>

<style>
/* This is for documentation purposes and will not be needed in your application */
</style>
