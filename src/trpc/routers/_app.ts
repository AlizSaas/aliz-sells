

import { adminRouter } from '@/data/admin/server/router';
import {  createTRPCRouter, protectedProcedure } from '../init';
import { prisma } from '@/lib/db';
import { TRPCError } from '@trpc/server';



export const appRouter = createTRPCRouter({
    adminRoutes:adminRouter



});
// export type definition of API
export type AppRouter = typeof appRouter;