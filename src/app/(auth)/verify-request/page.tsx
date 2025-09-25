'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { authClient } from '@/lib/auth-client'
import React, { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Loader } from 'lucide-react'

export default  function VerifyRequest() {
    const router = useRouter()
    
    const searchParams = useSearchParams()
 
  const email = searchParams.get('email') as string
    const [otp,setOtp] = useState('')
    const [emailPending, startTransition] = useTransition()
    function handleVerify() {
        startTransition( async() => {
            await authClient.signIn.emailOtp({
                email:email,
                otp:otp,
                fetchOptions:{
                    onSuccess:() => {
                        toast.success('Successfully logged in')
                        router.push('/')
                    },
                    onError:(error) => {
                        toast.error(`Error verifying OTP: ${error.error.message}`)
                  
                    }
                }
            })
        })
    }


  return (
  <Card className='w-full mx-auto '>

    <CardHeader className='text-center'>
        <CardTitle className='text-xl'>Check your email</CardTitle>
        <CardDescription>
            We have sent you a sign-in link. Please check your email.
        </CardDescription>
        <CardContent className='space-y-4'>
            <div className=' flex flex-col items-center space-y-2'>
                <InputOTP 
                value={otp}
                onChange={(value) => setOtp(value)}
                maxLength={6} className='gap-2'>
                <InputOTPGroup>
                <InputOTPSlot index={0}/> 
                <InputOTPSlot index={1}/> 
                <InputOTPSlot index={2}/> 
                 
                </InputOTPGroup>
                <InputOTPGroup>
                    <InputOTPSlot index={3}/> 
                    <InputOTPSlot index={4}/> 
                    <InputOTPSlot index={5}/> 
                </InputOTPGroup>
                
                </InputOTP>
                <p className='text-sm text-muted-foreground'>
                    Enter the 6 digit code sent to your email
                </p>
            </div>
            <Button 
            disabled={emailPending || otp.length < 6}
            onClick={handleVerify}
            className='w-full '>
                {
                    emailPending ? <Loader className='animate-spin size-4' /> : 'Verify Account'
                }
            </Button>
       
        </CardContent>
        
    </CardHeader>
  </Card>
  )
}
