import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Review from '@/models/Review'
import { getTokenData } from '@/lib/auth'

export async function GET(req: NextRequest) {
    try {
        await connectDB()
        const tokenData = getTokenData(req)
        if (!tokenData) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const reviews = await Review.find({ clientId: tokenData.userId })
            .populate('freelancerId', 'bio skills trustScore userId avatar')
            .populate({
                path: 'freelancerId',
                populate: { path: 'userId', select: 'name' }
            })
            .sort({ createdAt: -1 })

        return NextResponse.json({ reviews })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}