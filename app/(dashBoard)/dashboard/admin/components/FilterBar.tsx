import { Search, ChevronDown } from 'lucide-react'
import { RoleFilter } from '../AdminTypes'

interface FilterBarProps {
    search: string
    onSearchChange: (value: string) => void
    roleFilter: RoleFilter
    onRoleFilterChange: (value: RoleFilter) => void
    resultCount: number
}

const ROLE_OPTIONS: { value: RoleFilter; label: string }[] = [
    { value: 'all', label: 'All Roles' },
    { value: 'client', label: 'Clients' },
    { value: 'freelancer', label: 'Freelancers' },
    { value: 'admin', label: 'Administrators' },
]

export default function FilterBar({
    search,
    onSearchChange,
    roleFilter,
    onRoleFilterChange,
    resultCount,
}: FilterBarProps) {
    return (
        <div className="p-6 md:p-8 border-b border-white/[0.06] flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Title */}
            <div className="flex items-center gap-4">
                <div className="h-10 w-1 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                <div>
                    <h2 className="text-xl font-bold text-white">User Directory</h2>
                    <p className="text-xs text-slate-500">
                        Real-time management of {resultCount} entities
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                {/* Search */}
                <div className="relative flex-1 lg:flex-none lg:w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search identity..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl
                                   pl-11 pr-4 py-3 text-sm text-white placeholder-slate-600
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                                   focus:bg-white/[0.05] transition-all"
                    />
                </div>

                {/* Role Select */}
                <div className="relative flex-1 lg:flex-none">
                    <select
                        value={roleFilter}
                        onChange={(e) => onRoleFilterChange(e.target.value as RoleFilter)}
                        className="w-full appearance-none bg-white/[0.03] border border-white/[0.08]
                                   rounded-2xl pl-5 pr-12 py-3 text-sm text-slate-300
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                    >
                        {ROLE_OPTIONS.map((opt) => (
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