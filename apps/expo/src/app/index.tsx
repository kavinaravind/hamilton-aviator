import { useEffect } from "react";
import { useRouter } from "expo-router";
import { authClient } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.replace("/auth/sign-in");
    } else {
      router.replace("/dashboard");
    }
  }, [session, isPending, router]);

  return null;
}
