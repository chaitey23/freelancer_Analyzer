import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Proposal from '@/models/Proposal'
import Freelancer from '@/models/Freelancer'
import { getTokenData } from '@/lib/auth'

// POST — client proposal পাঠাবে
export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const tokenData = getTokenData(req)
        if (!tokenData) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const { freelancerId, message } = await req.json()
        if (!freelancerId || !message) {
            return NextResponse.json({ message: 'freelancerId and message required' }, { status: 400 })
        }

        // আগে proposal দিয়েছে কিনা check
        const existing = await Proposal.findOne({
            clientId: tokenData.userId,
            freelancerId,
            status: { $in: ['pending', 'accepted'] }
        })
        if (existing) {
            return NextResponse.json({ message: 'You already have an active proposal with this freelancer' }, { status: 400 })
        }

        const proposal = await Proposal.create({
            clientId: tokenData.userId,
            freelancerId,
            message,
        })

        return NextResponse.json({ message: 'Proposal sent', proposal }, { status: 201 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}

// GET — client এর সব proposals
export async function GET(req: NextRequest) {
    try {
        await connectDB()
        const tokenData = getTokenData(req)
        if (!tokenData) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const proposals = await Proposal.find({ clientId: tokenData.userId })
            .populate('freelancerId', 'bio skills trustScore userId')
            .sort({ createdAt: -1 })

        return NextResponse.json({ proposals })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}