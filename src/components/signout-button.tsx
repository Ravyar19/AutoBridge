"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function SignoutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      onSuccess: () => {
        toast.success("Successfully signed out");
        router.push("/login");
      },
      onError: (ctx) => {
        toast.error(ctx.error.message);
      },
    });
  };

  return (
    <Button onClick={handleSignOut} variant="outline">
      Sign Out
    </Button>
  );
}
