import { Search, ChevronDown } from 'lucide-react'
import { RatingFilter } from '../users/reviewTypes'

interface ReviewFilterBarProps {
    search: string
    onSearchChange: (value: string) => void
    ratingFilter: RatingFilter
    onRatingFilterChange: (value: RatingFilter) => void
    resultCount: number
}

const RATING_OPTIONS: { value: RatingFilter; label: string }[] = [
    { value: 'all', label: 'All Ratings' },
    { value: '5', label: '★★★★★ (5)' },
    { value: '4', label: '★★★★☆ (4)' },
    { value: '3', label: '★★★☆☆ (3)' },
    { value: '2', label: '★★☆☆☆ (2)' },
    { value: '1', label: '★☆☆☆☆ (1)' },
]

export default function ReviewFilterBar({
    search,
    onSearchChange,
    ratingFilter,
    onRatingFilterChange,
    resultCount,
}: ReviewFilterBarProps) {
    return (
        <div className="p-6 md:p-8 border-b border-white/[0.06] flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="h-10 w-1 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                <div>
                    <h2 className="text-xl font-bold text-white">Review Directory</h2>
                    <p className="text-xs text-slate-500">
                        Managing {resultCount} reviews
                    </p>
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

                {/* Rating Filter */}
                <div className="relative flex-1 lg:flex-none">
                    <select
                        value={ratingFilter}
                        onChange={e => onRatingFilterChange(e.target.value as RatingFilter)}
                        className="w-full appearance-none bg-white/[0.03] border border-white/[0.08]
                                   rounded-2xl pl-5 pr-12 py-3 text-sm text-slate-300
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                    >
                        {RATING_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value} className="bg-[#0f172a]">
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
            </div>
        </div>
    )
}