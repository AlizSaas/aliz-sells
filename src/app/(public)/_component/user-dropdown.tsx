"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useSignOut } from "@/hooks/use-signout";
import { User } from "@/lib/auth";

import { IconLogout } from "@tabler/icons-react";
import {  UserIcon,HomeIcon, LayoutDashboard,BookOpenText} from "lucide-react";
import Image from "next/image";
import Link from "next/link";




interface UserDropdownProps {
  user: User;
}
const dropDownMenuItems = [
    {
        title: 'Home', href:'/', icon: <HomeIcon className="size-4" />
    },
    {
        title: 'Courses', href:'/courses', icon: <BookOpenText className="size-4" />
    },
    {
        title: 'Dashboard', href:'/dashboard', icon: <LayoutDashboard className="size-4" />
    }
]
export function UserDropdown({ user }: UserDropdownProps) {
  const  handleSignOut = useSignOut()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              width={16}
              height={16}
              className="rounded-full object-cover"
            />
          ) : (
            <UserIcon />
          )}
          <span className="max-w-[12rem] truncate">{user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
     {
        dropDownMenuItems.map((item,index)=>(
            <DropdownMenuItem 
            key={index}
            asChild
            >
                <Link href={
                    item.href
                } className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.title}</span>
                </Link>
            </DropdownMenuItem>
        ))
     }
        <DropdownMenuSeparator />
      
           <DropdownMenuItem onClick={handleSignOut}>
                     <IconLogout />
                     Log out
                   </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


