import "@/global.css";

import { Slot } from "expo-router";
import Head from "expo-router/head";
import { StatusBar } from "expo-status-bar";
import { queryClient } from "@/lib/api";
import { QueryClientProvider } from "@tanstack/react-query";

import { TooltipProvider } from "@hamilton/ui";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  return (
    <>
      <Head>
        <title>Dashboard | Expo App</title>
        <meta
          name="description"
          content="High-performance dashboard built with Expo Router"
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Slot />
        </TooltipProvider>
        <StatusBar style="dark" />
      </QueryClientProvider>
    </>
  );
}
