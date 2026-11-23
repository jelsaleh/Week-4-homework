"use client";

// Medical intake form for one case. On submit it inserts a row into `intakes`
// with the answers as jsonb. The write-RLS policy `intakes: patient inserts via
// case` (with check can_access_case(case_id)) allows it only if you own the case.
//
// useParams() reads the case id from the URL at runtime, so the form is wrapped
// in <Suspense> — Next.js 16 needs runtime-only hooks inside a Suspense boundary
// so the static shell can prerender while this streams in.
import { Suspense, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

function IntakeForm() {
  const params = useParams();
  const router = useRouter();
  const caseId = String(params.id);

  const [reason, setReason] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: insertError } = await supabase.from("intakes").insert({
      case_id: caseId,
      answers: { reason, symptoms },
    });
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setDone(true);
  }

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit}
      spacing={3}
      sx={{ width: "100%", py: 8 }}
    >
      <Typography variant="h4" component="h1" fontWeight={700}>
        Medical intake
      </Typography>
      <Typography color="text.secondary">Case {caseId.slice(0, 8)}</Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {done ? (
        <>
          <Alert severity="success">Intake submitted.</Alert>
          <Button variant="contained" onClick={() => router.push("/account")}>
            Back to dashboard
          </Button>
        </>
      ) : (
        <>
          <TextField
            label="Reason for visit"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            multiline
            minRows={2}
            fullWidth
          />
          <TextField
            label="Current symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            multiline
            minRows={2}
            fullWidth
          />
          <Button type="submit" variant="contained" size="large" disabled={loading}>
            {loading ? "Submitting…" : "Submit intake"}
          </Button>
          <Button variant="text" onClick={() => router.push("/account")}>
            Cancel
          </Button>
        </>
      )}
    </Stack>
  );
}

export default function IntakePage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <Suspense fallback={<Typography>Loading…</Typography>}>
          <IntakeForm />
        </Suspense>
      </Box>
    </Container>
  );
}
