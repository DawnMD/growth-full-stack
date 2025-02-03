import ProfileDetails from "@/components/profile-details";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const authedUser = await api.userProfile.checkUserExists();

  if (!authedUser) {
    redirect("/complete-profile");
  }

  return <ProfileDetails />;
}
