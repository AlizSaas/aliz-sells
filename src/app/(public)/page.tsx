import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

import React from 'react'
type featuresType = {
    title: string;
    description: string;
    icon: string;
}

const features: featuresType[] = [
    {
        title: 'Comprehensive Course Catalog',
        description: 'Explore a wide range of courses across various categories, designed by industry experts.',
        icon: '📚'
    },

    {
        title:'Interactive Learning Experience',
        description:'Engage with interactive content, quizzes, and assignments to enhance your learning journey.',
        icon:'🎮'

    },
    {
        title:'Progress Tracking',
        description:'Monitor your progress with detailed analytics and personalized feedback.',
        icon:'📈'
    },
    {
        title:'Community Support',
        description:'Join a vibrant community of learners and instructors to share knowledge and collaborate.',
        icon:'🤝'
    }
]


export default function page() {
  return (
  <>
  <section className='relative py-20'>
    <div className='flex flex-col items-center text-center space-y-8'>
        <Badge variant={'outline'}> The Future of Selling Stuff</Badge>
           <h1 className='text-4xl md:text-6xl font-bold tracking-tight'>
        Welcome to AlizSells - Your Ultimate Learning Experience
    </h1>
    <p className='max-w-[700px] text-muted-foreground md:text-xl'>
        Discover a world of knowledge and skills with our comprehensive courses designed to empower you in the art of selling. Whether you&apos;re a beginner or a seasoned professional, AlizSells offers tailored learning paths to help you achieve your goals.
    </p>
    <div className='flex flex-col sm:flex-row gap-4 mt-8'>
        <Link
        className={buttonVariants({size:'lg'})}
        href='/courses'>
        Explore Courses</Link>
        <Link
        className={buttonVariants({variant:'outline',size:'lg'})}
        href='/login'>
        Get Started</Link>

    </div>

    </div>
 

  </section>
  <section className='grid grid-col-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32'>
    {
        features.map((feature,index)=> (
            <Card key={index} className='hover:shadow-lg transition-shadow'>
                <CardHeader>
                    <div className='text-4xl mb-4'>
                        {feature.icon}
                    </div>
                    <CardTitle>
                        {feature.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                   <p className='text-muted-foreground'>
                    {feature.description}
                   </p>
                </CardContent>
            
            </Card>
        ))
    }


  </section>
  
  
  
  </>
  )
}
