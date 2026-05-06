'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, Star } from 'lucide-react'
import { RatingFilter } from '../users/reviewTypes'

interface ReviewFilterBarProps {
    search: string
    onSearchChange: (value: string) => void
    ratingFilter: RatingFilter
    onRatingFilterChange: (value: RatingFilter) => void
    resultCount: number
}

const RATING_OPTIONS: { value: RatingFilter; label: string; stars: number | null }[] = [
    { value: 'all', label: 'All Ratings', stars: null },
    { value: '5', label: 'Excellent', stars: 5 },
    { value: '4', label: 'Good', stars: 4 },
    { value: '3', label: 'Average', stars: 3 },
    { value: '2', label: 'Poor', stars: 2 },
    { value: '1', label: 'Terrible', stars: 1 },
]

const STAR_COLORS: Record<number, string> = {
    5: 'text-emerald-400',
    4: 'text-indigo-400',
    3: 'text-amber-400',
    2: 'text-orange-400',
    1: 'text-rose-400',
}

function StarRow({ count, color }: { count: number; color: string }) {
    return (
        <span className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`w-3 h-3 transition-colors ${i < count ? `${color} fill-current` : 'text-white/10 fill-current'}`}
                />
            ))}
        </span>
    )
}

export default function ReviewFilterBar({
    search,
    onSearchChange,
    ratingFilter,
    onRatingFilterChange,
    resultCount,
}: ReviewFilterBarProps) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const selected = RATING_OPTIONS.find(o => o.value === ratingFilter) ?? RATING_OPTIONS[0]

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div className="p-6 md:p-8 border-b border-white/[0.06] flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="h-10 w-1 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                <div>
                    <h2 className="text-xl font-bold text-white">Review Directory</h2>
                    <p className="text-xs text-slate-500">Managing {resultCount} reviews</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                {/* Search */}
                <div className="relative flex-1 lg:flex-none lg:w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search reviewer or freelancer..."
                        value={search}
                        onChange={e => onSearchChange(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl
                                   pl-11 pr-4 py-3 text-sm text-white placeholder-slate-600
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                                   focus:bg-white/[0.05] transition-all"
                    />
                </div>

                {/* Custom Rating Dropdown */}
                <div ref={ref} className="relative flex-1 lg:flex-none">
                    <button
                        onClick={() => setOpen(prev => !prev)}
                        className={`w-full flex items-center gap-2.5 bg-white/[0.03] border rounded-2xl
                                    pl-4 pr-4 py-3 text-sm text-slate-300 cursor-pointer
                                    focus:outline-none transition-all duration-200
                                    ${open
                                ? 'border-indigo-500/40 ring-2 ring-indigo-500/20 bg-white/[0.05]'
                                : 'border-white/[0.08] hover:border-white/[0.14]'
                            }`}
                    >
                        {selected.stars !== null
                            ? <StarRow count={selected.stars} color={STAR_COLORS[selected.stars]} />
                            : <Star className="w-3.5 h-3.5 text-slate-500" />
                        }
                        <span className="flex-1 text-left">{selected.label}</span>
                        <ChevronDown
                            className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {open && (
                        <div className="absolute z-50 mt-2 w-full min-w-[200px] right-0
                                        bg-[#0f1729] border border-white/[0.08] rounded-2xl
                                        shadow-[0_16px_40px_rgba(0,0,0,0.5)] overflow-hidden
                                        animate-in fade-in slide-in-from-top-2 duration-150">
                            <div className="p-1.5 flex flex-col gap-0.5">
                                {RATING_OPTIONS.map(opt => {
                                    const isActive = opt.value === ratingFilter
                                    const color = opt.stars ? STAR_COLORS[opt.stars] : 'text-slate-500'
                                    return (
                                        <button
                                            key={opt.value}
                                            onClick={() => { onRatingFilterChange(opt.value); setOpen(false) }}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                                                        transition-all duration-150 text-left w-full
                                                        ${isActive
                                                    ? 'bg-indigo-500/15 text-indigo-300'
                                                    : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-200'
                                                }`}
                                        >
                                            {opt.stars !== null
                                                ? <StarRow count={opt.stars} color={isActive ? color : 'text-slate-500'} />
                                                : <Star className="w-3.5 h-3.5 text-slate-500" />
                                            }
                                            <span>{opt.label}</span>
                                            {opt.stars !== null && (
                                                <span className="ml-1 text-xs text-slate-600">({opt.stars})</span>
                                            )}
                                            {isActive && (
                                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}