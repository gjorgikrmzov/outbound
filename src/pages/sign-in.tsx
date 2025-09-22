"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export default function SignIn() {
  const { query } = useRouter();
  const err = query.error as string | undefined;

  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="rounded-xl border p-6">
        <h1 className="text-xl font-semibold mb-4">Sign in</h1>
        <Button onClick={() => signIn("google", { callbackUrl: "/" })}>
          Continue with Google
        </Button>
      </div>

      {err && (
        <p className="mt-3 text-sm text-red-600">
          {err === "AccessDenied"
            ? "Your email isn’t allowed. Use your asyncawake.agency account."
            : `Sign-in failed: ${err}`}
        </p>
      )}
    </div>
  );
}
