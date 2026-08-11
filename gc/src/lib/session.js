import { supabase } from './supabase';

export async function getSessionId() {
  if (typeof window === 'undefined') {
    return null;
  }

  // Check whether we already have a Supabase session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    return session.user.id;
  }

  // No session → create an anonymous Supabase user
  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    console.error('Anonymous sign-in failed:', error);
    return null;
  }

  return data.user.id;
}