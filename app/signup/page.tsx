"use client";

// Sign-up screen. A client component ("use client") because it holds form state
// and talks to Supabase from the browser. On submit it calls supabase.auth.signUp;
// Supabase creates the login, and our database trigger auto-creates the profile.
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // full_name is passed as user metadata; the DB trigger reads it when it
    // creates the matching profiles row. role is NOT sent (always 'patient').
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setSuccess(true);
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <Stack
          component="form"
          onSubmit={handleSubmit}
          spacing={3}
          sx={{ width: "100%", py: 8 }}
        >
          <Typography variant="h4" component="h1" fontWeight={700}>
            Create your account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign up to access the UAE telehealth platform.
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}
          {success && (
            <Alert severity="success">
              Account created. If email confirmation is on, check your inbox, then log in.
            </Alert>
          )}

          <TextField
            label="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            slotProps={{ htmlInput: { minLength: 6 } }}
            helperText="At least 6 characters."
            fullWidth
          />
          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? "Creating account…" : "Sign up"}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
