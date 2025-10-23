import { requireAdminForAPI } from '@/data/admin/require-admin';

import { initTRPC, TRPCError } from '@trpc/server';

import { cache } from 'react';
import superjson from 'superjson';



export const createTRPCContext = cache(async () => {
  // Fetch session only once and reuse it
  const session = await requireAdminForAPI()
  return { 
    auth: session,  // Store the session in context
    userId: session?.user?.id || null 
  };
});

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = baseProcedure.use(async ({ctx, next}) => {
  // No need to fetch session again, just use what's in context
  if (!ctx.auth) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource'
    });
  }
  
  return next({ctx}); // Pass along the existing context
});

export const adminProcedure = protectedProcedure.use(async ({ctx, next}) => {
  if (ctx.auth?.user.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You must be an admin to access this resource'
    });
  }
  
  return next();
});