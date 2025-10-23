import { Ban, PlusCircle } from 'lucide-react'
import React from 'react'
import {  buttonVariants } from '../ui/button'
import Link from 'next/link'
interface EmptyStateProps {
    title: string
    description: string
    buttonText: string,
    href: string
}

export default function EmptyState({ title, href, description, buttonText }: EmptyStateProps) {
  return (
    <div className='flex flex-col flex-1 h-full items-center justify-between rounded-md border-dashed p-8 border text-center animate-in fade-in-50 '>
       <div className='flex size-20 items-center  justify-center rounded-full bg-primary/10'>
        <Ban className='size-10 text-primary' />
       </div>
       <h2 className='mt-4 text-4xl font-semibold'>
        {title}
       </h2>
       <p className='text-sm text-muted-foreground mb-4 mt-2 text-center leading-tight' >
        {description}
       </p>
       <Link href={href} className={buttonVariants()}>
       <PlusCircle className='size-4 mr-2 ' />
        {buttonText}
       </Link>

    </div>
  )
}
