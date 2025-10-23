import 'server-only'
import { prisma } from '@/lib/db'


export const getAllCourses = async () => {

    const data  = await prisma.course.findMany({
        where:{
      status: 'PUBLISHED'

        },
        select:{
            title: true,
            id: true,
            slug: true,
            description: true,
            price: true,
         level: true,
         duration: true,
         category: true,
         fileKey: true,
         smallDescription: true,

        },
        orderBy:{
            updatedAt: 'desc'
        } // Order by recently updated
    })

    return data


}

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[0]