import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PublicCourseType } from '@/data/course/get-all-courses'
import { useConstructUrl } from '@/hooks/use-construct-url'
import { School, TimerIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
type Props = {
    data: PublicCourseType
}

export default function PublicCourseCard({data}: Props) {
 const thumbnail =   useConstructUrl(data.fileKey)
  return (
    <Card className='relative group py-0 gap-0'>
        <Badge className='absolute top-2 right-2 z-10'>
            {data.level}
        </Badge>
        <Image src={thumbnail} alt={data.title} width={600} height={300} className='w-full h-full object-cover aspect-video rounded-xl' />
        <CardContent className='space-y-3 mb-4' >
            <Link 
            className='font-medium text-lg lg:text-2xl line-clamp-2 hover:underline mt-3 group-hover:text-primary'
            href={`/courses/${data.slug}`}>
            {
                data.title
            }
            </Link>
            <p className='line-clamp-2 text-sm text-muted-foreground  leading-tight'>
                {data.smallDescription}
            </p>

            <div className='flex items-center gap-x-5'>
                <div className='flex items-center gap-x-2 '>
                    <TimerIcon  className='size-6 p-1 text-primary rounded-md'/> 
                    <span className=' text-sm text-muted-foreground'>
                        {data.duration} hours
                    </span>
                </div>
                <div className='flex items-center gap-x-2 '>
                    <School  className='size-6 p-1 text-primary rounded-md'/> 
                    <span className=' text-sm text-muted-foreground'>
                        {data.category} 
                    </span>
                </div>

            </div>

            <Link href={`/courses/${data.slug}`} className={buttonVariants({
                variant: 'outline',
                className: 'w-full mt-2'
            })}   >
            Learn More</Link>
        </CardContent>
    </Card>
  )
}

export function LoadingCourses() {
    return (
        <Card className='relative group py-0 gap-0'>
            <div className='absolute top-2 right-2 z-10'>
                 <Skeleton className='w-20 h-6 rounded-full' />
            </div>
            <div className='w-full rounded-t-xl aspect-video'>
                <Skeleton className='w-full h-full rounded-t-xl' />

            </div>
            <CardContent className='p-4'>
                <div>
                           <Skeleton className='h-4 w-3/4 rounded-md' />
                <Skeleton className='h-4 w-1/2 rounded-md' />

                </div>
                <div>
                <Skeleton className='h-4 w-1/4 rounded-md mt-2' />
                <Skeleton className='h-4 w-1/3 rounded-md mt-2' />
                </div>
                <div className='mt-4 flex items-center gap-x-5'>
                <Skeleton className='h-6 w-20 rounded-full' />

                </div>
                <div>
                <Skeleton className='h-10 w-full rounded-md mt-4' />
                </div>

         
            </CardContent>

        </Card>
    )
}