'use server'

import { requireUser } from "@/data/user/require-user";
import arcjet from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { apiResponse } from "@/lib/types";
import { fixedWindow, request } from "@arcjet/next";
import { error } from "console";
import { redirect } from "next/navigation";
import Stripe from "stripe";


const aj = arcjet.withRule(
    fixedWindow({
        mode: 'LIVE',
        window: '1m',
        max:5,
    })
)







export async function enrollInCourseAction(courseId:string):Promise<apiResponse | never> {
   const user =  await requireUser()
   let checkoutUrl:string


    try {
        const req = await request()

        const decision = await aj.protect(req,{
            fingerprint: user.id
        })

        if(decision.isDenied()) {
            return {
                message: 'Too many requests, please try again later',
                status: 'error'
            }
        }











        const couser = await  prisma.course.findUnique({
            where:{
                id: courseId

            },
            select:{
                id:true,
                price:true,
                slug:true,
                title:true
            }
        })
        if(!couser) {
            return {
                status:'error',
                message:'an error accord'
            }
        }
        let stripeCustomerId:string

        const userWithStripeCustomerId = await prisma.user.findUnique({
            where:{
                id: user.id
            },
            select:{
                stripeCustomerId:true
            }
        })

        if(userWithStripeCustomerId?.stripeCustomerId) {
            stripeCustomerId = userWithStripeCustomerId.stripeCustomerId
        } else {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata:{
                  userId: user.id
                }
            })
            stripeCustomerId  = customer.id
            await prisma.user.update({
                where:{
                    id: user.id
                },
                data:{
                    stripeCustomerId: stripeCustomerId
                }
            })
        }
 const result = await prisma.$transaction(async (tx) => {

    const existingEnrollment = await tx.enrollment.findUnique({
        where:{
            courseId_userId:{
                userId: user.id,
                courseId: couser.id
            }

        },
        select:{
            status:true,
            id:true
        }
    })

    if(existingEnrollment?.status === 'Active') {
        return {
            status: 'success',
            message: 'You are already enrolled in this course'
        }
    
    }

    let enrollment //= existingEnrollment

    if(existingEnrollment) {
        enrollment = await tx.enrollment.update({
            where:{
                id: existingEnrollment.id
            },
            data:{
                amount: couser.price,
                status: 'Pending',
                updatedAt: new Date()
            }
        })
    }
    else {
        enrollment = await tx.enrollment.create({
            data:{
                amount: couser.price, //
                courseId: couser.id, // The ID of the course being enrolled in
                userId: user.id, // The ID of the user enrolling in the course
                status: 'Pending'
            }
        })

    }

    const checkoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items:[
           {
            price: 'price_1SDCr3Gh9pGu5TJN3rhq6uQU',
            quantity: 1
           }
        ],
        mode: 'payment', //,
        success_url: `${env.BETTER_AUTH_URL}/payment/success`,
        cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
        metadata:{
            userId: user.id,
            courseId: couser.id,
            enrollmentId: enrollment.id
        }
    })

    return {
        enrollment: enrollment,
      checkoutUrl: checkoutSession.url

    }




})


checkoutUrl = result.checkoutUrl!








     

        
    }catch (error) { {
        if(error instanceof Stripe.errors.StripeError) {
            return {
                status: 'error',
                message: 'Payment system error, please try again later'
            }
        }


        return {
            message: 'Failed to enroll in course',
            status: 'error'
        }
        
    }


    
}

redirect(checkoutUrl)
}