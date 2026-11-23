// The app's single "configured phone line" to Supabase.
// It reads the Project URL + publishable key from .env.local, so the SAME code
// works on your laptop and on Vercel — only the env values differ.
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

// Build it once, import it anywhere: `import { supabase } from "@/lib/supabaseClient"`.
// The client automatically attaches the logged-in user's session to each request,
// so Row-Level Security (auth.uid()) just works.
export const supabase = createClient(supabaseUrl, supabasePublishableKey);
