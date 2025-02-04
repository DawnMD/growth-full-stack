import ProfileDetails from "@/components/profile-details";
import { api } from "@/trpc/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId, redirectToSignIn } = await auth();

  // if user is not logged in, redirect to sign in page
  if (!userId) {
    redirectToSignIn();
  }

  const user = await api.common.checkUserExists();

  // if user is not onboarded, redirect to onboarding page
  if (!user) {
    redirect("/student/create");
  }

  // if user is employee, redirect to employee dashboard
  if (user === "EMPLOYEE") {
    return <div>You don&apos;t have access to this page</div>;
  }

  return <ProfileDetails />;
}
