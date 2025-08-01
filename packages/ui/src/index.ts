import { cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: Parameters<typeof cx>) => twMerge(cx(inputs));

export { cn };

// Export colors
export { colors } from "./colors";

// Export icons
export { StyledTabBarIcon } from "./icons";

// Export layouts
export { StyledPageLayout } from "./layouts";

// Export components
export { Button } from "./components/button";
export { DropdownMenu } from "./components/dropdown-menu";
export {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from "./components/form";
export { Input } from "./components/input";
export { Label } from "./components/label";
export { ThemeProvider, ThemeToggle } from "./components/theme";
export { toast, Toaster } from "./components/toast";
