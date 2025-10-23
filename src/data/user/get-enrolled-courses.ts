import 'server-only'
import { requireUser } from './require-user'
import { prisma } from '@/lib/db'

export async function getEnrolledCourses() {
    const session = await requireUser()

    const data = await prisma.enrollment.findMany({
        where: { userId: session.user.id,status: 'Active'}, // Filter enrollments by the current user's ID
        select:{
            course:{
                select:{
                    id:true,
                    smallDescription:true,
                    title:true,
                    level:true,
                    slug:true,
                    duration:true,
                    chapter:{
                        select:{
                            id:true,
                            lessons:{
                                select:{
                                    id:true,
                                }
                            }

                        }
                    }
                    
                }
            }
        }
    })

    return data
    
}