'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'
import { ThemeModeToggle } from '@/components/shared/ThemeModeToggle'

const Navbar = () => {

    const { data: session, status } = useSession()
    const user = session?.user as User

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className='flex justify-between items-center max-w-6xl mx-auto px-4 py-3'>
        <a className='text-2xl font-bold' href="#">Anonymous Chat</a>
        {session ? (
          <>
          <div className="flex items-center gap-3">
            <Button onClick={() => signOut()}>Logout</Button>
            <ThemeModeToggle />
          </div>
          </>
        ) : (
          <div className='flex gap-2 items-center'>
            <Button asChild><Link href="/sign-in">Sign In</Link></Button>
            <Button asChild><Link href="/sign-up">Sign Up</Link></Button>
            <ThemeModeToggle />
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar