export default async function ({ store, params, redirect }) {
  const clubId = Number(params.id);
  const clubMembers = store.state.users.me?.ClubMembers;
  if (!clubMembers) redirect("/");

  const isManager =
    clubMembers.find(({ ClubId }) => ClubId === clubId).role === "manager";

  if (!isManager) {
    redirect("/");
  }
}
