import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { connectDB } from '@/lib/mongodb'
import Freelancer from '@/models/Freelancer'
import { getTokenData } from '@/lib/auth'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
    try {
        await connectDB()
        const tokenData = getTokenData(req)
        if (!tokenData) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

        const freelancer = await Freelancer.findOne({ userId: tokenData.userId })
        if (!freelancer) return NextResponse.json({ message: 'Profile not found' }, { status: 404 })

        const prompt = `
You are an expert freelancer reputation analyzer.

Analyze this freelancer's data and provide a trust score and detailed report:

Name context: Professional freelancer
Platform: ${freelancer.platform || 'Not specified'}
Bio: ${freelancer.bio || 'Not provided'}
Skills: ${freelancer.skills?.join(', ') || 'Not provided'}
Experience: ${freelancer.experience || 'Not provided'}
Years of Experience: ${freelancer.yearsOfExperience || 0}
Total Projects Completed: ${freelancer.totalProjects || 0}
Job Success Rate: ${freelancer.jobSuccessRate || 0}%
Response Rate: ${freelancer.responseRate || 0}%

Respond ONLY in this exact JSON format:
{
  "trustScore": <number between 0-100>,
  "summary": "<2-3 sentence overall summary>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "recommendation": "<1 sentence recommendation for clients>"
}
`

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
        const result = await model.generateContent(prompt)
        const text = result.response.text()

        const clean = text.replace(/```json|```/g, '').trim()
        const report = JSON.parse(clean)
        console.log("RAW TEXT:", text)

        await Freelancer.findOneAndUpdate(
            { userId: tokenData.userId },
            {
                trustScore: report.trustScore,
                aiReport: JSON.stringify(report)
            }
        )

        return NextResponse.json({ report })
    } catch (error) {
        console.error('ANALYZE ERROR:', error)
        return NextResponse.json({ message: 'Analysis failed' }, { status: 500 })
    }
}