import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Review from '@/models/Review'
import Proposal from '@/models/Proposal'
import { getTokenData } from '@/lib/auth'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ freelancerId: string }> }
) {
    try {
        await connectDB()
        const { freelancerId } = await params

        const tokenData = getTokenData(req)
        if (!tokenData) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const review = await Review.findOne({
            clientId: tokenData.userId,
            freelancerId
        })

        const completedProposal = await Proposal.findOne({
            clientId: tokenData.userId,
            freelancerId,
            status: 'completed'
        })

        return NextResponse.json({
            review,
            canReview: !!completedProposal && !review
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}