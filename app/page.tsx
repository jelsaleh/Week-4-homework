import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";

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
            label="UAE • Telehealth MVP"
            color="primary"
            variant="outlined"
            sx={{ alignSelf: "flex-start" }}
          />
          <Typography variant="h3" component="h1" fontWeight={700}>
            Peptide &amp; IV Telehealth
          </Typography>
          <Typography variant="body1" color="text.secondary">
            A compliant, bilingual platform for UAE patients. This is our working
            skeleton — now wearing Material UI.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" size="large">
              Get started
            </Button>
            <Button variant="outlined" size="large">
              Learn more
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}
