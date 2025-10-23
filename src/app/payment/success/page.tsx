/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useConfetti } from '@/hooks/use-confetti'
import { ArrowLeft, CheckIcon,} from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'

export default function SuccesPage() {
    const { triggerConfetti } = useConfetti()
 useEffect(() => {
    triggerConfetti()



 },[]) // Run confetti effect on component mount
  return (
    <div className='w-full min-h-screen flex flex-col justify-center items-center gap-4'>
        <Card className='w-[350px]'>
          <CardContent>
              <div className='w-full flex justify-center'>
                <CheckIcon className='size-12 text-primary-500 p-2 bg-primary/30 rounded-full' />
            </div>
            <div className='text-center mt-3 sm:mt-5 w-full'>
                <h2 className='text-xl font-bold'>
                 Payment Successful
                </h2>
                <p className='text-sm text-muted-foreground mt-2 text-balance'>
                    Your payment was completed successfully. Thank you for your purchase!
                </p>
                <Link href='/dashboard' className={buttonVariants({variant: 'outline',className: 'w-full mt-4'})}>

                   <ArrowLeft className='mr-2' /> Go to Dashboard
                </Link>
            </div>
          </CardContent>
        </Card>

    </div>
  )
}
