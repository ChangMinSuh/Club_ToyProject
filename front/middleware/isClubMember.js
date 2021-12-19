export default async function ({ store, params, redirect }) {
  const clubId = params.id;
  const isClubMember = await store.dispatch("clubs/loadOneClubById", {
    clubId,
  });
  if (!isClubMember) {
    redirect("/");
  }
}
