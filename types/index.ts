export interface UserType {
    id: string
    name: string
    email: string
    role: 'admin' | 'freelancer' | 'client'
    avatar?: string
}

export interface FreelancerType {
    _id: string
    userId: {
        _id: string
        name: string
        email: string
    }
    avatar: string
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