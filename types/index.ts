export interface UserType {
    id: string
    name: string
    email: string
    role: 'admin' | 'freelancer' | 'client'
}

export interface FreelancerType {
    _id: string
    userId: string
    skills: string[]
    experience: string
    portfolio: string
    bio: string
    trustScore: number
}

export interface ReviewType {
    _id: string
    freelancerId: string
    clientId: string
    rating: number
    comment: string
    isFake: boolean
    createdAt: string
}