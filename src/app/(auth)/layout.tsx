import { buttonVariants } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import logo from '../../../public/mainpfp.png'


export default async function AuthLayout({ children }: { children: React.ReactNode }) {
 
  return (
   <div className='relative  flex flex-col min-h-svh items-center justify-center'>
        <Link href={'/'}
    className={buttonVariants({
      variant:'outline',
      className:'absolute left-4 top-4'
    })}
    
    >
    <ArrowLeft className='' />
    Back

    </Link>

     <div className='flex w-full max-w-sm flex-col gap-6'>
      <Link href={'/'} className='flex items-center self-center font-medium gap-2'>
      <Image 
      className='rounded-full'
      src={logo} alt='logo' width={32} height={32} />
     <span className='font-bold'> Alizsells</span>

      
      </Link>
      {children}

      <div className='text-balance text-center text-xs text-muted-foreground'>
        By clicking continue, you agree to our <span className='hover:text-primary hover:underline'>Terms of Service</span> {" "}  and  <span className='hover:text-primary hover:underline'>Privacy Policy</span>.

      </div>
    </div>
   </div>
  )
}

