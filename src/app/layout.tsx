import React from "react";
import { Providers } from "@/store/providers";
import MyApp from "./app";
import "./global.css";
import { ClientProvider } from "@/store/me";

export const metadata = {
  title: "Easy Flow",
  description: "Easy Flow",
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
