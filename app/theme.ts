"use client";

import { createTheme } from "@mui/material/styles";

/**
 * The app's single "style rulebook".
 * Colors, font, and shape live here ONCE. Every Material UI component reads
 * from this — change a value here and the whole app updates at the same time.
 */
const theme = createTheme({
  // Text/layout direction.
  // 'ltr' today (English). When we build the Arabic language switcher we flip
  // this to 'rtl' and the entire layout mirrors right-to-left from this one line.
  direction: "ltr",

  palette: {
    mode: "light",
    primary: { main: "#0F766E" }, // calm clinical teal (trust + medical)
    secondary: { main: "#334155" }, // slate for secondary actions
    background: { default: "#F8FAFC", paper: "#FFFFFF" },
  },

  shape: { borderRadius: 8 },

  typography: {
    // A clean system font stack for now. We'll add an Arabic-capable web font
    // (e.g. IBM Plex Sans Arabic) when we wire up bilingual text.
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
});

export default theme;
