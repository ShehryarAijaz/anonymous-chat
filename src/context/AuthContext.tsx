"use client"
import React from "react"
import { SessionProvider } from "next-auth/react"

export default function AuthContext({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider
            refetchInterval={5 * 60} // Refetch session every 5 minutes
            refetchOnWindowFocus={false} // Refetch when window regains focus
            refetchWhenOffline={false} // Don't refetch when offline
        >
            {children}
        </SessionProvider>
    )
}