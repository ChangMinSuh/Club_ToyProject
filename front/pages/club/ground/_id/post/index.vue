<template>
  <v-app>
    <v-card-title> 전체 게시판 </v-card-title>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn nuxt to="create" append>새 문서</v-btn>
    </v-card-actions>
    <v-container>
      <v-row>
        <v-col cols="12">
          {{ page }}
          {{ allPostsPart(page, MaxPostInPage).map((post) => post.id) }}
          <v-list three-line>
            <template
              v-for="(post, index) in allPostsPart(page, MaxPostInPage)"
            >
              <v-divider :key="index"></v-divider>

              <v-list-item :key="index" dense>
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
                        <small>{{ $dayjs(post.createdAt).fromNow() }}</small>
                      </v-col>
                    </v-row>
                  </v-list-item-title>
                  <v-list-item-subtitle> </v-list-item-subtitle>
                  <v-list-item-subtitle
                    v-html="$md.render(post.content)"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-col>
        <v-col>
          <template>
            <div class="text-center">
              <v-pagination
                v-model="page"
                :length="Math.ceil(allPosts.length / MaxPostInPage)"
              ></v-pagination>
            </div>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const clubsHelper = createNamespacedHelpers("clubs");
const clubPostsHelper = createNamespacedHelpers("clubPosts");
const usersHelper = createNamespacedHelpers("users");

export default {
  layout: "ClubLayout",

  async asyncData({ store, params }) {
    const clubId = Number(params.id);
    await store.dispatch("clubPosts/loadAllPosts", { clubId }),
      console.log(store.state.users.me?.ClubMembers);
  },
  computed: {
    ...clubsHelper.mapState(["onlineClub"]),
    ...clubPostsHelper.mapState(["allPosts"]),
    ...usersHelper.mapState(["me"]),

    ...clubPostsHelper.mapGetters(["allPostsPart"]),
  },

  data: () => ({
    page: 1,
    MaxPostInPage: 5,
  }),
};
</script>

<style></style>
