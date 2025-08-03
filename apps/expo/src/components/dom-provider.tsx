import "@/global.css";

import { IS_DOM } from "expo/dom";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function DOMProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  if (IS_DOM) {
    return <TooltipProvider>{children}</TooltipProvider>;
  }
  return <>{children}</>;
}
