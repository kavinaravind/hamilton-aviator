"use client";

import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export function ClientAuthProvider({ children }: PropsWithChildren) {
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!session && !isPending) {
      redirect("/auth/sign-in");
    }
  }, [session, isPending]);

  if (!session || isPending) {
    return null;
  }

  return <>{children}</>;
}
