import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

export async function POST(req: NextRequest) {
    try {
        await connectDB()

        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: 'Password must be at least 6 characters' },
                { status: 400 }
            )
        }

        const ip = req.headers.get('x-forwarded-for') || 'unknown'
        const attempts = loginAttempts.get(ip)
        const now = Date.now()

        if (attempts) {
            if (attempts.count >= 5 && now - attempts.lastAttempt < 15 * 60 * 1000) {
                return NextResponse.json(
                    { message: 'Too many attempts. Try again after 15 minutes' },
                    { status: 429 }
                )
            }
            if (now - attempts.lastAttempt > 15 * 60 * 1000) {
                loginAttempts.delete(ip)
            }
        }

        const sanitizedEmail = email.trim().toLowerCase()

        const user = await User.findOne({ email: sanitizedEmail })
        if (!user) {
            loginAttempts.set(ip, {
                count: (attempts?.count || 0) + 1,
                lastAttempt: now
            })
            return NextResponse.json(
                { message: 'Invalid email or password' },
                { status: 401 }
            )
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            loginAttempts.set(ip, {
                count: (attempts?.count || 0) + 1,
                lastAttempt: now
            })
            return NextResponse.json(
                { message: 'Invalid email or password' },
                { status: 401 }
            )
        }

        loginAttempts.delete(ip)

        const token = jwt.sign(
            { userId: user._id, role: user.role, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        )

        const response = NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
            path: '/'
        })

        return response

    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { message: 'Something went wrong' },
            { status: 500 }
        )
    }
}