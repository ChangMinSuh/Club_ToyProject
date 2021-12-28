<template>
  <v-app>
    <v-container>
      <br />
      <h2>동아리 만들기</h2>
      <validation-observer ref="form" v-slot="{ invalid }">
        <form @submit.prevent="onSubmit">
          <validation-provider rules="required|max:30" v-slot="{ errors }">
            <v-text-field
              v-model="name"
              label="* name"
              :error-messages="errors"
            />
          </validation-provider>
          <validation-provider rules="max:100" v-slot="{ errors }">
            <v-text-field
              v-model="explanation"
              label="explanation"
              :error-messages="errors"
            />
          </validation-provider>
          <v-divider />
          <validation-provider rules="max:20" v-slot="{ errors }">
            <v-text-field
              v-model="nickname"
              label="nickname in club"
              :error-messages="errors"
            />
          </validation-provider>
          <v-btn type="submit" :disabled="invalid"> create </v-btn>
        </form>
      </validation-observer>
    </v-container>
  </v-app>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { createNamespacedHelpers } from "vuex";

const usersHelper = createNamespacedHelpers("users");
const clubsHelper = createNamespacedHelpers("clubs");

export default {
  asyncData({ store }) {
    return {
      nickname: store.state.users.me?.nickname,
    };
  },
  data() {
    return {
      name: "",
      explanation: "",
    };
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  computed: {
    ...clubsHelper.mapState(["serverRes"]),
  },
  methods: {
    ...usersHelper.mapActions(["loadUser"]),
    ...clubsHelper.mapActions(["createClubs"]),

    async onSubmit() {
      try {
        await this.$refs.form.validate();
        await this.loadUser();
        await this.createClubs({
          name: this.name,
          explanation: this.explanation,
          nickname: this.nickname,
        });
        if (!!this.serverRes && this.serverRes.status >= 400) {
          alert(this.serverRes.message);
        } else {
          history.back();
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style></style>
