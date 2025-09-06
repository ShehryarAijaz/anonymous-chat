import 'next-auth'
import 'next-auth/jwt'
import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
    interface User extends DefaultUser {
        id: string
        _id?: string
        isVerified?: boolean
        isAcceptingMessages?: boolean
        username?: string
        emailVerified?: Date | null
    }

    interface Session {
        user: {
            id: string
            _id?: string
            isVerified?: boolean
            isAcceptingMessages?: boolean
            username?: string
            emailVerified?: Date | null
        } & DefaultSession['user'];
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string
        isVerified?: boolean
        isAcceptingMessages?: boolean
        username?: string
        emailVerified?: Date | null
    }
}