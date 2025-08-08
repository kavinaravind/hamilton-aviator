import { useEffect } from "react";
import { usePathname, useRouter } from "expo-router";
import { authClient } from "@/lib/auth";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    // Prevent navigation while loading
    if (isPending) {
      return;
    }

    // Allow /terms and /privacy to be accessed without redirect
    if (pathname.startsWith("/terms") || pathname.startsWith("/privacy")) {
      return;
    }

    // Redirect users based on their authentication status
    if (!session) {
      router.replace("/auth/sign-in");
    } else {
      router.replace("/dashboard");
    }
  }, [session, isPending, router, pathname]);

  return null;
}
