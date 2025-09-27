'use server'

import { requireAdmin } from "@/data/admin/require-admin"
import arcjet from "@/lib/arcjet"
import { prisma } from "@/lib/db"

import { apiResponse } from "@/lib/types"
import { chapterSchema, ChapterSchemaType, courseSchema, CourseSchemaType, lessonSchema, LessonSchemaType } from "@/lib/zodSchema"
import { detectBot,fixedWindow, request } from "@arcjet/next"
import { revalidatePath } from "next/cache"

const aj = arcjet.withRule(
        detectBot({
            mode:'LIVE',
            allow:[],
    
        })
    ).withRule(
        fixedWindow({
            mode:'LIVE',
            window:'1m', // 1 minute
            max:5 // max 5 requests per minute
        })
    )

export async function  editCourse(data:CourseSchemaType,courseId:string):Promise<apiResponse> {
    const user = await requireAdmin()

try {
        const req = await request()
        const decision = await aj.protect(req,{
            fingerprint: user.user.id
        })

        if(decision.isDenied()) {
         if(decision.reason.isRateLimit()) {
            return {
                status: 'error',
                message: 'Too many requests, please try again later',
            }   
        }}
      

    const result = courseSchema.safeParse(data)
    if (!result.success) {
        return {
            status:'error',
            message:'Invalid data',
        }
    }

    await prisma.course.update({
        where:{
            id:courseId,
            userId:user.user.id
        },
        data:{
            ...result.data
        }
    })

    return {
        status:'success',
        message:'Course updated successfully',
    }
    
} catch (error) {
    console.log(error)
    return {
        status:'error',
        message:'Something went wrong',
    }
    
}

    
    
}

export async function reOrderLessons(chapterId:string,lessons:{
    id:string,
    position:number
}[],
courseId:string

):Promise<apiResponse>{


     await requireAdmin()

try {
  
    if(!lessons || lessons.length === 0) {
        return {
            status:'error',
            message:'No lessons to reorder',
        }
    }
    
    const updates = lessons.map((lesson) => prisma.lesson.update({
        where:{
            id:lesson.id,
            chapterId:chapterId
        },
        data:{
            position:lesson.position
        }
    }))

    await prisma.$transaction(updates)
    revalidatePath(`/admin/courses/${courseId}/edit`)

    return {
        status:'success',
        message:'Lessons reordered successfully',
    }

    
} catch (error) {

    return {
        status:'error',
        message:'Something went wrong',
    }
    
}



}

export async function reOrderChapters(chapters:{
    id:string,
    position:number
}[],
courseId:string ):Promise<apiResponse>{

  await requireAdmin()

try {

    if(!chapters || chapters.length === 0) {
        return {
            status:'error',
            message:'No chapters to reorder',
        }
    }

    const updates = chapters.map((chapter) => prisma.chapter.update({
        where:{ 
            id:chapter.id,
            courseId:courseId
        },
        data:{
            position:chapter.position
        }
    }))
    await prisma.$transaction(updates)
    revalidatePath(`/admin/courses/${courseId}/edit`)
    return {
        status:'success',
        message:'Chapters reordered successfully',
    }

} catch (error) {
    return {
        status:'error',
        message:'Something went wrong',
    }
}}



