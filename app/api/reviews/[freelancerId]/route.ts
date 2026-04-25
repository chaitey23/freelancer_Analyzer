import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Review from '@/models/Review'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ freelancerId: string }> }
) {
    try {
        await connectDB()
        const { freelancerId } = await params  // ← await

        const reviews = await Review.find({ freelancerId, isFake: false })
            .populate('clientId', 'name')
            .sort({ createdAt: -1 })

        return NextResponse.json({ reviews })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}