import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Freelancer from '@/models/Freelancer'
import { getTokenData } from '@/lib/auth'

export async function GET(req: NextRequest) {
    try {
        await connectDB()
        const tokenData = getTokenData(req)
        if (!tokenData) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const profile = await Freelancer.findOne({ userId: tokenData.userId })
        return NextResponse.json({ profile })
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}
export async function PUT(req: NextRequest) {
    try {
        await connectDB()
        const tokenData = getTokenData(req)
        if (!tokenData) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const {
            skills, bio, experience, portfolio, avatar,
            totalProjects, jobSuccessRate, responseRate,
            platform, yearsOfExperience
        } = await req.json()

        const profile = await Freelancer.findOneAndUpdate(
            { userId: tokenData.userId },
            {
                skills, bio, experience, portfolio, avatar,
                totalProjects, jobSuccessRate, responseRate,
                platform, yearsOfExperience
            },
            { new: true, upsert: true }
        )

        return NextResponse.json({ message: 'Profile updated', profile })
    } catch (error) {
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}