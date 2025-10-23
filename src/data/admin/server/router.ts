
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { chapterSchema, courseCategories, courseLevels, courseSchema, courseStatuses, lessonSchema, } from "@/lib/zodSchema";
import { createTRPCRouter, adminProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

import z from "zod";


export const adminRouter = createTRPCRouter({
    createNewChapter: adminProcedure.input(chapterSchema).mutation(async ({input}) => {
        const {courseId, name} = input
 const newChapter = await prisma.$transaction(async (tx) => {
                const maxPosition = await tx.chapter.findFirstOrThrow({
                    where:{
                        courseId:courseId,
        
                    },
                    select:{
                        position:true
                    },
                    orderBy:{
                        position:'desc'
                    }
                })
        
              const chapter =   await tx.chapter.create({
                    data:{
                      title: name,
                        courseId: courseId,
                        position:  (maxPosition?.position ?? 0) + 1 // if no chapters, position is 1
                    }
                })
                return chapter

                
               })

                return newChapter

           

        


    }),
  createNewLesson: adminProcedure.input(lessonSchema).mutation(async ({input}) => {{
    const {chapterId, name, description, videoKey, thumbnailKey,courseId} = input
    const newLesson =     await prisma.$transaction(async (tx) => {
            const maxPosition = await tx.lesson.findFirst({
                where:{
              chapterId:chapterId,
    
                },
                select:{
                    position:true
                },
                orderBy:{
                    position:'desc' // get the lesson with the highest position
                }
            })
    
       const lesson =      await tx.lesson.create({
                data:{
                  title: name,
                  description: description,
                  thumbnailKey: thumbnailKey,
                  videoKey: videoKey,
                    chapterId: chapterId,
                    position:  (maxPosition?.position ?? 0) + 1 // if no chapters, position is 1
                }
            })

            return lesson
           })
            return {...newLesson, courseId}
  }}),


     createCourse: adminProcedure.input(z.object({
     title: z.string().min(3, "Title should be at least 3 characters long").max(100, "Title should be at most 100 characters long"),
       description: z.string().min(3, {
         message: "Description should be at least 3 characters long",
       }),
       fileKey: z.string().min(1, { message: "File key is required" }),
     
     
       price: z.coerce.number().min(1), // price must be a number and at least 1
       duration: z.coerce.number().min(1),
     
     
     
       level: z.enum(courseLevels),
       category: z.enum(courseCategories,{
         message: 'category is required'
       }),
       smallDescription: z.string().min(3, {
         message: "Small description should be at least 3 characters long",
       }).max(200, {
         message: "Small description should be at most 200 characters long",
       }),
       slug: z.string().min(3, {
         message: "Slug should be at least 3 characters long",
       }),
       status: z.enum(courseStatuses),

    })).mutation(async ({ input, ctx }) => {
 


  const stripeProduct = await stripe.products.create({
    name: input.title,
    description: input.description,
    default_price_data: {
      currency: 'usd',
      unit_amount: input.price * 100,
    }
  });

  // Create course in database
  return await prisma.course.create({
    data: {
      title: input.title,
      description: input.description,
      fileKey: input.fileKey,
      price: input.price,
      duration: input.duration,
      level: input.level,
      category: input.category,
      smallDescription: input.smallDescription,
      slug: input.slug,
      status: input.status,
      userId: ctx.auth.user.id,
      stripePriceId: stripeProduct.default_price as string,
    }
  });
  

}),



      updateCourseLesson: adminProcedure.input(lessonSchema.extend({
        lessonId: z.string()
    })).mutation(async ({input}) => {
      const {lessonId,name,description,thumbnailKey,videoKey} = input

      const result = await prisma.lesson.update({
        where:{
          id: lessonId,
          
        },
        data:{
          title:name,
          description:description,
          thumbnailKey:thumbnailKey,
          videoKey:videoKey
        }
      })

      return result

    

    }),
    updateCourse:adminProcedure.input(courseSchema.extend({
        courseId: z.string()
    })).mutation(async ({input,ctx}) => {
      const {courseId,...rest} = input
  const updated =       await prisma.course.update({
              where:{
                  id:courseId,
                  userId:ctx.auth.user.id
              },
              data:{
                  ...rest
              }
          })
          return updated
    }),



    getAdminCourse:adminProcedure.input(z.object({
        id: z.string()  
    })).query(async ({input,ctx}) => {


        const {id} = input
        const data = await prisma.course.findUniqueOrThrow({
          where: { id,
            userId: ctx.auth.user.id
           },
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
            description: true,
            category: true,
            chapter: {
              select: {
                id: true,
                title: true,
                position: true,
                lessons: {
                  select: {
                    id: true,
                    title: true,
                    description: true,
                    position: true,
                    videoKey: true,
                    thumbnailKey: true,
                  },
                },
              },
            },
          },
        });
        return data

    }),
    getAdminLesson:adminProcedure.input(z.object({
        id: z.string()  
    })).query(async ({input}) => {
        const {id} = input
        const data = await prisma.lesson.findUniqueOrThrow({
          where: { id, },
           select: {
            id: true,
            title: true,
            videoKey: true,
            thumbnailKey: true,
            description: true,
            position: true,
          },
        });
        return data 

    }),
    
    getAdminCourses:adminProcedure.query(async ({ctx}) => {
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
    }),
    getAdminDashboardData: adminProcedure.query(async () => {

        const [ totalSignUps,totalCustomers,totalCourses,totalLessons] = await Promise.all([
    // total users

    prisma.user.count(),

    // total customers

    prisma.user.count({
        where:{
            enrollments: {
                some: {}
            }
        }
    }),
    // total couses

    prisma.course.count(),
    // total lessons
    prisma.lesson.count(),








])
return {
    totalSignUps,
    totalCustomers,
    totalCourses,
    totalLessons
}


   
    




    }),

    getEnrollmentStats: adminProcedure.query(async () => {
        const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30); // 30 days ago
      
            const enrollment = await prisma.enrollment.findMany({
                  where:{
                      createdAt:{
                          gte:thirtyDaysAgo
                      }
                  },
                  select:{
                      createdAt:true
      
                  },
                  orderBy:{
                      createdAt:'asc' // Order by creation date ascending
                  }
              }) // Fetch enrollments from the last 30 days
      
              const last30Days: {date:string,enrollments:number}[] = []
             for (let i = 29; i >= 0; i--){
              const date = new Date();
              date.setDate(date.getDate() - i); // i days ago
              last30Days.push({
                  date:date.toISOString().split('T')[0], // Format as YYYY-MM-DD
                  enrollments:0
              })
      
             } // Initialize last30Days with 0 enrollments
      
             enrollment.forEach((enrollment) => {
      
              const enrollmentDate = enrollment.createdAt.toISOString().split('T')[0]; // Format as YYYY-MM-DD
              const dayIndex = last30Days.findIndex(day => day.date === enrollmentDate); // Find the index of the day in last30Days
      
              if (dayIndex !== -1) {
                  last30Days[dayIndex].enrollments ++; // Increment the enrollment count for that day
              }
      
             }) // Count enrollments per day 
             
               return last30Days
    }),
    getRecentCourses: adminProcedure.query(async () => {
         const data = prisma.course.findMany({
              orderBy:{
                  createdAt:'desc'
              },
              take:2,
              select:{
                  id:true,
                  title:true,
                  smallDescription:true,
                  duration:true,
                  price:true,
                  level:true,
                  status:true,
                  fileKey:true,
                  slug:true,
              }
          })
      
          return data
    }),

    deleteCourse: adminProcedure.input(z.object({
        courseId: z.string()
    })).mutation(async ({input, ctx}) => {
        const {courseId} = input
      await prisma.course.delete({
        where:{ id: courseId,userId:ctx.auth.user.id}
      })
    }),

    deleteLesson: adminProcedure.input(z.object({
        lessonId: z.string(),
        chapterId: z.string(),
        courseId: z.string()
    })).mutation(async ({input}) => {
        const {lessonId,chapterId,courseId} = input

try {
        const chapterWithLesson = await prisma.chapter.findUniqueOrThrow({
            where:{
                id:chapterId // chapter id
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
            throw new TRPCError({
                code:'NOT_FOUND',
                message:'Chapter not found',
            })

        }


        const lesson = chapterWithLesson.lessons

        const lessonToDelete = lesson.find(l => l.id === lessonId)

        if(!lessonToDelete) {
            throw new TRPCError({
                code:'NOT_FOUND',
                message:'Lesson not found in the specified chapter',
            })
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

        return {
          courseId: courseId
        }

    // i wanna return the courseId so i can revalidate the query in the frontend 
     // i dont wanna use revalidatePath here because this is server side only


       

       
            











    } catch  {
    
   throw new  TRPCError({
        code:'INTERNAL_SERVER_ERROR',
        message:'Failed to delete lesson'
      })

        
        
    }

    }),
    deleteChapter: adminProcedure.input(z.object({
        chapterId: z.string(),
        courseId: z.string()
    })).mutation(async ({input}) => {
        const {chapterId,courseId} = input

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
                  throw new TRPCError({
                        code:'NOT_FOUND',
                        message:'Course not found',
                    })
                }
        const chaprterToDelete = courseWithChapters.chapter.find(c => c.id === chapterId) // find the chapter to delete
        
                if(!chaprterToDelete) {
                  throw new TRPCError({
                        code:'NOT_FOUND',
                        message:'Chapter not found in course',
                    })
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
        
        
        
        
        
                    return {courseId: courseId,}
                    
        
        
        
        
        
        
        
        
        
        
        
            } catch  {
            throw new  TRPCError({
                code:'INTERNAL_SERVER_ERROR',
                message:'Failed to delete chapter'
              })

                
            }
    }),

    reOrderLessons:adminProcedure.input(z.object({
        lessons: z.array(z.object({
            id: z.string(),
            position: z.number()
        })),
        chapterId: z.string(),
        courseId: z.string()
    })).mutation(async ({input}) => {
        const {lessons,chapterId,courseId} = input
        


try {
  
    if(!lessons || lessons.length === 0) {
        throw new  TRPCError({
            code:'BAD_REQUEST',
            message:'No lessons to reorder'
          })
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
   

    return {
      courseId: courseId,
    }

    
} catch (error) { {
   console.error('Failed to reorder lessons:', error);
      
      if (error instanceof TRPCError) {
        throw error; // Re-throw if it's already a TRPCError
      }

    throw new  TRPCError({
        code:'INTERNAL_SERVER_ERROR',
        message:'Failed to reorder lessons'
      })

    
}
}

    }),

    reOrderChapters:adminProcedure.input(z.object({
        chapters: z.array(z.object({
            id: z.string(),
            position: z.number()
        })),
        courseId: z.string()
    })).mutation(async ({input}) => {
        const {chapters,courseId} = input
        try {
        
            if(!chapters || chapters.length === 0) {
                throw new  TRPCError({
                    code:'BAD_REQUEST',
                    message:'No chapters to reorder'
                  })
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
         
            return {courseId: courseId,}
        
        } catch (error) {
            console.error('Failed to reorder chapters:', error);
            
            if (error instanceof TRPCError) {
              throw error; // Re-throw if it's already a TRPCError
            }
          throw new  TRPCError({
            code:'INTERNAL_SERVER_ERROR',
            message:'Failed to reorder chapters'
          })
        }
    })



  


  })
