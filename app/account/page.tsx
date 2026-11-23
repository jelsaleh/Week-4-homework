"use client";

// Auth-aware page: shows a login form when signed out, and a "signed-in" view
// when signed in. The signed-in view lists the profiles this user is allowed to
// see — which, thanks to RLS, is only their OWN row. That's our RLS proof.
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

type Profile = { id: string; full_name: string; role: string };

export default function AccountPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [profiles, setProfiles] = useState<Profile[]>([]);

  // Track the login session (and keep it in sync on login/logout).
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoadingSession(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // When signed in, load the profiles RLS lets this user see.
  useEffect(() => {
    if (!session) {
      setProfiles([]);
      return;
    }
    supabase
      .from("profiles")
      .select("id, full_name, role")
      .then(({ data }) => setProfiles(data ?? []));
  }, [session]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (signInError) setError(signInError.message);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (loadingSession) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
          <Typography>Loading…</Typography>
        </Box>
      </Container>
    );
  }

  // --- Signed-in view (with the RLS demo) ---
  if (session) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
          <Stack spacing={3} sx={{ width: "100%", py: 8 }}>
            <Typography variant="h4" component="h1" fontWeight={700}>
              You&apos;re signed in
            </Typography>
            <Typography color="text.secondary">
              Logged in as <strong>{session.user.email}</strong>.
            </Typography>

            <Typography variant="h6" component="h2">
              Profiles you can see
            </Typography>
            <Alert severity="info">
              RLS returns only the rows you&apos;re allowed to see — you should see
              exactly one: your own.
            </Alert>
            <Stack spacing={1}>
              {profiles.map((p) => (
                <Box
                  key={p.id}
                  sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}
                >
                  <Typography fontWeight={600}>{p.full_name || "(no name)"}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    role: {p.role}
                  </Typography>
                </Box>
              ))}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Rows visible to you: <strong>{profiles.length}</strong>
            </Typography>

            <Button variant="outlined" onClick={handleLogout}>
              Log out
            </Button>
          </Stack>
        </Box>
      </Container>
    );
  }

  // --- Login form ---
  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <Stack
          component="form"
          onSubmit={handleLogin}
          spacing={3}
          sx={{ width: "100%", py: 8 }}
        >
          <Typography variant="h4" component="h1" fontWeight={700}>
            Log in
          </Typography>
          <Typography color="text.secondary">Access your telehealth account.</Typography>
          {error && <Alert severity="error">{error}</Alert>}
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
            autoComplete="current-password"
            fullWidth
          />
          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
