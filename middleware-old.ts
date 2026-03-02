import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

export default NextAuth(authConfig).auth

export const confing = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}
