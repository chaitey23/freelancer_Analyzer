import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value
    const { pathname } = req.nextUrl

    const authRoutes = ['/login', '/register']
    if (authRoutes.includes(pathname)) {
        if (token) {
            return NextResponse.redirect(new URL('/', req.url))
        }
        return NextResponse.next()
    }

    if (pathname.startsWith('/dashboard')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url))
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET)
            const { payload } = await jwtVerify(token, secret)
            const role = payload.role as string

            if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
                return NextResponse.redirect(new URL('/unauthorized', req.url))
            }

            if (pathname.startsWith('/dashboard/freelancer') && role !== 'freelancer') {
                return NextResponse.redirect(new URL('/unauthorized', req.url))
            }

            if (pathname.startsWith('/dashboard/client') && role !== 'client') {
                return NextResponse.redirect(new URL('/unauthorized', req.url))
            }

        } catch (error) {
            return NextResponse.redirect(new URL('/login', req.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register']
}