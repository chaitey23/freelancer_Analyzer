export interface AdminUser {
    _id: string
    name: string
    email: string
    role: 'client' | 'freelancer' | 'admin'
    createdAt: string
    banned?: boolean
    avatar?: string
}

export interface StatsType {
    totalUsers: number
    totalFreelancers: number
    totalClients: number
    totalAdmins: number
    newThisMonth: number
}

export type RoleFilter = 'all' | 'client' | 'freelancer' | 'admin'