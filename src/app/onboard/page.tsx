import { api } from "@/trpc/server";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OnboardPage() {
  const { userId, redirectToSignIn } = await auth();

  // if user is not logged in, redirect to sign in page
  if (!userId) {
    redirectToSignIn();
  }

  const isUserAlreadyOnboarded = await api.common.checkUserExists();

  // if user is already onboarded as student, redirect to student dashboard
  if (isUserAlreadyOnboarded && isUserAlreadyOnboarded === "STUDENT") {
    redirect("/student/dashboard");
  }

  // if user is already onboarded as employee, redirect to employee dashboard
  if (isUserAlreadyOnboarded && isUserAlreadyOnboarded === "EMPLOYEE") {
    redirect("/employee/dashboard");
  }

  // if user is not onboarded, show the onboarding page
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Select type of user</h1>

      <div className="flex flex-col gap-4">
        <Link href="/employee/create">
          <button className="rounded-md bg-blue-500 px-4 py-2 text-white">
            Employee
          </button>
        </Link>
        <Link
          href="/student/create"
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
        >
          Student
        </Link>
      </div>
    </div>
  );
}
