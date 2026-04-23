import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function getTokenData(req: NextRequest) {
    try {
        const token = req.cookies.get('token')?.value
        if (!token) return null

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            userId: string
            role: string
            email: string
        }
        return decoded
    } catch (error) {
        return null
    }
}