export async function createChapter(values:ChapterSchemaType):Promise<apiResponse>{

    await requireAdmin()

    try {
       const result = chapterSchema.safeParse(values)

       if(!result.success) {
        return {
            status:'error',
            message:'Invalid data',
        }
       }
       await prisma.$transaction(async (tx) => {
        const maxPosition = await tx.chapter.findFirst({
            where:{
                courseId:result.data.courseId,

            },
            select:{
                position:true
            },
            orderBy:{
                position:'desc'
            }
        })

        await tx.chapter.create({
            data:{
              title: result.data.name,
                courseId: result.data.courseId,
                position:  (maxPosition?.position ?? 0) + 1 // if no chapters, position is 1
            }
        })
       })

         revalidatePath(`/admin/courses/${result.data.courseId}/edit`)


         return {
            status:'success',
            message:'Chapter created successfully',
         }
       



    } catch  {
        return {
            status: 'error',
            message: 'Something went wrong',
        }
        
    }
}
export async function createLesson(values:LessonSchemaType):Promise<apiResponse>{

    await requireAdmin()

    try {
       const result = lessonSchema.safeParse(values)

       if(!result.success) {
        return {
            status:'error',
            message:'Invalid data',
        }
       }
       await prisma.$transaction(async (tx) => {
        const maxPosition = await tx.lesson.findFirst({
            where:{
          chapterId:result.data.chapterId,

            },
            select:{
                position:true
            },
            orderBy:{
                position:'desc' // get the lesson with the highest position
            }
        })

        await tx.lesson.create({
            data:{
              title: result.data.name,
              description: result.data.description,
              thumbnailKey: result.data.thumbnailKey,
              videoKey: result.data.videoKey,
            
                chapterId: result.data.chapterId,
                position:  (maxPosition?.position ?? 0) + 1 // if no chapters, position is 1
            }
        })
       })

         revalidatePath(`/admin/courses/${result.data.courseId}/edit`)


         return {
            status:'success',
            message:'Lesson created successfully',
         }
       



    } catch  {
        return {
            status: 'error',
            message: 'Failed to create lesson',
        }
        
    }
}

 export async function deleteLesson(lessonId:string,chapterId:string,courseId:string):Promise<apiResponse>{

    await requireAdmin()
    try {
        const chapterWithLesson = await prisma.chapter.findUnique({
            where:{
                id:chapterId
            },
            select:{
                lessons:{
                    orderBy:{
                        position:'asc' // order by position to maintain order
                    },
                    select:{
                        id:true,
                        position:true
                    }
                }
            }
        })
        if(!chapterWithLesson) {
            return {
                status:'error',
                message:'Chapter not found',
            }
        }


        const lesson = chapterWithLesson.lessons

        const lessonToDelete = lesson.find(l => l.id === lessonId)

        if(!lessonToDelete) {
            return {
                status:'error',
                message:'Lesson not found in chapter',
            }
        }

        const remainingLessons = lesson.filter(l => l.id !== lessonId)

        const updates = remainingLessons.map((l,i) => prisma.lesson.update({
            where:{
                id:l.id, // lesson id
                chapterId:chapterId // ensure lesson belongs to the chapter
            },
            data:{
                position:i + 1 // reassign positions starting from 1
            }
        }))

       await prisma.$transaction([
        ...updates,
        prisma.lesson.delete({
            where:{ id:lessonId,chapterId:chapterId }
        })


       ])

         revalidatePath(`/admin/courses/${courseId}/edit`)
            return {
            status:'success',
            message:'Lesson deleted successfully',
            }
            











    } catch  {
        return {
            status: 'error',
            message: 'Failed to delete lesson',
        }
        
    }
}
 export async function deleteChapter(chapterId:string,courseId:string):Promise<apiResponse>{

    await requireAdmin()
    try {
       const courseWithChapters = await prisma.course.findUnique({
        where:{
            id:courseId
        },
        select:{
            chapter:{
                orderBy:{
                    position:'asc'
                },
                select:{
                    id:true,
                    position:true
                }
            }
        }
         })
        if(!courseWithChapters) {
            return {
                status:'error',
                message:'Course not found',
            }
        }
const chaprterToDelete = courseWithChapters.chapter.find(c => c.id === chapterId) // find the chapter to delete

        if(!chaprterToDelete) {
            return {
                status:'error',
                message:'Chapter not found in course',
            }
        }

        const remainingChapters = courseWithChapters.chapter.filter(c => c.id !== chapterId) // filter out the chapter to delete

        const updates = remainingChapters.map((c,i) => prisma.chapter.update({
            where:{
                id:c.id,
                courseId:courseId
            },
            data:{
                position:i + 1 // reassign positions starting from 1
            }
        }))
         await prisma.$transaction([    
        ...updates, // update remaining chapters
        prisma.chapter.delete({
            where:{ id:chapterId,courseId:courseId }
        })// delete the chapter
         ])





         revalidatePath(`/admin/courses/${courseId}/edit`)
            return {
            status:'success',
            message:'Lesson deleted successfully',
            }
            











    } catch  {
        return {
            status: 'error',
            message: 'Failed to delete lesson',
        }
        
    }
}