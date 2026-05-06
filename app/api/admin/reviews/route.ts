import { NextRequest, NextResponse } from 'next/server'
import Review from '@/models/Review'
import '@/models/User'
import '@/models/Freelancer'
import { verifyAdmin } from '@/lib/verifyAdmin'
import { connectDB } from '@/lib/mongodb'

export async function GET(req: NextRequest) {
    const authError = await verifyAdmin(req)
    if (authError) return authError

    await connectDB()

    const reviews = await Review.find()
        .populate('clientId', 'name email')
        .populate({
            path: 'freelancerId',
            populate: { path: 'userId', select: 'name email' }
        })
        .sort({ createdAt: -1 })
        .lean()

    return NextResponse.json({ reviews })
}