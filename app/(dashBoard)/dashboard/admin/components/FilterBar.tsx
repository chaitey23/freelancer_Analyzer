'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, Users, Briefcase, ShieldCheck, LayoutGrid } from 'lucide-react'
import { RoleFilter } from '../AdminTypes'

interface FilterBarProps {
    search: string
    onSearchChange: (value: string) => void
    roleFilter: RoleFilter
    onRoleFilterChange: (value: RoleFilter) => void
    resultCount: number
}

const ROLE_OPTIONS: { value: RoleFilter; label: string; icon: React.ReactNode; count?: number }[] = [
    { value: 'all', label: 'All Roles', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    { value: 'client', label: 'Clients', icon: <Users className="w-3.5 h-3.5" /> },
    { value: 'freelancer', label: 'Freelancers', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { value: 'admin', label: 'Administrators', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
]

export default function FilterBar({
    search,
    onSearchChange,
    roleFilter,
    onRoleFilterChange,
    resultCount,
}: FilterBarProps) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const selected = ROLE_OPTIONS.find(o => o.value === roleFilter) ?? ROLE_OPTIONS[0]

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

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

                {/* Custom Role Dropdown */}
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
                        <span className="text-indigo-400">{selected.icon}</span>
                        <span className="flex-1 text-left">{selected.label}</span>
                        <ChevronDown
                            className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {open && (
                        <div className="absolute z-50 mt-2 w-full min-w-[180px] right-0
                                        bg-[#0f1729] border border-white/[0.08] rounded-2xl
                                        shadow-[0_16px_40px_rgba(0,0,0,0.5)] overflow-hidden
                                        animate-in fade-in slide-in-from-top-2 duration-150">
                            <div className="p-1.5 flex flex-col gap-0.5">
                                {ROLE_OPTIONS.map((opt) => {
                                    const isActive = opt.value === roleFilter
                                    return (
                                        <button
                                            key={opt.value}
                                            onClick={() => { onRoleFilterChange(opt.value); setOpen(false) }}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
                                                        transition-all duration-150 text-left w-full
                                                        ${isActive
                                                    ? 'bg-indigo-500/15 text-indigo-300'
                                                    : 'text-slate-400 hover:bg-white/[0.05] hover:text-slate-200'
                                                }`}
                                        >
                                            <span className={isActive ? 'text-indigo-400' : 'text-slate-500'}>
                                                {opt.icon}
                                            </span>
                                            {opt.label}
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