import { Users, UserCheck, Shield, TrendingUp, Activity } from 'lucide-react'
import { StatsType } from '../AdminTypes'

interface StatsGridProps {
    stats: StatsType
}

const STAT_CARDS = (stats: StatsType) => [
    {
        label: 'Total Base',
        value: stats.totalUsers,
        color: '#6366f1',
        icon: Users,
        desc: 'Registered accounts',
    },
    {
        label: 'Talent',
        value: stats.totalFreelancers,
        color: '#818cf8',
        icon: Activity,
        desc: 'Active specialists',
    },
    {
        label: 'Partners',
        value: stats.totalClients,
        color: '#10b981',
        icon: UserCheck,
        desc: 'Verified recruiters',
    },
    {
        label: 'Guardians',
        value: stats.totalAdmins,
        color: '#f59e0b',
        icon: Shield,
        desc: 'System operators',
    },
    {
        label: 'Growth',
        value: `+${stats.newThisMonth}`,
        color: '#ec4899',
        icon: TrendingUp,
        desc: 'New joiners',
    },
]

export default function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12 relative z-10">
            {STAT_CARDS(stats).map((s) => (
                <div
                    key={s.label}
                    className="relative group overflow-hidden bg-white/[0.02] border border-white/[0.06]
                               rounded-3xl p-6 transition-all hover:bg-white/[0.04] hover:border-white/[0.12]
                               hover:-translate-y-1"
                >
                    <div className="relative z-10">
                        <div className="p-2.5 rounded-xl bg-white/[0.04] w-fit mb-4 group-hover:scale-110 transition-transform">
                            <s.icon className="w-5 h-5" style={{ color: s.color }} />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-1 tracking-tight">
                            {s.value}
                        </h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                            {s.label}
                        </p>
                        <p className="text-[10px] text-slate-600">{s.desc}</p>
                    </div>

                    {/* Background decorative icon */}
                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                        <s.icon className="w-24 h-24 rotate-12 text-white" />
                    </div>
                </div>
            ))}
        </div>
    )
}