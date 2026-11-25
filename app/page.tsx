"use client";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Link from "next/link";

/**
 * Home page — now built from Material UI blocks instead of hand-written HTML.
 * Each capitalised tag (Container, Stack, Typography, Button...) is a ready-made,
 * accessible component from MUI, styled by our theme.ts rulebook.
 */
export default function Home() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <Stack spacing={3} sx={{ py: 8, width: "100%" }}>
          <Chip
            label="UAE • Telehealth"
            color="primary"
            variant="outlined"
            sx={{ alignSelf: "flex-start" }}
          />
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
            Peptide &amp; IV Telehealth, from home
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Book an online consultation with a licensed clinician, complete your
            medical intake, and manage your care — all in one place.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button component={Link} href="/signup" variant="contained" size="large">
              Get started
            </Button>
            <Button component={Link} href="/account" variant="outlined" size="large">
              Log in
            </Button>
          </Stack>

          <Box sx={{ pt: 2 }}>
            <Typography variant="overline" color="text.secondary">
              How it works
            </Typography>
            <Stack spacing={1.5} sx={{ mt: 1 }}>
              {["Create your account", "Book a consultation", "Complete your medical intake"].map(
                (step, i) => (
                  <Stack key={step} direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                    <Chip label={i + 1} color="primary" size="small" />
                    <Typography>{step}</Typography>
                  </Stack>
                ),
              )}
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}
