import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Freelancer from '@/models/Freelancer'
import User from '@/models/User'

export async function GET() {
    try {
        await connectDB()

        const freelancers = await Freelancer.find({}).populate('userId', 'name email')

        return NextResponse.json({ freelancers })
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}