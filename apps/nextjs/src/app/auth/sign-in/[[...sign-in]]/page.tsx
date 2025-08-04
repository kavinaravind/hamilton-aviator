import type { Metadata } from "next";
import SignIn from "@/components/auth/sign-in";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign In page for authentication.",
};

export default function Page() {
  return <SignIn />;
}
