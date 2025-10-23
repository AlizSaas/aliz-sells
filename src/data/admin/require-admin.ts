import 'server-only'
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from 'react'
import { TRPCError } from '@trpc/server';

// Base cached function that gets session
export const getAuthSession = cache(async() => {
  console.log("🔒 Fetching auth session...")
  const session = await auth.api.getSession({
    headers: await headers()
  });
  console.log("✓ Auth session fetched")
  return session;
});

// For UI routes
export const requireAdmin = cache(async() => {
  const session = await getAuthSession();
  
  if (!session) {
    return redirect('/login')
  }

  if (session.user.role !== 'admin') {
    return redirect('/not-admin')
  }

  console.log("Admin UI verification for:", session.user.email)
  return session;
});


// For API routes
export const requireAdminForAPI = cache(async() => {
  const session = await getAuthSession();
  
  if (!session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource'
    });
  }

  if (session.user.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You must be an admin to access this resource'
    });
  }
  
  console.log("Admin API verification for:", session.user.email)
  return session;
});