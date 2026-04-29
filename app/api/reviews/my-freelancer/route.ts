import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Review from '@/models/Review'
import Freelancer from '@/models/Freelancer'
import '@/models/User'
import { getTokenData } from '@/lib/auth'

export async function GET(req: NextRequest) {

    try {
        await connectDB()
        const tokenData = getTokenData(req)
        if (!tokenData) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const freelancer = await Freelancer.findOne({ userId: tokenData.userId })
        if (!freelancer) return NextResponse.json({ reviews: [] })

        const reviews = await Review.find({ freelancerId: freelancer._id })
            .populate('clientId', 'name')
            .sort({ createdAt: -1 })

        return NextResponse.json({ reviews, freelancerId: freelancer._id.toString() })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}