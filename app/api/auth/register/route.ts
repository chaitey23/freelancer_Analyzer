import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

export async function POST(req: NextRequest) {
    console.log('=== REGISTER API HIT ===')
    try {
        await connectDB()
        console.log('=== DB CONNECTED ===')

        const { name, email, password, role } = await req.json()
        console.log('=== DATA:', { name, email, role })

        // validation
        if (!name || !email || !password) {
            console.log('=== MISSING FIELDS ===')
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            console.log('=== PASSWORD TOO SHORT ===')
            return NextResponse.json(
                { message: 'Password must be at least 6 characters' },
                { status: 400 }
            )
        }

        const allowedRoles = ['client', 'freelancer']
        if (!allowedRoles.includes(role)) {
            console.log('=== INVALID ROLE:', role, '===')
            return NextResponse.json(
                { message: 'Invalid role' },
                { status: 400 }
            )
        }

        const sanitizedEmail = email.trim().toLowerCase()

        const existingUser = await User.findOne({ email: sanitizedEmail })
        console.log('=== EXISTING USER:', existingUser ? 'YES' : 'NO', '===')

        if (existingUser) {
            return NextResponse.json(
                { message: 'Email already exists' },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const user = await User.create({
            name: name.trim(),
            email: sanitizedEmail,
            password: hashedPassword,
            role
        })

        console.log('=== USER CREATED:', user._id, '===')

        return NextResponse.json(
            { message: 'User created successfully', userId: user._id },
            { status: 201 }
        )

    } catch (error) {
        console.error('=== REGISTER ERROR:', error, '===')
        return NextResponse.json(
            { message: 'Something went wrong' },
            { status: 500 }
        )
    }
}