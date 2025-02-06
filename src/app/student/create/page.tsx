import PersonalInfoForm from "@/components/personal-info-form";
import { api } from "@/trpc/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function StudentCreatePage() {
  const { userId, redirectToSignIn } = await auth();

  // if user is not logged in, redirect to sign in page
  if (!userId) {
    redirectToSignIn();
  }

  const isUserAlreadyOnboarded = await api.common.checkUserExists();

  // if user is student and already present in the database, redirect to student dashboard
  if (isUserAlreadyOnboarded && isUserAlreadyOnboarded === "STUDENT") {
    redirect("/student/dashboard");
  }

  // if user is employee and already present in the database, redirect to employee dashboard
  if (isUserAlreadyOnboarded && isUserAlreadyOnboarded === "EMPLOYEE") {
    redirect("/employee/dashboard");
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Personal Information</h1>
      <PersonalInfoForm />
    </div>
  );
}
