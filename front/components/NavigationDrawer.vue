<template>
  <v-navigation-drawer app permanent :mini-variant.sync="mini">
    <v-list>
      <v-list-item>
        <v-spacer />
        <v-list-item-icon>
          <v-icon @click="mini = true">mdi-arrow-left</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <!-- 로그인 전 -->
      <div v-if="!me">
        <v-list-group prepend-icon="mdi-account-lock" no-action>
          <template #activator>
            <v-list-item-title>LogIn</v-list-item-title>
          </template>
          <v-container>
            <validation-observer ref="form" v-slot="{ invalid }">
              <form @submit.prevent="onSubmit">
                <validation-provider rules="required|email" v-slot="{ errors }">
                  <v-text-field
                    v-model="email"
                    label="email"
                    :error-messages="errors"
                  />
                </validation-provider>
                <validation-provider
                  name="password"
                  rules="required"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    v-model="password"
                    label="password"
                    type="password"
                    :error-messages="errors"
                  />
                </validation-provider>
                <nav>
                  <v-spacer />
                  <v-btn type="submit" :disabled="invalid"> LogIn </v-btn>
                  <v-btn dark to="/signup" nuxt> SignUp </v-btn>
                </nav>
              </form>
            </validation-observer>
          </v-container>
        </v-list-group>
      </div>
      <!-- 로그인 후 -->
      <div v-else>
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-avatar color="blue">
              <span class="white--text text-h5">{{ meAvatar }}</span>
            </v-avatar>
          </v-list-item-avatar>
          <v-spacer />
          <v-list-item-action>
            <v-btn @click="logoutBtn"> logout</v-btn>
          </v-list-item-action>
        </v-list-item>

        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="text-h6"></v-list-item-title>
            <v-list-item-subtitle>{{ me.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

        <v-list nav dense>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-folder</v-icon>
            </v-list-item-icon>
            <v-list-item-title>My Files</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-account-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Shared with me</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-star</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Starred</v-list-item-title>
          </v-list-item>
        </v-list>
      </div>
    </v-list>
    <v-divider></v-divider>
  </v-navigation-drawer>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
import { ValidationProvider, ValidationObserver } from "vee-validate";

const usersHelper = createNamespacedHelpers("users");
const clubsHelper = createNamespacedHelpers("clubs");

export default {
  data: () => ({
    mini: true,
    valid: true,
    email: "",
    password: "",
  }),
  computed: {
    ...usersHelper.mapState(["me", "serverRes"]),
    ...usersHelper.mapGetters(["meAvatar"]),
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  methods: {
    ...usersHelper.mapActions(["login", "logout", "setServerRes"]),
    ...clubsHelper.mapActions(["loadMyClubs", "setMyClubs"]),
    async onSubmit() {
      try {
        await this.$refs.form.validate();
        const res = await this.login({
          email: this.email,
          password: this.password,
        });
        if (!!this.serverRes && this.serverRes.status >= 400) {
          alert(this.serverRes.message);
        }
      } catch (err) {
        alert(this.serverRes.message);
      }
      this.setServerRes(null);
      this.loadMyClubs();
    },
    async logoutBtn() {
      await this.logout();
      this.setMyClubs([]);
    },
  },
};
</script>

<style></style>
