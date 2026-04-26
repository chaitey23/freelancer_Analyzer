import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User';
import Freelancer from '@/models/Freelancer'
import Proposal from '@/models/Proposal'
import { getTokenData } from '@/lib/auth'

export async function GET(req: NextRequest) {
    try {
        await connectDB()
        const tokenData = getTokenData(req)
        if (!tokenData) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const freelancer = await Freelancer.findOne({ userId: tokenData.userId })
        if (!freelancer) return NextResponse.json({ message: 'Freelancer not found' }, { status: 404 })

        const proposals = await Proposal.find({ freelancerId: freelancer._id })
            .populate('clientId', 'name email')
            .sort({ createdAt: -1 })

        return NextResponse.json({ proposals })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}