"use client";

import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
} from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="flex items-center text-2xl font-semibold">
          Welcome To MAAP
          <span className="ml-2">👣</span>
        </h1>
      </div>
      <div>
        <SignedIn>
          <Button variant="outline" asChild>
            <SignOutButton />
          </Button>
        </SignedIn>
        <div className="flex gap-4">
          <SignedOut>
            <Button variant="outline" asChild>
              <SignUpButton forceRedirectUrl="/student/create" />
            </Button>
            <Button asChild>
              <SignInButton forceRedirectUrl="/student/dashboard" />
            </Button>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
