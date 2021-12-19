export default async function ({ store, params, redirect }) {
  const clubId = Number(params.id);

  if (!store.state.users.me?.clubManagers.includes(clubId)) {
    redirect("/");
  }
}
