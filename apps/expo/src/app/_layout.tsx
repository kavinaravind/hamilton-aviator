import "@/globals.css";

import { Slot } from "expo-router";
import Head from "expo-router/head";
import { StatusBar } from "expo-status-bar";
import { queryClient } from "@/lib/api";
import { QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout() {
  return (
    <>
      <Head>
        <title>Hamilton Path</title>
        <meta
          name="description"
          content="Log flights, track duty hours, manage maintenance records, and generate FAA-ready reports."
        />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Slot />
        <StatusBar style="dark" />
      </QueryClientProvider>
    </>
  );
}
