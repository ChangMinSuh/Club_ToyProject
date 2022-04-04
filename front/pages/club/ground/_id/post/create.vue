<template>
  <v-app>
    <validation-observer ref="form" v-slot="{ invalid }">
      <v-form @submit.prevent="onSubmit">
        <v-card-title> 글 작성 </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-spacer></v-spacer>
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
                  color="purple lighten-4"
                  @click="onClickImageUpload"
                >
                  <div style="color: white">이미지 업로드</div>
                </v-btn>
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
    showContent: "",
    files: null,
    timeout: null,
  }),

  methods: {
    ...clubPostsHelper.mapActions(["pushPost", "pushPostImages"]),

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
      console.log(imageFormData);
      const links = await this.pushPostImages({
        clubId: this.onlineClub.id,
        images: imageFormData,
      });
      for (let link of links) {
        this.content += `![](${link})`;
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
  },
};
</script>

<style>
/* This is for documentation purposes and will not be needed in your application */
</style>
