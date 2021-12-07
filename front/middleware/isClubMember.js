export default async function ({ store, params, redirect }) {
  const clubName = params.name;
  const isClubMember = await store.dispatch("clubs/loadOneClubByName", {
    clubName,
  });
  if (!isClubMember) {
    redirect("/");
  }
}
