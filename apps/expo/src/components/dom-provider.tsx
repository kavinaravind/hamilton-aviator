import "@/globals.css";

import type { PropsWithChildren } from "react";
import { IS_DOM } from "expo/dom";

import { TooltipProvider } from "@hamilton/ui/components/ui/tooltip";

export default function DOMProvider({ children }: PropsWithChildren) {
  if (IS_DOM) {
    return <TooltipProvider>{children}</TooltipProvider>;
  }
  return <>{children}</>;
}
