import { createClient, type SupabaseClient, type User as SupabaseUser } from "@supabase/supabase-js";
import { COOKIE_NAME } from "@shared/const";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!ENV.supabaseUrl || !ENV.supabaseAnonKey) {
    throw new Error(
      "Supabase Auth is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY."
    );
  }
  if (!_supabase) {
    _supabase = createClient(ENV.supabaseUrl, ENV.supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }
  return _supabase;
}

export function isSupabaseAuthConfigured(): boolean {
  return Boolean(ENV.supabaseUrl && ENV.supabaseAnonKey);
}

export async function loginWithPassword(
  email: string,
  password: string
): Promise<{ accessToken: string; supabaseUser: SupabaseUser }> {
  const { data, error } = await getSupabase().auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data.session) {
    throw new Error(error?.message ?? "Invalid credentials");
  }
  return { accessToken: data.session.access_token, supabaseUser: data.user };
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name?: string
): Promise<{
  accessToken: string | null;
  supabaseUser: SupabaseUser | null;
  needsConfirmation: boolean;
}> {
  const { data, error } = await getSupabase().auth.signUp({
    email,
    password,
    options: { data: { name: name || "" } },
  });
  if (error) {
    throw new Error(error.message);
  }
  const needsConfirmation = !data.session;
  return {
    accessToken: data.session?.access_token ?? null,
    supabaseUser: data.user ?? null,
    needsConfirmation,
  };
}

export async function getUserFromToken(
  accessToken: string
): Promise<SupabaseUser | null> {
  if (!accessToken) return null;
  const { data, error } = await getSupabase().auth.getUser(accessToken);
  if (error || !data.user) return null;
  return data.user;
}

function parseCookies(cookieHeader: string | undefined): Map<string, string> {
  if (!cookieHeader) return new Map();
  return new Map(Object.entries(parseCookieHeader(cookieHeader)));
}

function getSessionToken(req: Request): string | null {
  const cookies = parseCookies(req.headers.cookie);
  let token = cookies.get(COOKIE_NAME) ?? null;
  if (!token) {
    const authHeader = req.headers.authorization;
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }
  }
  return token;
}

async function syncUserFromSupabase(
  supabaseUser: SupabaseUser
): Promise<User> {
  const existing = await db.getUserByOpenId(supabaseUser.id);
  const name =
    (supabaseUser.user_metadata?.name as string | undefined) ??
    supabaseUser.email ??
    null;
  const email = supabaseUser.email ?? null;

  if (existing) {
    const updates: Partial<db.UserUpdate> = { lastSignedIn: new Date() };
    if (name && existing.name !== name) updates.name = name;
    if (email && existing.email !== email) updates.email = email;
    if (Object.keys(updates).length > 0) {
      await db.updateUser(supabaseUser.id, updates);
    }
    const refreshed = await db.getUserByOpenId(supabaseUser.id);
    return refreshed ?? existing;
  }

  await db.upsertUser({
    openId: supabaseUser.id,
    name,
    email,
    loginMethod: "supabase",
    lastSignedIn: new Date(),
  });
  const user = await db.getUserByOpenId(supabaseUser.id);
  if (!user) throw new Error("Failed to create user");
  return user;
}

/**
 * Resolves the authenticated DB user from a request (cookie or Bearer token).
 * Returns null when there is no valid session.
 */
export async function authenticateRequest(req: Request): Promise<User | null> {
  if (!isSupabaseAuthConfigured()) return null;

  const token = getSessionToken(req);
  if (!token) return null;

  const supabaseUser = await getUserFromToken(token);
  if (!supabaseUser) return null;

  try {
    return await syncUserFromSupabase(supabaseUser);
  } catch (error) {
    console.error("[Auth] Failed to sync user from Supabase:", error);
    return null;
  }
}
