'use server'

import { requireAdmin } from "@/data/admin/require-admin"
import arcjet from "@/lib/arcjet"
import { prisma } from "@/lib/db"

import { apiResponse } from "@/lib/types"
import { courseSchema, CourseSchemaType } from "@/lib/zodSchema"
import { detectBot,fixedWindow, request } from "@arcjet/next"

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