'use client'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import logo from '../../../../public/mainpfp.png'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { authClient } from '@/lib/auth-client'
import { UserDropdown } from './user-dropdown'
import { buttonVariants } from '@/components/ui/button'

const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Courses', href: '/courses' },
    {name: 'Dashboard', href:'/admin'},

]
export default function Navbar() {
    const {data:session,isPending} = authClient.useSession()
  return (
    <header  className='sticky top-0 z-50  border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60  '>
<div className='container flex min-h-16 items-center mx-auto px-4 md:px-6 lg:px-8'>
    <Link href='/' 
    
    className='flex items-center space-x-2 mr-2'>
    <Image
    className='size-9 rounded-full'
    src={logo} alt='Logo'/>
    <span className='font-bold'>AlizSells</span>

    
    
    </Link>
    {/* desktop nav */}
    <nav className=' hidden md:flex md:justify-between md:items-center   md:flex-1'>
        <div className='flex items-center space-x-2'>
            {
                navigationItems.map((item,index)=>(
                    <Link 
                    key={index}
                    href={item.href}
                    className='px-3 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors'
                    >
                        {item.name}
                    </Link>
                ))

            }

        </div>
        <div className='flex items-center space-x-2'>
            <ThemeToggle />
            {
                isPending ? null : session ? (
                    <UserDropdown user={session.user} />
                ) : (
                   <>
                   <Link
                   href='/login'
                   className={buttonVariants({
                    variant:'outline'
                   })}
                   >
                       Get Started
                   </Link>
                           </>
                )
            }

        </div>
    </nav>

</div>
    </header>
  )
}
