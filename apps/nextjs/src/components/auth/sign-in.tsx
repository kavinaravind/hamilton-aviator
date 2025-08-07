import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";

import { Button, buttonVariants } from "@hamilton/ui/components/ui/button";
import { cn } from "@hamilton/ui/lib/utils/index";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function SignIn() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/examples/authentication"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 hidden md:right-8 md:top-8",
        )}
      >
        Login
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-2xl font-bold text-white">
            H
          </div>
          Hamilton AI
        </div>
        <div className="relative z-20 mt-auto">
          <div className="rounded-xl bg-zinc-800/80 p-6 shadow-lg ring-1 ring-zinc-700/40">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-md border border-blue-700/30 bg-blue-900/40 px-3 py-1 text-lg font-bold tracking-wide text-blue-300 shadow-sm">
                Hamilton Aviator
              </span>
            </div>
            <blockquote className="space-y-2">
              <p className="text-lg font-medium text-white/90">
                &ldquo;With Hamilton Aviator, I can log flights, track duty
                hours, manage maintenance records, and generate FAA-ready
                reports—all in one place. No more juggling spreadsheets, notes,
                and disconnected tools. It’s the unified solution that
                eliminates risk, inefficiency, and compliance gaps for pilots
                like me.&rdquo;
              </p>
              <footer className="mt-2 flex flex-col gap-0.5 border-l-4 border-blue-500 pl-2 text-xs text-white/60">
                <span className="font-semibold text-white">
                  American Airlines
                </span>
                <span>John Smith</span>
                <span>john@pilot.com</span>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
      <div className="flex h-full items-center justify-center p-4 lg:p-8">
        <div className="flex w-full max-w-md flex-col items-center justify-center space-y-6">
          <form className="flex w-full flex-col gap-4">
            <Button
              size="lg"
              formAction={async () => {
                "use server";
                const res = await auth.api.signInSocial({
                  body: {
                    provider: "google",
                    callbackURL: "/",
                  },
                });
                if (!res.url) {
                  throw new Error("No URL returned from signInSocial");
                }
                redirect(res.url);
              }}
              variant="outline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                className="mr-2 h-5 w-5"
              >
                <g>
                  <path
                    d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.77h5.48c-.24 1.28-.97 2.36-2.07 3.09v2.57h3.34c1.95-1.8 3.05-4.45 3.05-7.43z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10 20c2.7 0 4.97-.89 6.63-2.41l-3.34-2.57c-.93.62-2.12.99-3.29.99-2.53 0-4.68-1.71-5.44-4.01H1.09v2.52C2.82 17.98 6.13 20 10 20z"
                    fill="#34A853"
                  />
                  <path
                    d="M4.56 12.01A5.99 5.99 0 0 1 4.1 10c0-.7.12-1.39.32-2.01V5.47H1.09A9.98 9.98 0 0 0 0 10c0 1.64.39 3.19 1.09 4.53l3.47-2.52z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10 4c1.47 0 2.78.51 3.81 1.51l2.85-2.85C14.97 1.13 12.7 0 10 0 6.13 0 2.82 2.02 1.09 5.47l3.47 2.52C5.32 5.71 7.47 4 10 4z"
                    fill="#EA4335"
                  />
                </g>
              </svg>
              Sign in with Google
            </Button>
            <Button
              size="lg"
              formAction={async () => {
                "use server";
                const res = await auth.api.signInSocial({
                  body: {
                    provider: "github",
                    callbackURL: "/",
                  },
                });
                if (!res.url) {
                  throw new Error("No URL returned from signInSocial");
                }
                redirect(res.url);
              }}
              variant="outline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="mr-2 h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .267.18.578.688.48C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2Z"
                  clipRule="evenodd"
                />
              </svg>
              Sign in with GitHub
            </Button>
          </form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
