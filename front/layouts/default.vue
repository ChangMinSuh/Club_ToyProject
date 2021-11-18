<template>
  <v-app>
    <AppBar />
    <NavigationDrawer />

    <v-main>
      <Nuxt />
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const usersHelper = createNamespacedHelpers("users");

export default {
  data() {
    return {
      drower: false,
    };
  },

  computed: {
    ...usersHelper.mapState(["me", "AccessTokenExpired"]),
  },
};
</script>

<style></style>
