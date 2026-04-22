'use client'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Search, Filter, Star, ArrowRight, Code, Zap } from 'lucide-react' // Lucide icons ব্যবহার করলে ভালো দেখাবে

export default function ClientBrowse() {
    const { user } = useAuth("client")
    const [searchQuery, setSearchQuery] = useState('')

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0d0f1a]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    )

    return (
        <div className="min-h-screen  pt-24 pb-12 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">

                {/* Header Section with Search */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                            Explore <span className="text-indigo-600 dark:text-indigo-400">Experts</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Find the best talent analyzed by our smart metrics.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-grow md:w-80 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by skills or name..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all dark:text-white"
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="p-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all">
                            <Filter className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        </button>
                    </div>
                </div>

                {/* Freelancers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="group relative bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden">
                            {/* Decorative Background Blob */}
                            <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/5 blur-[50px] group-hover:bg-indigo-500/10 transition-all"></div>

                            {/* Top Section: Avatar & Score */}
                            <div className="flex justify-between items-start mb-5">
                                <div className="relative">
                                    <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                                        {/* Avatar Placeholder */}
                                        <span className="drop-shadow-md">JD</span>
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 border-4 border-white dark:border-[#1a1c2e] rounded-full"></div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-emerald-500 font-black text-xl">
                                        <Zap className="w-4 h-4 fill-emerald-500" />
                                        <span>9{i}</span>
                                    </div>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Trust Score</p>
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="mb-5">
                                <h3 className="text-lg font-black text-slate-800 dark:text-white group-hover:text-indigo-500 transition-colors">
                                    Freelancer Name {i}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Full Stack MERN Developer</p>

                                <div className="flex items-center gap-1 mt-2">
                                    {[...Array(5)].map((_, index) => (
                                        <Star key={index} className={`w-3 h-3 ${index < 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                                    ))}
                                    <span className="text-[11px] font-bold text-slate-400 ml-1">(4.8/5)</span>
                                </div>
                            </div>

                            {/* Skills Section */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {['React', 'Next.js', 'Tailwind'].map((skill) => (
                                    <span key={skill} className="text-[10px] font-bold px-3 py-1 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-white/5">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            {/* Action Button */}
                            <button className="w-full group/btn relative flex items-center justify-center gap-2 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-sm overflow-hidden transition-all active:scale-95">
                                <span className="relative z-10">View Analysis</span>
                                <ArrowRight className="relative z-10 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}