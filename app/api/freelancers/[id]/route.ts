import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Freelancer from '@/models/Freelancer'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB()

        const { id } = await params

        const freelancer = await Freelancer.findById(id)
            .populate('userId', 'name email createdAt')

        if (!freelancer) {
            return NextResponse.json({ message: 'Freelancer not found' }, { status: 404 })
        }

        return NextResponse.json({ freelancer })
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}