import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Review from '@/models/Review'
import Freelancer from '@/models/Freelancer'
import { getTokenData } from '@/lib/auth'

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ freelancerId: string }> }
) {
    try {
        await connectDB()
        const tokenData = getTokenData(req)
        if (!tokenData) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const { freelancerId } = await params

        const freelancer = await Freelancer.findOne({ userId: tokenData.userId })
        if (!freelancer || freelancer._id.toString() !== freelancerId) {
            return NextResponse.json({ message: 'Only the freelancer can reply' }, { status: 403 })
        }

        const { reviewId, comment } = await req.json()
        if (!reviewId || !comment) {
            return NextResponse.json({ message: 'reviewId and comment required' }, { status: 400 })
        }

        const review = await Review.findOne({
            _id: reviewId,
            freelancerId: freelancerId
        })
        if (!review) {
            return NextResponse.json({ message: 'Review not found' }, { status: 404 })
        }

        if (review.reply?.comment) {
            return NextResponse.json({ message: 'Already replied to this review' }, { status: 400 })
        }

        review.reply = { comment, createdAt: new Date() }
        await review.save()

        return NextResponse.json({ message: 'Reply added', review }, { status: 200 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}