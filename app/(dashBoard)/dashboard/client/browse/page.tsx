'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Search, SlidersHorizontal, ArrowUpRight, Zap, Users, TrendingUp, Award } from 'lucide-react'
import axiosInstance from '@/lib/axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import FreelancerGrid from '@/components/FreelancerGrid'

interface Freelancer {
    _id: string
    avatar: string
    bio: string
    experience: string
    skills: string[]
    trustScore: number
    userId: {
        _id: string
        name: string
        email: string
    }
}

export default function ClientBrowse() {
    const { user } = useAuth("client")
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [freelancers, setFreelancers] = useState<Freelancer[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFreelancers = async () => {
            try {
                const res = await axiosInstance.get('/freelancers')
                setFreelancers(res.data.freelancers)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        if (user) fetchFreelancers()
    }, [user])

    const filtered = freelancers.filter(f => {
        const query = searchQuery.toLowerCase()
        return (
            f.userId?.name?.toLowerCase().includes(query) ||
            f.skills?.some(s => s.toLowerCase().includes(query))
        )
    })

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 animate-spin border-t-indigo-500" />
                <div className="absolute inset-0 rounded-full blur-md bg-indigo-500/10" />
            </div>
        </div>
    )
    return <FreelancerGrid
        freelancers={freelancers}
        filtered={filtered}
        loading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCardClick={(id) => router.push(`/freelancers/${id}`)}
    />
}