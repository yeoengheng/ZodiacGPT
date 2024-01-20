
import { createClient } from '@supabase/supabase-js'
import { Database } from '../types'


const SUPABASE_URL = process.env.SUPABASE_URL;
if (!SUPABASE_URL) {
    throw new Error("SUPABASE_URL is not defined");
}

const SUPABASE_PUBLIC_KEY = process.env.SUPABASE_PUBLIC_KEY;
if (!SUPABASE_PUBLIC_KEY) {
    throw new Error("SUPABASE_PUBLIC_KEY is not defined");
}

const supabase = createClient<Database>(
    SUPABASE_URL, 
    SUPABASE_PUBLIC_KEY
);

export default supabase