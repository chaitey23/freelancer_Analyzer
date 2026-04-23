'use client'
import { useAuth } from '@/hooks/useAuth'
import AnalyticsForm from '@/components/ui/AnalyticsForm'

export default function FreelancerAnalytics() {
    const { user } = useAuth('freelancer')

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center bg-[#080b14]">
            <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-400 animate-spin" />
        </div>
    )

    return (
        <div className="min-h-screen  pt-24 pb-20 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-end justify-between mb-8 pb-6 border-b border-white/[0.06]">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-100" style={{ letterSpacing: '-0.03em' }}>
                            AI <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Analytics</span>
                        </h1>
                        <p className="text-slate-500 text-sm mt-1.5 font-normal">
                            AI-powered trust score based on your freelance stats
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-indigo-500/[0.08] border border-indigo-400/20 rounded-full px-3.5 py-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Powered by AI</span>
                    </div>
                </div>

                <AnalyticsForm />
            </div>
        </div>
    )
}