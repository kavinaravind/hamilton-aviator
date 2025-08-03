import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/server";

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    return redirect("/auth/sign-in");
  } else {
    redirect("/dashboard");
  }
}
