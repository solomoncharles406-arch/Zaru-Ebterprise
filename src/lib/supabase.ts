import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
// Clean up URL in case user copied the REST endpoint (/rest/v1/) rather than project base URL
const rawUrl = (
  import.meta.env.VITE_SUPABASE_URL || 'https://kcevlvpoaxoskiglzifk.supabase.co'
).trim();

// Strip /rest/v1 or /rest/v1/ or any trailing slashes to ensure Auth, Storage, and REST all work
export const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');

export const supabaseAnonKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjZXZsdnBvYXhvc2tpZ2x6aWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1MDcwMzgsImV4cCI6MjEwODA4MzAzOH0.dWXAYzDR4fxbXcCqlqoWg7CXR86HVBswRNaqtKKFSa8'
).trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Check if the Supabase connection is reachable
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Connected successfully to Supabase!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Connection failed' };
  }
}
