import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, XIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function CancelPage() {
  return (
    <div className='w-full min-h-screen flex flex-col justify-center items-center gap-4'>
        <Card className='w-[350px]'>
          <CardContent>
              <div className='w-full flex justify-center'>
                <XIcon className='size-12 text-red-500 p-2 bg-red-600/30 rounded-full' />
            </div>
            <div className='text-center mt-3 sm:mt-5 w-full'>
                <h2 className='text-xl font-bold'>
                    Payment Cancelled
                </h2>
                <p className='text-sm text-muted-foreground mt-2 text-balance'>
                    Your payment was not completed. You can try again or contact support if you need assistance.
                </p>
                <Link href='/' className={buttonVariants({variant: 'outline',className: 'w-full mt-4'})}>

                   <ArrowLeft className='mr-2' /> Go Back to Home
                </Link>
            </div>
          </CardContent>
        </Card>

    </div>
  )
}
