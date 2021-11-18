<template>
  <v-app>
    <v-container>
      <br />
      <h2>회원가입</h2>
      <validation-observer ref="form" v-slot="{ invalid }">
        <form @submit.prevent="onSubmit">
          <validation-provider
            rules="required|email|max:60"
            v-slot="{ errors }"
          >
            <v-text-field
              v-model="email"
              label="email"
              :error-messages="errors"
            />
          </validation-provider>
          <validation-provider
            name="nickname"
            rules="required|minmax:2,20"
            v-slot="{ errors }"
          >
            <v-text-field
              v-model="nickname"
              label="nickname"
              :error-messages="errors"
            />
          </validation-provider>
          <validation-provider
            name="password"
            rules="required|minmax:3,15"
            v-slot="{ errors }"
          >
            <v-text-field
              v-model="password"
              label="password"
              type="password"
              :error-messages="errors"
            />
          </validation-provider>
          <validation-provider
            name="password check"
            rules="required|minmax:3,15|password:@password"
            v-slot="{ errors }"
          >
            <v-text-field
              v-model="passwordCheck"
              label="password check"
              type="password"
              :error-messages="errors"
            />
          </validation-provider>
          <v-btn type="submit" :disabled="invalid"> SignUp </v-btn>
        </form>
      </validation-observer>
    </v-container>
  </v-app>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { createNamespacedHelpers } from "vuex";

const usersHelper = createNamespacedHelpers("users");

export default {
  data() {
    return {
      email: "",
      nickname: "",
      password: "",
      passwordCheck: "",
    };
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  computed: {
    ...usersHelper.mapState(["serverRes"]),
  },
  methods: {
    ...usersHelper.mapActions(["signup", "setServerRes"]),

    async onSubmit() {
      try {
        await this.$refs.form.validate();
        await this.signup({
          email: this.email,
          nickname: this.nickname,
          password: this.password,
        });
        if (!!this.serverRes && this.serverRes.status >= 400) {
          alert(this.serverRes.message);
        } else {
          history.back();
        }
      } catch (err) {
        alert(this.serverRes.message);
      }
      this.setServerRes(null);
    },
  },
};
</script>

<style></style>
