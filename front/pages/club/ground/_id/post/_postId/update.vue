<template>
  <v-app>
    <validation-observer ref="form" v-slot="{ invalid }">
      <v-form @submit.prevent="onSubmit">
        <v-card-title> 글 작성 </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-spacer></v-spacer>
              <v-btn
                v-if="onePost.showStatus === 'temp'"
                @click="tempSubmit"
                :disabled="invalid"
              >
                임시저장
              </v-btn>
              <v-btn type="submit" :disabled="invalid"> 완료하기 </v-btn>
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
              <v-col>
                <input
                  ref="imageInput"
                  type="file"
                  accept="image/jpg, image/jpeg, image/png, image/gif"
                  multiple
                  hidden
                  @change="uploadImages"
                />
                <v-btn
                  type="button"
                  color="blue lighten-4"
                  @click="onClickImageUpload"
                >
                  <div style="color: white">이미지 업로드</div>
                </v-btn>
                <v-btn
                  type="button"
                  color="blue lighten-4"
                  @click="myImagesClick()"
                >
                  <div style="color: white">내 이미지</div>
                </v-btn>
              </v-col>
              <v-col cols="12" v-if="myImagesOn">
                <v-row class="fill-height" align="center" justify="center">
                  <v-col cols="1">
                    <v-btn icon @click="myImageLeft">
                      <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col
                    cols="2"
                    :key="index"
                    v-for="(image, index) of allMyImagesPart(
                      myImagesPage,
                      MaxMyImagesInPage
                    )"
                  >
                    <v-hover v-slot="{ hover }">
                      <v-card
                        :elevation="hover ? 12 : 2"
                        :class="{ 'on-hover': hover }"
                      >
                        <v-img :src="image.url">
                          <v-expand-transition>
                            <div
                              v-if="hover"
                              class="transition-fast-in-fast-out blue written-4 v-card--reveal d-flex align-center justify-center"
                              style="height: 100%"
                            >
                              <v-btn icon @click="pushMyImageInContent(image)">
                                <v-icon> mdi-format-align-bottom </v-icon>
                              </v-btn>
                              <v-btn
                                v-if="image.isShow"
                                icon
                                @click="lockMyImage(image)"
                              >
                                <v-icon> mdi-lock-outline </v-icon>
                              </v-btn>
                              <v-btn v-else icon @click="unlockMyImage(image)">
                                <v-icon> mdi-lock-open-outline </v-icon>
                              </v-btn>
                              <v-btn icon @click="deleteMyImage(image)">
                                <v-icon> mdi-delete </v-icon>
                              </v-btn>
                            </div>
                          </v-expand-transition>
                        </v-img>
                      </v-card>
                    </v-hover>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="1">
                    <v-btn icon @click="myImageRight">
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="12">
                <validation-provider rules="required" v-slot="{ errors }">
                  <v-textarea
                    v-model="content"
                    label="내용"
                    :error-messages="errors"
                    @input="inputContent"
                  />
                </validation-provider>
              </v-col>
              <v-col v-html="showContent"> </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-form>
    </validation-observer>
  </v-app>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { createNamespacedHelpers } from "vuex";

const clubsHelper = createNamespacedHelpers("clubs");
const clubPostsHelper = createNamespacedHelpers("clubPosts");
const usersHelper = createNamespacedHelpers("users");

export default {
  layout: "ClubLayout",

  async asyncData({ store, params, redirect }) {
    const clubId = Number(params.id);
    const postId = Number(params.postId);
    await store.dispatch("clubPosts/loadOnePost", { clubId, postId });
    const isPostWriter =
      store.state.clubs?.myClubMember?.id ===
      store.state.clubPosts?.onePost?.ClubMember?.id;
    if (!isPostWriter) {
      redirect("/");
    }
    return {
      title: store.state.clubPosts?.onePost?.title,
      content: store.state.clubPosts?.onePost?.content,
    };
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  computed: {
    ...clubsHelper.mapState(["onlineClub"]),
    ...clubPostsHelper.mapState(["onePost"]),
    ...usersHelper.mapState(["me"]),
  },
  data: () => ({
    myImagesOn: false,
    myImagesPage: 1,
    MaxMyImagesInPage: 5,
    showContent: "",
    files: null,
    timeout: null,
  }),

  methods: {
    ...clubPostsHelper.mapActions(["updatePost"]),
    async onSubmit() {
      try {
        await this.$refs.form.validate();

        await this.updatePost({
          clubId: this.onlineClub.id,
          postId: this.onePost.id,
          body: {
            title: this.title,
            content: this.content,
            showStatus: "normal",
            createdAt: this.onePost.showStatus === "temp" ? new Date() : null,
            updatedAt: new Date(),
          },
        });
        history.back();
      } catch (err) {
        console.log(err);
      }
    },

    async tempSubmit() {
      try {
        if (this.onePost.showStatus !== "temp") return;
        await this.updatePost({
          clubId: this.onlineClub.id,
          postId: this.onePost.id,
          body: {
            title: this.title,
            content: this.content,
            createdAt: new Date(),
            updatedAt: new Date(),
            showStatus: "temp",
          },
        });
        history.back();
      } catch (err) {
        console.error(err);
      }
    },

    async onClickImageUpload() {
      this.$refs.imageInput.click();
    },

    async uploadImages(e) {
      const imageFormData = new FormData();
      // await this.files.forEach((file) => {
      //   images.append("imageFormData", file);
      // });
      [].forEach.call(e.target.files, (file) => {
        imageFormData.append("images", file);
      });
      const images = await this.pushPostImages({
        clubId: this.onlineClub.id,
        images: imageFormData,
      });
      for (let image of images) {
        this.content += `![](${image.url})`;
      }
      this.files = null;
    },
    // 디바운싱
    inputContent() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.showContent = this.$md.render(this.content);
      }, 300);
    },
    myImagesClick() {
      if (!this.myImagesOn) {
        this.myImagesOn = true;
        if (this.myImagesLength <= 0)
          this.loadMyImages({ clubId: this.onlineClub.id });
      } else {
        this.myImagesOn = false;
      }
    },
    myImageLeft() {
      this.myImagesPage =
        this.myImagesPage - 1 > 0
          ? this.myImagesPage - 1
          : Math.ceil(this.myImagesLength / this.MaxMyImagesInPage);
    },
    myImageRight() {
      this.myImagesPage =
        this.myImagesPage <
        Math.ceil(this.myImagesLength / this.MaxMyImagesInPage)
          ? this.myImagesPage + 1
          : 1;
    },

    pushMyImageInContent(image) {
      this.content += `![](${image.url})`;
    },

    async lockMyImage(image) {
      const answer = await confirm(
        "정말 잠그시겠습니까?\n본인만 볼 수 있습니다."
      );
      if (answer) {
        this.updateClubFile({
          clubId: this.onlineClub.id,
          fileId: image.id,
          isShow: false,
        });
      }
    },

    async unlockMyImage(image) {
      const answer = await confirm(
        "정말 잠금을 푸시겠습니까?\n그룹 내 모두가 볼 수 있습니다."
      );
      if (answer) {
        this.updateClubFile({
          clubId: this.onlineClub.id,
          fileId: image.id,
          isShow: true,
        });
      }
    },
    async deleteMyImage(image) {
      const answer = await confirm(
        `정말 삭제하시겠습니까?\n단, 게시물의 이미지는 유지됩니다.\n${image.filename}`
      );
      if (answer) {
        this.removeClubFile({
          clubId: this.onlineClub.id,
          fileId: image.id,
        });
      }
    },
  },
};
</script>

<style>
/* This is for documentation purposes and will not be needed in your application */
</style>
