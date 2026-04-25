import { Search, SlidersHorizontal, ArrowUpRight, Zap, Users, TrendingUp, Award } from 'lucide-react'
import Image from 'next/image'

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

interface FreelancerGridProps {
    freelancers: Freelancer[]
    filtered: Freelancer[]
    loading: boolean
    searchQuery: string
    onSearchChange: (val: string) => void
    onCardClick: (id: string) => void
}

export default function FreelancerGrid({
    freelancers,
    filtered,
    loading,
    searchQuery,
    onSearchChange,
    onCardClick,
}: FreelancerGridProps) {
    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">

                <div className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full
                                bg-indigo-500/10 border border-indigo-500/20
                                text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-widest uppercase">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                Talent Marketplace
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-black tracking-tight
                                text-slate-900 dark:text-white leading-[1.08]">
                                Find your next
                                <span className="block bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500
                                    bg-clip-text text-transparent">
                                    Expert
                                </span>
                            </h1>
                            <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm max-w-xs leading-relaxed">
                                Every profile is scored by our AI trust engine — no guesswork.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative flex-grow md:w-72 group">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4
                                    text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                                <input
                                    type="text"
                                    placeholder="Name or skill…"
                                    value={searchQuery}
                                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl
                                        bg-white dark:bg-white/[0.04]
                                        border border-slate-200 dark:border-white/[0.08]
                                        text-slate-800 dark:text-white placeholder:text-slate-400
                                        focus:outline-none focus:ring-2 focus:ring-indigo-500/40
                                        focus:border-indigo-500/40 transition-all duration-200"
                                    onChange={(e) => onSearchChange(e.target.value)}
                                />
                            </div>
                            <button className="flex-shrink-0 p-2.5 rounded-2xl
                                bg-white dark:bg-white/[0.04]
                                border border-slate-200 dark:border-white/[0.08]
                                hover:bg-indigo-50 dark:hover:bg-indigo-500/10
                                hover:border-indigo-300 dark:hover:border-indigo-500/30
                                text-slate-500 dark:text-slate-400
                                hover:text-indigo-600 dark:hover:text-indigo-400
                                transition-all duration-200">
                                <SlidersHorizontal className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-8 grid grid-cols-3 gap-3">
                        {[
                            { icon: Users, label: 'Active Experts', value: `${freelancers.length}` },
                            {
                                icon: TrendingUp, label: 'Success Rate',
                                value: freelancers.length > 0
                                    ? `${Math.round((freelancers.filter(f => (f.trustScore || 0) >= 70).length / freelancers.length) * 100)}%`
                                    : '—'
                            },
                            {
                                icon: Award, label: 'Avg Trust Score',
                                value: freelancers.length > 0
                                    ? `${Math.round(freelancers.reduce((sum, f) => sum + (f.trustScore || 0), 0) / freelancers.length)}`
                                    : '—'
                            },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-2xl
                                bg-white dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06]">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center
                                    bg-indigo-50 dark:bg-indigo-500/10 flex-shrink-0">
                                    <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{label}</p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-white">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 animate-spin border-t-indigo-500" />
                            <div className="absolute inset-0 rounded-full blur-md bg-indigo-500/10" />
                        </div>
                        <p className="text-xs text-slate-400 tracking-widest uppercase">Loading experts…</p>
                    </div>
                )}

                {/* Empty */}
                {!loading && filtered.length === 0 && (
                    <div className="text-center py-24">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                            <Search className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 font-semibold text-base">No experts found</p>
                        <p className="text-slate-400 text-sm mt-1">Try searching with a different keyword.</p>
                    </div>
                )}

                {/* Grid */}
                {!loading && filtered.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((f) => {
                            const initials = f.userId?.name
                                ?.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
                            const score = f.trustScore || 0
                            const scoreColor = score >= 90 ? 'text-emerald-500' : score >= 70 ? 'text-indigo-500' : 'text-amber-500'
                            const scoreBg = score >= 90 ? 'bg-emerald-500/10 border-emerald-500/20' : score >= 70 ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-amber-500/10 border-amber-500/20'

                            return (
                                <div key={f._id}
                                    onClick={() => onCardClick(f._id)}
                                    className="group relative flex flex-col
                                        bg-white dark:bg-white/[0.03]
                                        border border-slate-200 dark:border-white/[0.07]
                                        hover:border-indigo-300 dark:hover:border-indigo-500/30
                                        rounded-[1.75rem] p-5 overflow-hidden
                                        hover:shadow-xl hover:shadow-indigo-500/[0.07]
                                        transition-all duration-300 cursor-pointer">

                                    <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full
                                        bg-indigo-500/0 group-hover:bg-indigo-500/8
                                        blur-2xl transition-all duration-500 pointer-events-none" />

                                    <div className="flex items-start justify-between mb-4">
                                        <div className="relative">
                                            {f.avatar ? (
                                                <Image src={f.avatar} alt={f.userId?.name}
                                                    width={56} height={56}
                                                    className="w-14 h-14 rounded-2xl object-cover" />
                                            ) : (
                                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center
                                                    bg-gradient-to-br from-indigo-500 to-purple-600
                                                    text-white text-lg font-black
                                                    group-hover:scale-105 transition-transform duration-300">
                                                    {initials}
                                                </div>
                                            )}
                                            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5
                                                bg-emerald-400 rounded-full border-2 border-white dark:border-[#0e1020]" />
                                        </div>
                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${scoreBg}`}>
                                            <Zap className={`w-3 h-3 ${scoreColor}`} />
                                            <span className={`text-sm font-black ${scoreColor}`}>{score}</span>
                                        </div>
                                    </div>

                                    <div className="mb-4 flex-1">
                                        <h3 className="text-base font-bold text-slate-800 dark:text-white
                                            group-hover:text-indigo-600 dark:group-hover:text-indigo-400
                                            transition-colors duration-200 leading-tight">
                                            {f.userId?.name}
                                        </h3>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                                            {f.experience || 'Freelancer'}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 mb-5">
                                        {f.skills?.slice(0, 3).map((skill) => (
                                            <span key={skill} className="text-[10px] font-semibold px-2.5 py-1 rounded-lg
                                                bg-slate-100 dark:bg-white/[0.05]
                                                text-slate-500 dark:text-slate-400
                                                border border-slate-200 dark:border-white/[0.06]
                                                tracking-wide uppercase">
                                                {skill}
                                            </span>
                                        ))}
                                        {f.skills?.length > 3 && (
                                            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg
                                                bg-indigo-50 dark:bg-indigo-500/10
                                                text-indigo-600 dark:text-indigo-400
                                                border border-indigo-100 dark:border-indigo-500/20">
                                                +{f.skills.length - 3}
                                            </span>
                                        )}
                                    </div>

                                    <div className="h-px bg-slate-100 dark:bg-white/[0.06] mb-4" />

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                                            View full profile
                                        </span>
                                        <div className="w-8 h-8 rounded-xl flex items-center justify-center
                                            bg-slate-100 dark:bg-white/[0.06]
                                            group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500
                                            transition-all duration-300">
                                            <ArrowUpRight className="w-4 h-4 text-slate-500 dark:text-slate-400
                                                group-hover:text-white transition-colors duration-300" />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}