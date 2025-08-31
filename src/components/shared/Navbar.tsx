'use client'
import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '@/components/ui/button'

const Navbar = () => {

    const { data: session, status } = useSession()
    console.log("DATA: ", session)
    console.log("STATUS: ", status)

    // TODO: do this tomorrow (going to sleep)
    const user = session?.user as User

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className='flex justify-between items-center max-w-5xl mx-auto px-4 py-3'>
        <a className='text-2xl font-bold' href="#">Anonymous Chat</a>
        {
          session ? (
            <>
            <span className='text-sm text-gray-500'>Welcome, {user?.username || user?.email}</span>
            <Button onClick={() => signOut()}>Logout</Button>
            </>
          ) : (
            <div className='flex gap-2 items-center'>
              <Button asChild><Link href="/sign-in">Sign In</Link></Button>
              <Button asChild><Link href="/sign-up">Sign Up</Link></Button>
            </div>
          )
        }
      </div>
    </nav>
  )
}

export default Navbar