import PersonalInfoForm from "@/components/personal-info-form";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function CompleteProfilePage() {
  const authedUser = await api.userProfile.checkUserExists();

  if (authedUser) {
    redirect("/dashboard");
  }

  return <PersonalInfoForm />;
}
