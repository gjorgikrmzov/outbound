"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="rounded-xl border p-6">
        <h1 className="text-xl font-semibold mb-4">Sign in</h1>
        <Button onClick={() => signIn("google", { callbackUrl: "/" })}>
          Continue with Google
        </Button>
      </div>
    </div>
  );
}
