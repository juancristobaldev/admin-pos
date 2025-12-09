import React from "react";
import { Providers } from "@/store/providers";
import MyApp from "./app";
import "./global.css";
import { ClientProvider } from "@/store/me";

export const metadata = {
  title: "Modernize Main Demo",
  description: "Modernize Main kit",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <ClientProvider>
            <MyApp>{children}</MyApp>
          </ClientProvider>
        </Providers>
      </body>
    </html>
  );
}
