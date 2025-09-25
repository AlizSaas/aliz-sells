'use server'

import { requireAdmin } from "@/data/admin/require-admin";
import { prisma } from "@/lib/db";

import { apiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchema";
import arcjet from '@/lib/arcjet';
import { detectBot, fixedWindow, request } from '@arcjet/next';

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
export async function createCourse(datas: CourseSchemaType):Promise<apiResponse> {

    const session = await requireAdmin()
    try {

        const req = await request()
        const decision = await aj.protect(req,{
            fingerprint: session.user.id
        })

        if(decision.isDenied()) {
         if(decision.reason.isRateLimit()) {
            return {
                status: 'error',
                message: 'Too many requests, please try again later',
            }   
        }}
      

        const validation = courseSchema.safeParse(datas)

        if(!validation.success) {
          return {
            status: 'error',
            message: 'Invalid data',
          }
        }

        const course = await prisma.course.create({
            data:{
                ...validation.data,
                userId: session.user.id,
            }
        })

        return {
            status: 'success',
            message: 'Course created successfully',
        }
        
    } catch (error) {
        console.log(error);
        return {
            status: 'error',
            message: 'Something went wrong',
        }

        
    }

}
