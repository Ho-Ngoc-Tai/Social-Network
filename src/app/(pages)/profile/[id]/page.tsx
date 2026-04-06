import { ProfileView } from "../../../features/profile/ProfileView";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: encodedId } = await params;
  const id = decodeURIComponent(encodedId);

  return <ProfileView id={id} />;
}
