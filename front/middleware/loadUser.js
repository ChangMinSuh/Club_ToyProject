export default async function ({ app, store, params, $axios }) {
  const clubId = Number(params?.id);
  await store.dispatch("users/loadUser");
  if (clubId) {
    store.dispatch("clubs/loadMyClubMember", { clubId });
  }
}
