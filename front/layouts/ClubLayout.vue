<template>
  <v-app>
    <AppBar />
    <NavigationDrawer />
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

          <v-col cols="10">
            <v-card rounded="lg">
              <v-container>
                <Nuxt />
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <ClubChat />
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

const clubsHelper = createNamespacedHelpers("clubs");

export default {
  middleware: ["isClubMember"],
  computed: {
    ...clubsHelper.mapState(["onlineClub"]),
  },
};
</script>

<style></style>
