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
            <v-card min-height="70vh" rounded="lg">
              <v-card-title> 전체 게시판 </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn nuxt to="create" append>새 문서</v-btn>
              </v-card-actions>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-list three-line>
                      <template v-for="(post, index) in allPosts">
                        <v-divider :key="index"></v-divider>

                        <v-list-item :key="post.id">
                          <v-list-item-content>
                            <v-list-item-title>
                              <v-row>
                                <v-col>
                                  <nuxt-link
                                    style="text-decoration: none; color: black"
                                    :to="`${post.id}`"
                                    append
                                  >
                                    {{ post.title }}
                                  </nuxt-link>
                                </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="1">
                                  <small>{{ post.ClubMember.nickname }}</small>
                                </v-col>
                                <v-col cols="2">
                                  <small>{{
                                    $dayjs(post.createdAt).fromNow()
                                  }}</small>
                                </v-col>
                              </v-row>
                            </v-list-item-title>
                            <v-list-item-subtitle> </v-list-item-subtitle>
                            <v-list-item-subtitle
                              v-html="post.content"
                            ></v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                    </v-list>
                    <v-divider></v-divider>
                  </v-col>
                </v-row>
              </v-container>
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
    await store.dispatch("clubPosts/loadAllPosts", { clubId }),
      console.log(store.state.users.me?.ClubMembers);
  },
  computed: {
    ...clubsHelper.mapState(["onlineClub"]),
    ...clubPostsHelper.mapState(["allPosts"]),
    ...usersHelper.mapState(["me"]),
  },

  data: () => ({}),
};
</script>

<style></style>
