export type Stat = {
    value: number
    suffix: string
    label: string
    description: string
    color: string
    glowColor: string
    icon: React.ReactNode
}

export const stats: Stat[] = [
    {
        value: 12400,
        suffix: '+',
        label: 'Freelancers Analyzed',
        description: 'Across 50+ platforms',
        color: 'from-indigo-500 to-violet-500',
        glowColor: 'rgba(99,102,241,0.15)',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                < circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                < path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
    {
        value: 98,
        suffix: '%',
        label: 'Scoring Accuracy',
        description: 'Verified by real hiring data',
        color: 'from-cyan-500 to-blue-500',
        glowColor: 'rgba(6,182,212,0.15)',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
        ),
    },
    {
        value: 3200,
        suffix: '+',
        label: 'Clients Served',
        description: 'From startups to enterprises',
        color: 'from-violet-500 to-purple-500',
        glowColor: 'rgba(139,92,246,0.15)',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
        ),
    },
    {
        value: 4.9,
        suffix: '/5',
        label: 'Platform Rating',
        description: 'Based on 800+ reviews',
        color: 'from-amber-400 to-orange-500',
        glowColor: 'rgba(251,191,36,0.12)',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ),
    },
]