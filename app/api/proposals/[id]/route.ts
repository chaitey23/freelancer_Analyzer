import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Proposal from '@/models/Proposal'
import Freelancer from '@/models/Freelancer'
import { getTokenData } from '@/lib/auth'


export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB()
        const { id } = await params
        const tokenData = getTokenData(req)
        if (!tokenData) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const { action } = await req.json()
        const proposal = await Proposal.findById(id)
        if (!proposal) return NextResponse.json({ message: 'Proposal not found' }, { status: 404 })

        const freelancer = await Freelancer.findOne({ userId: tokenData.userId })

        if (action === 'accept' || action === 'reject') {
            if (!freelancer || freelancer._id.toString() !== proposal.freelancerId.toString()) {
                return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
            }
            proposal.status = action === 'accept' ? 'accepted' : 'rejected'
        }

        if (action === 'complete') {
            if (!freelancer || freelancer._id.toString() !== proposal.freelancerId.toString()) {
                return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
            }
            if (proposal.status !== 'accepted') {
                return NextResponse.json({ message: 'Proposal must be accepted first' }, { status: 400 })
            }
            proposal.status = 'completed'
        }

        await proposal.save()
        return NextResponse.json({ message: `Proposal ${action}ed`, proposal })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}