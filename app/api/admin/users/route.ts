import { NextRequest, NextResponse } from 'next/server'
import User from '@/models/User'
import { getTokenData } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'

export async function GET(req: NextRequest) {
    try {
        const tokenData = getTokenData(req)

        if (!tokenData || tokenData.role !== 'admin') {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            )
        }

        await connectDB()

        const users = await User.find({})
            .select('_id name email role createdAt banned')
            .sort({ createdAt: -1 })
            .lean()

        return NextResponse.json({ users }, { status: 200 })

    } catch (error) {
        console.error('[ADMIN GET USERS]', error)
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        )
    }
}