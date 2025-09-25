import React from 'react'
import {Card,CardContent,CardDescription,CardTitle,CardHeader} from '@/components/ui/card'
import Image from 'next/image'
import { AdminCoursesType } from '@/data/admin/admin-get-courses'
import { useConstructUrl } from '@/hooks/use-construct-url'
import Link from 'next/link'
import { ArrowRight, Eye, MoreVertical, Pencil, School, TimerIcon, Trash, Trash2 } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
interface AdminCourseCardProps {
    data: AdminCoursesType
}
export default function AdminCourseCard({ data }: AdminCourseCardProps) {
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
            <Link href={`/course/${data.slug}`} className={buttonVariants({ className: 'w-full '})}>
      <Eye className='size-4 mr-2'/>Preview Course
            </Link>


        </DropdownMenuItem>
        <DropdownMenuItem>
            <Link href={`/course/${data.id}/delete`} className={buttonVariants({ className: 'w-full '})}>
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
