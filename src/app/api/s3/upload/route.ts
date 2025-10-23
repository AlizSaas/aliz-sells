
import { env } from "@/lib/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import {z} from "zod";
import {v4 as uuidv4} from 'uuid'
import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import { s3 } from "@/lib/s3Client";
import arcjet from "@/lib/arcjet";
import {  fixedWindow } from "@arcjet/next";

import { requireAdmin } from "@/data/admin/require-admin";


 const fleUploadSchema = z.object({
    fileName:z.string().min(1,{
        message: 'File name is required'
    }),
    contentType: z.string().min(1,{message:'Content type is required'}),
    size:z.number().min(1,{message:'Size is required'}),
    isImage: z.boolean()

})

const aj = arcjet.withRule(
        fixedWindow({
            mode:'LIVE',
            window:'1m', // 1 minute
            max:5 // max 5 requests per minute
        })
)

export async function POST(request: Request) {
    const session = await requireAdmin()
   
    try {
     const decision = await aj.protect(request,{
        fingerprint: session.user.id
     });

     if(decision.isDenied()) {
        return NextResponse.json({error: 'Too many requests'}, {status:429});
     }
     

        const body = await request.json();
        const validation = fleUploadSchema.safeParse(body);
        if(!validation.success) {
            return NextResponse.json({error: 'Invalid Request Body'}, {status:400});
        }
        const {fileName,contentType,size} = validation.data
        const uniqueKey = `${uuidv4()}-${fileName}` // to make sure file name is uniqueKey

        const command = new PutObjectCommand({
            Bucket:env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            ContentType:contentType,
            ContentLength:size,
            Key:uniqueKey,
        })

        const presignedUrl = await getSignedUrl(s3, command, {expiresIn: 360}) // link valid for 6 minutes

        const response = {
            presignedUrl,
            key: uniqueKey,
        }

        return NextResponse.json(response)

        
    } catch (error) {
        console.log('Error in /api/s3/upload', error);
        return NextResponse.json({error: 'Internal Server Error'}, {status:500});
    }

    
}