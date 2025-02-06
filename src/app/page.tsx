"use client";

import { Button } from "@/components/ui/button";
import { useAuth, useClerk } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const { isSignedIn } = useAuth();

  const { signOut } = useClerk();

  return (
    <div>
      {isSignedIn ? (
        <Button
          onClick={() =>
            signOut({
              redirectUrl: "/",
            })
          }
        >
          Sign out
        </Button>
      ) : (
        <Button asChild>
          <Link href="/onboard">Sign in</Link>
        </Button>
      )}
    </div>
  );
}
