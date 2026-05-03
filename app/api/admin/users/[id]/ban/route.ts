import { NextRequest, NextResponse } from 'next/server'
import User from '@/models/User'
import { getTokenData } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const tokenData = getTokenData(req)

        if (!tokenData || tokenData.role !== 'admin') {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        await connectDB()

        const { id } = params
        const { banned } = await req.json()

        if (typeof banned !== 'boolean') {
            return NextResponse.json(
                { message: '`banned` must be a boolean' },
                { status: 400 }
            )
        }

        if (tokenData.userId === id) {
            return NextResponse.json(
                { message: 'You cannot ban your own account' },
                { status: 403 }
            )
        }

        const user = await User.findByIdAndUpdate(
            id,
            { banned },
            { new: true }
        ).select('_id name email role banned')

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            message: banned ? 'User banned' : 'User unbanned',
            user,
        }, { status: 200 })

    } catch (error) {
        console.error('[ADMIN BAN USER]', error)
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        )
    }
}