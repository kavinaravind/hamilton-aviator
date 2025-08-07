"use client";

import { signOutAction } from "@/components/auth/sign-out-action";

import { Button } from "@hamilton/ui/components/ui/button";
import { DropdownMenuItem } from "@hamilton/ui/components/ui/dropdown-menu";

export function SignOutButton({
  size = "lg",
  className = "",
  asDropdownItem = false,
}: {
  size?: "sm" | "lg" | "default";
  className?: string;
  asDropdownItem?: boolean;
}) {
  return (
    <form action={signOutAction}>
      {asDropdownItem ? (
        <DropdownMenuItem asChild>
          <button
            type="submit"
            className={
              className +
              " flex w-full items-center justify-start gap-2 bg-transparent p-0 text-left"
            }
          >
            Sign out
          </button>
        </DropdownMenuItem>
      ) : (
        <Button type="submit" size={size} className={className}>
          Sign out
        </Button>
      )}
    </form>
  );
}
