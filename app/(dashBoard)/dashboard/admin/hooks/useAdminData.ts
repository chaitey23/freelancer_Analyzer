import { useState, useEffect, useCallback } from 'react'
import axiosInstance from '@/lib/axios'
import { AdminUser, StatsType } from '../AdminTypes'

function computeStats(users: AdminUser[]): StatsType {
    const now = new Date()
    return {
        totalUsers: users.length,
        totalFreelancers: users.filter((u) => u.role === 'freelancer').length,
        totalClients: users.filter((u) => u.role === 'client').length,
        totalAdmins: users.filter((u) => u.role === 'admin').length,
        newThisMonth: users.filter((u) => {
            const created = new Date(u.createdAt)
            return (
                created.getMonth() === now.getMonth() &&
                created.getFullYear() === now.getFullYear()
            )
        }).length,
    }
}

export function useAdminData() {
    const [users, setUsers] = useState<AdminUser[]>([])
    const [stats, setStats] = useState<StatsType | null>(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const res = await axiosInstance.get('/admin/users')
            const allUsers: AdminUser[] = res.data.users
            setUsers(allUsers)
            setStats(computeStats(allUsers))
        } catch (err) {
            console.error('Error fetching admin data:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    const deleteUser = useCallback(async (userId: string) => {
        setActionLoading(userId)
        try {
            await axiosInstance.delete(`/admin/users/${userId}`)
            setUsers((prev) => prev.filter((u) => u._id !== userId))
            setStats((prev) =>
                prev ? { ...prev, totalUsers: prev.totalUsers - 1 } : null
            )
            return true
        } catch (err) {
            console.error(err)
            return false
        } finally {
            setActionLoading(null)
        }
    }, [])

    const toggleBan = useCallback(async (userId: string, currentBanStatus: boolean) => {
        setActionLoading(userId)
        try {
            await axiosInstance.patch(`/admin/users/${userId}/ban`, {
                banned: !currentBanStatus,
            })
            setUsers((prev) =>
                prev.map((u) =>
                    u._id === userId ? { ...u, banned: !currentBanStatus } : u
                )
            )
        } catch (err) {
            console.error(err)
        } finally {
            setActionLoading(null)
        }
    }, [])

    return { users, stats, loading, actionLoading, fetchData, deleteUser, toggleBan }
}