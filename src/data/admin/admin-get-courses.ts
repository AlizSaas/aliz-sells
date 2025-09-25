import 'server-only'
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetCourses() {
 await requireAdmin();
  const data = await prisma.course.findMany({
    select: {
      id: true,
      title: true,

      price: true,
      level: true,

      status: true,
      duration: true,
      slug: true,
      fileKey: true,
      smallDescription: true,
    },
    orderBy: {
      createdAt: "desc",
    }, // most recent first
  });

    return data;
}


export type AdminCoursesType = Awaited<ReturnType<typeof adminGetCourses>>[0]; // type of a single course object