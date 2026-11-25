"use client";

// Auth-aware page: login form when signed out; a patient dashboard when signed in.
// The dashboard books a consultation (inserts a `case`, exercising the write-RLS
// `with check` policy) and lists the patient's own cases (read RLS shows only theirs).
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import MuiLink from "@mui/material/Link";
import Link from "next/link";
import { useRouter } from "next/navigation";

type CaseRow = { id: string; stage: string; created_at: string };

export default function AccountPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [fullName, setFullName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cases, setCases] = useState<CaseRow[]>([]);
  const [booking, setBooking] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);
  const router = useRouter();

  // Track the login session.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoadingSession(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Load this patient's name + their cases (RLS returns only their own).
  const loadData = useCallback(async () => {
    if (!session) {
      setCases([]);
      setFullName("");
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", session.user.id)
      .single();
    setFullName(profile?.full_name ?? "");

    const { data: caseRows } = await supabase
      .from("cases")
      .select("id, stage, created_at")
      .order("created_at", { ascending: false });
    setCases(caseRows ?? []);
  }, [session]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  async function handleBook() {
    if (!session) return;
    setBookError(null);
    setBooking(true);
    // Create a case owned by this patient (write-RLS `with check` verifies
    // patient_id = auth.uid()). `.select().single()` returns the new row so we
    // can go straight to its intake form — matching the real patient flow.
    const { data, error: insertError } = await supabase
      .from("cases")
      .insert({ patient_id: session.user.id })
      .select("id")
      .single();
    setBooking(false);
    if (insertError || !data) {
      setBookError(insertError?.message ?? "Could not create the case.");
      return;
    }
    router.push(`/intake/${data.id}`);
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

  // --- Patient dashboard ---
  if (session) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
          <Stack spacing={3} sx={{ width: "100%", py: 8 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Welcome, {fullName || session.user.email}
            </Typography>
            <Typography color="text.secondary">
              Book a consultation to start your care journey.
            </Typography>

            {bookError && <Alert severity="error">{bookError}</Alert>}

            <Button
              variant="contained"
              size="large"
              onClick={handleBook}
              disabled={booking}
            >
              {booking ? "Booking…" : "Book a consultation"}
            </Button>

            <Typography variant="h6" component="h2">
              Your cases
            </Typography>
            {cases.length === 0 ? (
              <Typography color="text.secondary">No consultations yet.</Typography>
            ) : (
              <Stack spacing={1}>
                {cases.map((c) => (
                  <Box
                    key={c.id}
                    sx={{
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>
                          Case {c.id.slice(0, 8)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(c.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Chip label={c.stage} color="primary" variant="outlined" />
                    </Box>
                    <Button
                      component={Link}
                      href={`/intake/${c.id}`}
                      size="small"
                      sx={{ mt: 1 }}
                    >
                      Add intake
                    </Button>
                  </Box>
                ))}
              </Stack>
            )}

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
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
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
          <Typography variant="body2" color="text.secondary">
            Need an account?{" "}
            <MuiLink component={Link} href="/signup">
              Sign up
            </MuiLink>
          </Typography>
        </Stack>
      </Box>
    </Container>
  );
}
