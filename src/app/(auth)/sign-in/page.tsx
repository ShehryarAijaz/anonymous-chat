'use client'
import React from 'react'
import { useSession, signOut, signIn } from 'next-auth/react'

const Page = () => {
    const { data: session } = useSession()
    if (session) {
      return (
        <>
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
        </>
      )
    }
    return (
        <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
        </>
    )
}

export default Page