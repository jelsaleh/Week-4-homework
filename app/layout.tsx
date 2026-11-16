import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "UAE Telehealth Platform",
  description:
    "Compliant, bilingual telehealth for peptide therapy & IV treatments in the UAE.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // lang + dir are our bilingual hooks.
    // Today: English, left-to-right. For Arabic we switch to lang="ar" dir="rtl"
    // (and flip theme.direction to 'rtl') when we build the language switcher.
    <html lang="en" dir="ltr">
      <body>
        {/*
          Three wrappers, outside-in:
          - AppRouterCacheProvider: renders MUI's styles on the SERVER so the
            page looks right on first paint (no unstyled flash).
          - ThemeProvider: hands every component our style rulebook (theme.ts).
          - CssBaseline: a clean, consistent starting point across browsers.
        */}
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
