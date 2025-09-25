import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Shield } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function NotAdmin() {
  return (
    <div className='mx-auto min-h-screen flex  justify-center items-center'>
        <Card className='max-w-md w-full' >
        <CardHeader className='text-center'>
            <div className='bg-destructive/10 rounded-full p-4 w-fit mx-auto'>
               <Shield className='size-16 text-destructive'/> 
            </div>
            <CardTitle className='text-2xl'>Access Denied</CardTitle>
            <CardDescription className='text-muted-foreground text-xs max-w-xs mx-auto'>
                You do not have the necessary permissions to access this page.
            </CardDescription>
        </CardHeader>
        <CardContent className='text-center space-y-4 '>
            <Link href={'/'} className={buttonVariants({variant:'outline',className:'w-full'})}>
            <ArrowLeft className='size-4 mr-2' />
                Go Back Home
            </Link>
        </CardContent>
        </Card >
    </div>
  )
}
