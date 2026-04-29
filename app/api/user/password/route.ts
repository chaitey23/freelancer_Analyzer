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
        const { currentPassword, newPassword } = await req.json()

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ message: 'All fields are required' }, { status: 400 })
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 })
        }

        const user = await User.findById(decoded.userId)
        if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 })

        const isMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isMatch) {
            return NextResponse.json({ message: 'Current password is incorrect' }, { status: 400 })
        }

        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()

        return NextResponse.json({ message: 'Password updated successfully' })

    } catch (error) {
        return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
    }
}