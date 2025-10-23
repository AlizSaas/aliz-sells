import 'server-only'
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'


export async function getIndividualCourse(slug:string) {
    const course = await prisma.course.findUnique({
        where:{
            slug
        },
        select:{
            id:true,
            title:true,
           
            description:true,
            smallDescription:true,
          price:true,

            fileKey:true,
            duration:true,
            level:true,
            category:true,
            chapter:{
                select:{
                    id:true,
                    title:true,
                    lessons:{
                        select:{
                            id:true,
                            title:true,
                            
                        },
                        orderBy:{
                            createdAt:'asc'
                        }
                    }

                },
                orderBy:{
                    createdAt:'asc'
                }
            },
            
        },
        
    })

    if(!course){
        return notFound()
    }

    return course


}