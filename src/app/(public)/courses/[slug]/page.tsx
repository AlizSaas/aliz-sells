import { RenderDescription } from '@/components/rich-text-editor/render-description'
import { Badge } from '@/components/ui/badge'

import { Card, CardContent } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Separator } from '@/components/ui/separator'
import { getIndividualCourse } from '@/data/course/get-course'

import { env } from '@/lib/env'
import { IconBook, IconCategory, IconChartBar, IconChevronDown, IconClock, IconPlayerPlay } from '@tabler/icons-react'
import { CheckIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import { checkIfCourseBought } from '@/data/user/user-is-enrolled'
import Link from 'next/link'
import { EnrollmentButton } from './_components/enrollment-button'
import { buttonVariants } from '@/components/ui/button'
type Params = Promise<{slug:string}>

export default async function Slug({params}: {params:Params}) {
    const {slug} = await params
    
    const course = await getIndividualCourse(slug)
    const isEnrolled = await checkIfCourseBought(course.id)

  return (
    <div className='grid grid-cols-1 gap-8  lg:grid-cols-3 mt-5'>

        <div className='order-1 lg:col-span-2'>
            <div className='relative aspect-video w-ful overflow-hidden rounded-xl shadow-2xl'>
                <Image 
                priority
                src={ `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${course.fileKey}`} alt={course.title} fill className='object-cover'  />

                <div className='absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent' >

                </div>
            </div>

            <div className='mt-6 space-y-4 '>
                <div className='space-y-2'>
                   <h1 className='text-3xl lg:text-4xl font-bold tracking-tight'>
                    {course.title}
                   </h1>
                    {/* <p className='text-muted-foreground text-lg leading-relaxed line-clamp-2'>
                        {course.description}
                    </p> */}
                </div>

                <div className='flex flex-wrap gap-3 line-clamp-2'>
                    <Badge className='flex items-center gap-1 px-3 py-1'>
                        <IconChartBar className='size-4 ' />
                        {course.level}
                    </Badge>
                    <Badge className='flex items-center gap-1 px-3 py-1'>
                        <IconCategory className='size-4 ' />
                        {course.category}
                    </Badge>
                    <Badge className='flex items-center gap-1 px-3 py-1'>
                        <IconClock className='size-4 ' />
                        {course.duration} hours
                    </Badge>

                </div>
                <Separator />
                <div className='space-y-6'>
                    <h2 className='text-3xl font-semibold tracking-tight'>
                        Course Description
                    </h2>
                   
                        <RenderDescription json={JSON.parse(course.description)} />
                        
                    

                </div>

            </div>
            <div className='mt-12 space-y-6 '>
                <div className='flex items-center justify-between'>
                    <h2 className='text-3xl font-semibold tracking-tight'> Course Content</h2>
                    <div>
                        {course.chapter.length} {course.chapter.length === 1 ? 'Chapter' : 'Chapters'} |{" "}
                        {course.chapter.reduce((acc, chapter) => acc + chapter.lessons.length, 0)} {course.chapter.reduce((acc, chapter) => acc + chapter.lessons.length, 0) === 1 ? 'Lesson' : 'Lessons'}
                    </div>

                </div>
                <div className='space-y-4'>
                    {
                        course.chapter.map((chapter,index) => (
                            <Collapsible key={chapter.id} defaultOpen={index === 0} className=''>
                                <Card className='p-0 overflow-hidden border-2 transition-all duration-200 hover:shadow-lg hover:scale-[1.01] gap-0'>
                                    <CollapsibleTrigger>
                                    <div>
                                        <CardContent className='p-6 hover:bg-muted/50 transition-colors'>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-4'>
                                                <p className='flex bg-primary/20 size-10 items-center justify-center rounded-full text-primary font-semibold'>
                                                    {index + 1}
                                                </p>
                                                <div>
                                                    <h3 className='text-xl font-semibold text-left'>
                                                        {chapter.title}
                                                    </h3>
                                                    <p className='text-sm text-muted-foreground mt-1 text-left'>
                                                        {chapter.lessons.length} {chapter.lessons.length === 1 ? 'Lesson' : 'Lessons'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-3'>
                                                <Badge variant={'outline'}>
                                                    {chapter.lessons.length } {chapter.lessons.length === 1 ? 'Lesson' : 'Lessons'}
                                                </Badge>
                                                <IconChevronDown className='size-5 transition-transform duration-200  data-[state=open]:rotate-180' />
                                         
                                                
                                            </div>
                                        </div>


                                        </CardContent>
                                    </div>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                            <div className='border-t bg-muted/20 '>
                            <div className='p-6 pt-4 space-y-3 '>
                                {
                                    chapter.lessons.map((lesson,lessonIndex) => (
                                        <div key={lesson.id} className='flex items-center gap-4 rounded-lg p-3 hover:bg-accent'>
                                           <div className='flex size-8 items-center justify-center rounded-full bg-background border-2 border-primary/20'>
                                            <IconPlayerPlay className='size-5 text-muted-foreground group-hover:text-primary transition-colors' />
                                           </div>
                                           <div className='flex-1'> 
                                            <p>
                                                {lesson.title}
                                            </p>
                                            <p className='text-xs text-muted-foreground mt-1'>
                                                Lesson {lessonIndex + 1}  
                                            </p>

                                           </div>

                                        </div>
                                    ))
                                }

                            </div>
                                </div>
                                </CollapsibleContent>
                        

                                </Card>
                            </Collapsible>
                        ))
                    }

                </div>

            </div>



        </div>

        {/* Right Side - Course Info Card */}
        <div className='order-2 lg:col-span-1 '>
            <div className='sticky top-20'>
                <Card className='py-0'>
                    <CardContent>
                        <div className='flex items-center justify-between mb-6 mt-6'>
                            <span className='text-lg font-medium'>Price:</span>
                            <span className='text-2xl font-bold text-primary '>
                                {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                }).format(course.price)} {/* Assuming price is in USD */}
                            </span>
                        </div>

                        <div className='mb-6 space-y-3 p-4 rounded-lg dark:bg-accent/70 bg-accent/20'>
                            <h4>
                                What you&apos;ll learn
                            </h4>
                            <div className='flex flex-col gap-3'>
                                <div className='flex items-center gap-2 '>
                                    <div className='flex size-8 items-center justify-center rounded-full bg-background border-2 border-primary/10 text-primary'>
                                        <IconClock className='size-4 ' />
                                    </div>
                                    <div>
                                        <p className='text-sm  font-medium'>
                                            Course Duration
                                        </p>
                                        <p className='text-sm text-muted-foreground '>
                                             {course.duration}

                                        </p>

                                    </div>
                                </div>

                            </div>
                             <div className='flex flex-col gap-3'>
                                <div className='flex items-center gap-2 '>
                                    <div className='flex size-8 items-center justify-center rounded-full bg-background border-2 border-primary/10 text-primary'>
                                        <IconChartBar className='size-4 ' />
                                    </div>
                                    <div>
                                        <p className='text-sm  font-medium'>
                                            Skill Level
                                        </p>
                                        <p className='text-sm text-muted-foreground '>
                                             {course.level}

                                        </p>

                                    </div>
                                </div>

                            </div>
                             <div className='flex flex-col gap-3'>
                                <div className='flex items-center gap-2 '>
                                    <div className='flex size-8 items-center justify-center rounded-full bg-background border-2 border-primary/10 text-primary'>
                                        <IconCategory className='size-4 ' />
                                    </div>
                                    <div>
                                        <p className='text-sm  font-medium'>
                                            Course Category
                                        </p>
                                        <p className='text-sm text-muted-foreground '>
                                             {course.category}

                                        </p>

                                    </div>
                                </div>

                            </div>
                             <div className='flex flex-col gap-3'>
                                <div className='flex items-center gap-2 '>
                                    <div className='flex size-8 items-center justify-center rounded-full bg-background border-2 border-primary/10 text-primary'>
                                        <IconBook className='size-4 ' />
                                    </div>
                                    <div>
                                        <p className='text-sm  font-medium'>
                                       Total Lessons
                                        </p>
                                        <p className='text-sm text-muted-foreground '>
                                             {
                                               course.chapter.reduce((total,chapter) => total + chapter.lessons.length, 0)
                                             } {' '} Lessons

                                        </p>

                                    </div>
                                </div>

                            </div>









                        </div>

                        <div className='mb-6 space-3'>
                            <h4>
                                This course includes:
                            </h4>
                            <ul className='space-y-2'>
                                <li className='flex items-center justify-between gap-2'>
                                    <div className='rounded-full'>
                                        <CheckIcon className='size-5 text-primary' />

                                    </div>
                                    <span>
                                        Lifetime access
                                    </span>
                                </li>
                                <li className='flex items-center justify-between gap-2'>
                                    <div className='rounded-full'>
                                        <CheckIcon className='size-5 text-primary' />

                                    </div>
                                    <span>
                                      access on mobile and Desktop
                                    </span>
                                </li>
                                <li className='flex items-center justify-between gap-2'>
                                    <div className='rounded-full'>
                                        <CheckIcon className='size-5 text-primary' />

                                    </div>
                                    <span>
                                        Certificate of completion
                                    </span>
                                </li>

                            </ul>

                        </div>
                        
              {
                isEnrolled ? (
                    <Link href='/dashboard' className={buttonVariants({variant: 'outline', className: 'w-full'})}>
                        Watch Course
                    </Link>
                ) : (
                   <EnrollmentButton courseId={course.id}  />
                )
              }
                        
                        <p className='text-xs text-muted-foreground mt-4 text-center'>
                            30-day money-back guarantee
                        </p>

                    </CardContent>

                </Card>
            </div>
            
        </div>



    </div>
  )
}
 