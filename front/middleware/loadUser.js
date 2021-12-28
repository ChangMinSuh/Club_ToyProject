export default async function ({ app, store, params }) {
  const clubId = Number(params?.id);
  await store.dispatch("users/loadUser");
  if (clubId) {
    store.dispatch("clubs/loadMyClubMember", { clubId });
  }
}
