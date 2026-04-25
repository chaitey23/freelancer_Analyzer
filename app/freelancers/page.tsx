"use client"
import FreelancerGrid from '@/components/FreelancerGrid'
import axiosInstance from '@/lib/axios'
import { FreelancerType } from '@/types'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function FreelancersPage() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState('')
    const [freelancers, setFreelancers] = useState<FreelancerType[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axiosInstance.get('/freelancers')
            .then(res => setFreelancers(res.data.freelancers))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const filtered = freelancers.filter(f => {
        const query = searchQuery.toLowerCase()
        return f.userId?.name?.toLowerCase().includes(query) ||
            f.skills?.some(s => s.toLowerCase().includes(query))
    })

    const handleCardClick = (id: string) => {
        const user = localStorage.getItem('user')
        if (!user) { router.push('/login'); return }
        router.push(`/freelancers/${id}`)
    }

    return <FreelancerGrid
        freelancers={freelancers}
        filtered={filtered}
        loading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCardClick={handleCardClick}
    />
}