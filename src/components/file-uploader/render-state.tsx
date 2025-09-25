import { cn } from '@/lib/utils'
import { CloudUploadIcon, ImageIcon } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'

export function RenderEmptyState({isDragActive}:{isDragActive:boolean}) {
  return (
    <div className='text-center'>

        <div className='flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4'>
            <CloudUploadIcon className={
                cn('size-6 text-muted-foreground', isDragActive && 'text-primary')}/>

        </div>
        <p className='text-base text-foreground '>Drop your files here or <span className='font-bold text-primary cursor-pointer'>Click to upload</span></p>
        <Button type='button' className='mt-4' variant={'outline'} size={'sm'}>
            Browse files
        </Button>
    </div>
  )
}
export function RenderErrorState() {
    return(
        <div className=' text-center '>
             <div className='flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4'>
            <ImageIcon className={
                cn('size-6 text-destructive')}/>

        </div>
        <p className='text-xl  font-semibold text-destructive'>
            Upload Failed
        </p>
        <p className='text-sm mt-1 text-destructive'>
            Something went wrong. Please try again.
        </p>
        </div>
    )

}


