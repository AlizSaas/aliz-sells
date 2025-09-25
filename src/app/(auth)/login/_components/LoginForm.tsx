'use client'

import { GoogleIcon } from '@/components/icons/google'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loader } from 'lucide-react'
import React, { useState, useTransition } from 'react'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
    const router = useRouter()
      const [isPending, startTransition] = useTransition()
      const [emailTransition, startEmailTransition] = useTransition()
      const [email, setEmail] = useState('')

  async function handleGoogleLogin() {
    startTransition(async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/',
      fetchOptions:{
        onSuccess:() =>{
          toast.success('Successfully logged in with Google')
        },
        onError: (error) =>{
          toast.error(`Error logging in with Google: ${error.error.message}`)
        }

      }

    })
  })
  }
  function signInWithEmail() {
    startEmailTransition(async () => {
        await authClient.emailOtp.sendVerificationOtp({
            email:email,
            type:'sign-in',
            fetchOptions:{
                onSuccess:() => {
                    toast.success('Email sent')
                    router.push(`/verify-request?email=${email}`)
                },
                onError:(error) => {
                    toast.error(`Error sending email: ${error.error.message}`)
                }
            }
        })

    })
    

  }
  return (
    <Card>
        <CardHeader>
            <CardTitle className='text-2xl'>Welcome back!</CardTitle>
            <CardDescription>
                Login with google account
            </CardDescription>
            
        </CardHeader>
        <CardContent className='space-y-4'>
          <Button
            disabled={isPending}
          onClick={handleGoogleLogin}
            variant={'outline'}
             className='w-full '>
            {isPending ?
            <>   <Loader className='size-4 animate-spin' />
            <span>Loading...</span> </>
           : <><GoogleIcon className='mr-2 h-4 w-4'/> Continue with Google</>}
            </Button>

            <div className=' relative text-center text-sm after:absolute after:inset-0  after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
              <span className='relative z-10 bg-card px-2 text-muted-foreground'>Or continue with</span>
            </div>

            <div className=' grid gap-3'>
              <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                
                type='email' placeholder='you@example.com' />
                
              </div>
              <Button onClick={signInWithEmail}
              disabled={emailTransition}
              >
                {
                    emailTransition ?
                    <>   <Loader className='size-4 animate-spin' />
            <span>Loading...</span> </>
                    : 'Continue with Email'
                }
              </Button>

            </div>
        </CardContent>
    </Card>
  )
}
