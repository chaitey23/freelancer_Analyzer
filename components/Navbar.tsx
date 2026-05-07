'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import axiosInstance from '@/lib/axios'
import { UserType } from '@/types'
export default function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useState<UserType | null>(null)
    const [menuOpen, setMenuOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const profileRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const syncUser = () => {
            const userData = localStorage.getItem('user')
            setUser(userData ? JSON.parse(userData) : null)
        }
        syncUser()
        window.addEventListener('storage', syncUser)
        return () => window.removeEventListener('storage', syncUser)
    }, [pathname])


    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close menus on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const logout = async () => {
        try {
            await axiosInstance.post('/auth/logout')
        } catch (error) { console.error(error) }
        localStorage.removeItem('user')
        setUser(null)
        router.push('/login')
    }

    const isActive = (path: string) => pathname === path

    const navLinkClass = (path: string) =>
        `relative text-[13px] font-bold px-5 py-2 rounded-full transition-all duration-300 flex items-center justify-center border ${isActive(path)
            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/40'
            : 'text-slate-700 dark:text-slate-100 bg-white/50 dark:bg-white/10 border-slate-300/50 dark:border-white/10 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400'
        }`

    const getNavLinks = () => {
        if (!user) return <Link href="/freelancers" className={navLinkClass('/freelancers')}>Browse Freelancers</Link>

        if (user.role === 'freelancer') return (
            <>
                <Link href="/dashboard/freelancer/profile" className={navLinkClass('/dashboard/freelancer/profile')}>Profile</Link>
                <Link href="/dashboard/freelancer/reviews" className={navLinkClass('/dashboard/freelancer/reviews')}>Reviews</Link>
                <Link href="/dashboard/freelancer/analytics" className={navLinkClass('/dashboard/freelancer/analytics')}>Analytics</Link>
            </>
        )
        if (user.role === 'client') return (
            <>
                <Link href="/dashboard/client/browse" className={navLinkClass('/dashboard/client/browse')}>Browse</Link>
                <Link href="/dashboard/client/my-reviews" className={navLinkClass('/dashboard/client/my-reviews')}>My Reviews</Link>
            </>
        )
        if (user.role === 'admin') return (
            <>
                <Link href="/dashboard/admin/users" className={navLinkClass('/dashboard/admin/users')}>Users</Link>
                <Link href="/dashboard/admin/reviews" className={navLinkClass('/dashboard/admin/reviews')}>Reviews</Link>
                <Link href="/dashboard/admin/suspicious" className={navLinkClass('/dashboard/admin/suspicious')}>Suspicious</Link>
            </>
        )
    }

    const roleColor: Record<string, string> = {
        freelancer: 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        client: 'bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        admin: 'bg-rose-100/80 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    }

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${scrolled ? 'bg-white/70 dark:bg-[#0d0f1a]/70 backdrop-blur-2xl border-b border-slate-200/50 dark:border-white/10 py-2.5' : 'bg-transparent py-5'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

                {/* Logo Section - Unique & Modern Design */}
                <Link href="/" className="flex items-center gap-3 shrink-0 group">
                    {/* Abstract Icon with Gradient & Glow */}
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                        <div className="relative w-10 h-10 bg-[#12141d] dark:bg-white rounded-xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 border border-white/10 dark:border-black/5">
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-purple-600 font-black text-lg">
                                F
                            </span>
                        </div>
                    </div>

                    {/* Text Logo with Typography Styling */}
                    <div className="flex flex-col">
                        <span className="font-black tracking-tighter text-2xl flex items-center leading-none">
                            <span className="text-slate-900 dark:text-white transition-colors duration-300 group-hover:text-indigo-500">
                                Freelancer
                            </span>
                            <span className="relative">
                                <span className="text-indigo-600 dark:text-indigo-400">Analyzer</span>
                                {/* Underline decoration */}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 group-hover:w-full"></span>
                            </span>
                        </span>
                        {/* Subtitle - Professional touch */}
                        <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500 dark:text-slate-400 mt-0.5 ml-0.5 group-hover:text-indigo-400 transition-colors">
                            Smart Insights & Analytics
                        </span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-2 px-2 py-1.5 rounded-full bg-white/20 dark:bg-white/5 border border-slate-200/40 dark:border-white/10 backdrop-blur-md">
                    {getNavLinks()}
                </div>

                {/* Right Actions (Profile & Dropdown) */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-3 bg-white/60 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-full pl-1.5 pr-3 py-1.5 hover:border-indigo-400 transition-all backdrop-blur-md"
                            >
                                <div className="w-8 h-8 rounded-full overflow-hidden shadow-md shrink-0">
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-black">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="text-left leading-tight hidden xs:block">
                                    <p className="text-[12px] font-bold text-slate-800 dark:text-slate-100">{user.name}</p>
                                    <span className={`text-[9px] uppercase font-black px-1.5 rounded ${roleColor[user.role]}`}>{user.role}</span>
                                </div>
                                <svg className={`w-4 h-4 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>

                            {/* Dropdown Menu */}
                            {profileOpen && (
                                <div className="absolute right-0 mt-3 w-52 rounded-2xl bg-white dark:bg-[#141724] border border-slate-200 dark:border-white/10 shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5 mb-2">
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Account</p>
                                    </div>
                                    <Link href="/settings" className="flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors">
                                        Settings
                                    </Link>
                                    {user.role === 'client' && (
                                        <Link href="/dashboard/client" className={`flex items-center gap-2 px-3 py-2.5 text-sm font-bold rounded-xl transition-colors ${pathname === '/dashboard/client'
                                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                            : 'text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                                            }`}>
                                            Dashboard
                                        </Link>
                                    )}
                                    {user.role === 'freelancer' && (
                                        <Link href="/dashboard/freelancer" className={`flex items-center gap-2 px-3 py-2.5 text-sm font-bold rounded-xl transition-colors ${pathname === '/dashboard/freelancer'
                                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                            : 'text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                                            }`}>
                                            Dashboard
                                        </Link>
                                    )}
                                    {user.role === 'admin' && (
                                        <Link href="/dashboard/admin" className={`flex items-center gap-2 px-3 py-2.5 text-sm font-bold rounded-xl transition-colors ${pathname === '/dashboard/admin'
                                            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                            : 'text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                                            }`}>
                                            Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={logout}
                                        className="w-full cursor-pointer flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login" className="text-sm font-bold text-slate-700 dark:text-slate-200 px-4">Login</Link>
                            <Link href="/register" className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-500/30">Get Started</Link>
                        </div>
                    )}

                    {/* Mobile Toggle */}
                    <button className="md:hidden p-2 rounded-xl bg-white/50 dark:bg-white/10 border border-slate-300 dark:border-white/10" onClick={() => setMenuOpen(!menuOpen)}>
                        <svg className="w-6 h-6 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar */}
            {menuOpen && (
                <div ref={menuRef} className="md:hidden absolute top-full left-0 right-0 m-4 p-5 rounded-3xl bg-white dark:bg-[#0d0f1a] border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col gap-3 animate-in slide-in-from-top-2">
                    {getNavLinks()}
                </div>
            )}
        </nav>
    )
}