import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id as string
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
    authorized({ auth, request: nextUrl }) {
      const isLoggedIn = !!auth?.user
      const isAuthPage = nextUrl.nextUrl.pathname.startsWith('/auth')
      const isAdminPage = nextUrl.nextUrl.pathname.startsWith('/admin')

      if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL('/admin', nextUrl.nextUrl))
      }

      if (isAdminPage && !isLoggedIn) {
        return Response.redirect(new URL('/auth/login', nextUrl.nextUrl))
      }

      return true
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
