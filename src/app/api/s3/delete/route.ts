import { requireAdmin } from "@/data/admin/require-admin";
import arcjet from "@/lib/arcjet";
import { env } from "@/lib/env";

import { s3 } from "@/lib/s3Client";
import {  fixedWindow } from "@arcjet/next";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
 const aj = arcjet.withRule(
         fixedWindow({
             mode:'LIVE',
             window:'1m', // 1 minute
             max:5 // max 5 requests per minute
         })
 )  
export async function DELETE(req: Request) {

  

      const session = await requireAdmin()
      
    try {

         const decision = await aj.protect(req,{
                fingerprint: session.user.id
             });
        
             if(decision.isDenied()) {
                return NextResponse.json({error: 'Too many requests'}, {status:429});
             }
             
        const body = await req.json();
        const key = body.key;

        if(!key) {
            return NextResponse.json({ message: "Key is required" }, { status: 400 });
        }

        const command = new DeleteObjectCommand({
            Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
            Key: key,
        })
        await s3.send(command);

        return NextResponse.json({ message: "File deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting file", error }, { status: 500 });
        
    }
}