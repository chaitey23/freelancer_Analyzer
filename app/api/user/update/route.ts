import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

function getUserFromToken(req: NextRequest) {
    const token = req.cookies.get('token')?.value
    if (!token) return null
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string }
    } catch {
        return null
    }
}

export async function PUT(req: NextRequest) {
    try {
        const decoded = getUserFromToken(req)
        if (!decoded) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        await connectDB()
        const { name, email, avatar } = await req.json()

        if (!name || !email) {
            return NextResponse.json({ message: 'Name and email are required' }, { status: 400 })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({ message: 'Invalid email' }, { status: 400 })
        }

        const existing = await User.findOne({ email, _id: { $ne: decoded.userId } })
        if (existing) {
            return NextResponse.json({ message: 'Email already in use' }, { status: 400 })
        }

        const user = await User.findByIdAndUpdate(
            decoded.userId,
            { name, email, ...(avatar && { avatar }) },
            { new: true }
        )

        return NextResponse.json({
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        })

    } catch (error) {
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
    }
}