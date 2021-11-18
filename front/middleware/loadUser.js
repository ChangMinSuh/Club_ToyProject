export default async function ({ app, store }) {
  await store.dispatch("users/loadUser");
}
