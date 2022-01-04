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
            <validation-observer ref="form" v-slot="{ invalid }">
              <v-form @submit.prevent="onSubmit">
                <v-card min-height="70vh" rounded="lg">
                  <v-card-title> 글 작성 </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <validation-provider
                            rules="required|max:50"
                            v-slot="{ errors }"
                          >
                            <v-text-field
                              v-model="title"
                              label="제목"
                              counter="50"
                              :error-messages="errors"
                            />
                          </validation-provider>
                        </v-col>
                        <v-btn>사진</v-btn>
                        <v-col cols="12">
                          <validation-provider
                            rules="required"
                            v-slot="{ errors }"
                          >
                            <v-textarea
                              v-model="content"
                              label="내용"
                              :error-messages="errors"
                            />
                          </validation-provider>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-container>
                      <v-row>
                        <v-col cols="12">
                          <v-spacer></v-spacer>
                          <v-btn type="submit" :disabled="invalid">
                            완료하기
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-actions>
                </v-card>
              </v-form>
            </validation-observer>
          </v-col>
        </v-row>
      </v-container>
      <ClubChat />
    </v-main>
  </v-app>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { createNamespacedHelpers } from "vuex";

const clubsHelper = createNamespacedHelpers("clubs");
const clubPostsHelper = createNamespacedHelpers("clubPosts");
const usersHelper = createNamespacedHelpers("users");

export default {
  middleware: ["isClubMember"],

  async asyncData({ store, params }) {
    const clubId = Number(params.id);
    await store.dispatch("clubChats/loadClubChats", { clubId });
    console.log(store.state.users.me?.ClubMembers);
  },
  computed: {
    ...clubsHelper.mapState(["onlineClub"]),
    ...usersHelper.mapState(["me"]),
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    title: "",
    content: "",
  }),

  methods: {
    ...clubPostsHelper.mapActions(["pushPost"]),

    async onSubmit() {
      try {
        await this.$refs.form.validate();
        await this.pushPost({
          title: this.title,
          content: this.content,
          clubId: this.onlineClub.id,
        });
        history.back();
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style>
/* This is for documentation purposes and will not be needed in your application */
</style>
