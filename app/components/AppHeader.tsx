"use client";

// A simple top navigation bar so no page is ever a dead end.
// The brand name returns to the home page; "My account" goes to the account
// page — which shows the login form when signed out, or the dashboard when
// signed in. It appears on every page because it lives in the root layout.
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";

export default function AppHeader() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar>
        <Typography
          component={Link}
          href="/"
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            color: "text.primary",
            textDecoration: "none",
          }}
        >
          UAE Telehealth
        </Typography>
        <Button component={Link} href="/account" color="primary">
          My account
        </Button>
      </Toolbar>
    </AppBar>
  );
}
