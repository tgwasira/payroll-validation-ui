// @ts-nocheck
"use client";

// import { SearchInput } from "@algion-co/react-ui-library";
import { SSEProvider } from "@algion-co/react-ui-library";
// import { WebSocketProvider } from "@algion-co/react-ui-library";
// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import { notFound } from "next/navigation";
// import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { SkeletonTheme } from "react-loading-skeleton";
// import { Bounce } from "react-toastify";

export default function Providers({ locale, children }) {
  return (
    <SSEProvider>
      <ThemeProvider>
        <SkeletonTheme
          baseColor="var(--color-skeleton-base)"
          highlightColor="var(--color-skeleton-highlight)"
        >
          {children}
        </SkeletonTheme>
      </ThemeProvider>
    </SSEProvider>
  );
}
