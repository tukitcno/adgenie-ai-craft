// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kquoostkrnrcoihjrxpr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxdW9vc3Rrcm5yY29paGpyeHByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4ODQwNTcsImV4cCI6MjA1OTQ2MDA1N30.OAz_gr9CTOmPD9IQVzLq9hmjze3p0tnbLEw2OOoENp4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);