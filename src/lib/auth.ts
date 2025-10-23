
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./db";
import { env } from "./env";
import { emailOTP,admin } from "better-auth/plugins"
import { sendEmail } from "./resend";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders:{
        google: {
            clientId:env.GOOGLE_CLIENT_ID,
            clientSecret:env.GOOGLE_CLIENT_SECRET,
        }
    },
    plugins:[
        emailOTP({
            async sendVerificationOTP({email,otp}){
                await sendEmail({
                    to: email,
                    subject: 'AlizSells Verify your email',
                    text: `Your verification code is ${otp}.`
                })
              


            }
        }),
        admin()
        
    ],

  
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;