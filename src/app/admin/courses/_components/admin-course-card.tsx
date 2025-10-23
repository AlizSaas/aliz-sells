'use client'
import React from 'react'
import {Card,CardContent} from '@/components/ui/card'
import Image from 'next/image'

import { useConstructUrl } from '@/hooks/use-construct-url'
import Link from 'next/link'
import { ArrowRight, Eye, MoreVertical, Pencil, School, TimerIcon, Trash, Trash2 } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { useSuspenseCourses } from '@/data/admin/hooks/use-admin'
import EmptyState from '@/components/general/empty-state'

import { CourseLevel, CourseStatus } from '@/generated/prisma'

export type AdminCourse = {
  id: string
  title: string
  fileKey: string
  price: number
  duration: number
  level: CourseLevel
  smallDescription: string
  slug: string
  status: CourseStatus
}

export type AdminCourses = AdminCourse[]

 export  function RenderCourses() {
  const {data } = useSuspenseCourses();

 return (
  <>
  {
  data.length === 0 ? (
    <EmptyState
    title='No courses found.'
    description='Get started by creating a new course.'
    buttonText='Create Course'
    href='/admin/courses/create'
    
    />
  ): (
      <div className='grid grid-cols-1  md:grid-cols-1 lg:grid-cols-3 gap-7 '>
  {
    data.map((course) => (

      <AdminCourseCard key={course.id} data={course} />
     
    ))
  }
    </div>
  )
}
  </>
 )
}

export default function AdminCourseCard({data}:{data:AdminCourse}) {
  
  
    const thumbnailUrl = useConstructUrl(data.fileKey);

  return (
    <Card className='group relative py-0 gap-0'>
        {/* absolute dropdown menu */}
   <div className='absolute top-2 right-2 z-10'>
    <DropdownMenu >
        <DropdownMenuTrigger asChild>
        <Button>
            <MoreVertical className='size-4'/>

        </Button>

        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-48' align='end'>
        <DropdownMenuItem>
            <Link href={`/admin/courses/${data.id}/edit`} className={buttonVariants({ className: 'w-full '})}>
      <Pencil className='size-4 mr-2'/> Edit Course
            </Link>


        </DropdownMenuItem>
        <DropdownMenuItem>
            <Link href={`/courses/${data.slug}`} className={buttonVariants({ className: 'w-full '})}>
      <Eye className='size-4 mr-2'/>Preview Course
            </Link>


        </DropdownMenuItem>
        <DropdownMenuItem>
            <Link href={`/admin/courses/${data.id}/delete`} className={buttonVariants({ className: 'w-full '})}>
      <Trash2 className='size-4 mr-2 text-destructive'/>Delete Course
            </Link>


        </DropdownMenuItem>

        </DropdownMenuContent>

    </DropdownMenu>

   </div>
        <Image src={thumbnailUrl} alt={data.title || 'thumbnail preview'} width={600} height={400} className='w-full rounded-t-lg aspect-video h-full object-cover'/>

    <CardContent className='p-4'>
      <Link href={`/admin/courses/${data.id}/edit`} className='hover:underline font-medium text-lg line-clamp-2  group-hover:text-primary transition-colors'>
      {
        data.title
      }
      
      </Link>
      <p className='line-clamp-2 text-muted-foreground mt-2 leading-tight text-sm'>
        {data.smallDescription}
      </p>
      <div className='mt-4 flex items-center gap-x-5 '>
        <div className='flex gap-x-2 items-center'>
            <TimerIcon className='size-6 p-1 rounded-md text-primary bg-primary/10'/>
            <p className='text-sm text-muted-foreground mt-1'>
                {data.duration}H
            </p>
        </div>
        <div className='flex gap-x-2 items-center'>
            <School className='size-6 p-1 rounded-md text-primary bg-primary/10'/>
            <p className='text-sm text-muted-foreground mt-1'>
                {data.level}
            </p>
        </div>

      </div>

      <Link href={`/admin/courses/${data.id}/edit`} className={buttonVariants({
        className: 'mt-4 w-full'
      })}>
      Edit Course
      <ArrowRight className='size-4  ml-1'/>
      
      </Link>
    </CardContent>
    </Card>
  )
}


export function AdminCourseCardSkeleton() {
  return (
    <Card className='group relative py-0 gap-0'>
      {/* Thumbnail skeleton */}
      <Skeleton className='w-full aspect-video rounded-t-lg' />

      <CardContent className='p-4'>
        {/* Title skeleton */}
        <Skeleton className='h-6 w-3/4 mb-2' />
        
        {/* Description skeleton */}
        <Skeleton className='h-4 w-full mt-2' />
        <Skeleton className='h-4 w-4/5 mt-1.5' />
        
        {/* Metadata skeleton */}
        <div className='mt-4 flex items-center gap-x-5'>
          <div className='flex gap-x-2 items-center'>
            <TimerIcon className='size-6 p-1 rounded-md text-muted-foreground/30 bg-muted' />
            <Skeleton className='h-4 w-10 mt-1' />
          </div>
          <div className='flex gap-x-2 items-center'>
            <School className='size-6 p-1 rounded-md text-muted-foreground/30 bg-muted' />
            <Skeleton className='h-4 w-16 mt-1' />
          </div>
        </div>

        {/* Button skeleton */}
        <div className={buttonVariants({
          className: 'mt-4 w-full pointer-events-none',
          variant: 'outline'
        })}>
          <Skeleton className='h-4 w-24 mr-1' />
          <ArrowRight className='size-4 ml-1 text-muted-foreground/30' />
        </div>
      </CardContent>
    </Card>
  )
}


 export function AdminCourseCardSkeletonLayout() {
  return (
    <div className='grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-7 '>
      {Array.from({ length: 4 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}

    </div>
  )
}
