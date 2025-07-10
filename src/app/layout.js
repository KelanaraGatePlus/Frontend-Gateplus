/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
"use client";

import store from "@/hooks/store/store.js";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Zain } from "next/font/google";
import { Provider } from "react-redux";
import "./globals.css";

const zain = Zain({
  variable: "--font-zain",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  weight: ["200", "400", "700", "800"],
});

export default function RootLayout({ children }) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body className={`${zain.variable} antialiased`}>
          <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
        </body>
      </html>
    </Provider>
  );
}
