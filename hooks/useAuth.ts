import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserType } from '@/types'
import axiosInstance from '@/lib/axios'

export function useAuth(requiredRole?: string) {
    const router = useRouter()
    const [user, setUser] = useState<UserType | null>(null)
    const isMounted = useRef(false)

    useEffect(() => {
        if (isMounted.current) return
        isMounted.current = true

        const userData = localStorage.getItem('user')
        if (!userData) {
            router.push('/login')
            return
        }

        const parsed = JSON.parse(userData)

        if (requiredRole && parsed.role !== requiredRole) {
            router.push('/login')
            return
        }

        setTimeout(() => setUser(parsed), 0)
    }, [router, requiredRole])

    const logout = async () => {
        await axiosInstance.post('/auth/logout')
        localStorage.removeItem('user')
        window.location.href = '/'
    }
    return { user, logout }
}