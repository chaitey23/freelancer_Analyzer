'use client'
import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import axiosInstance from '@/lib/axios'
import { Zap, Save, Plus, X, ExternalLink, Camera } from 'lucide-react'
import Image from 'next/image'

export default function FreelancerProfile() {
    const { user } = useAuth('freelancer')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [skillInput, setSkillInput] = useState('')
    const [trustScore, setTrustScore] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [form, setForm] = useState({
        bio: '',
        experience: '',
        portfolio: '',
        skills: [] as string[],
        avatar: ''
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axiosInstance.get('/freelancer/profile')
                if (res.data.profile) {
                    const p = res.data.profile
                    setForm({
                        bio: p.bio || '',
                        experience: p.experience || '',
                        portfolio: p.portfolio || '',
                        skills: p.skills || [],
                        avatar: p.avatar || ''
                    })
                    setTrustScore(p.trustScore || 0)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        if (user) fetchProfile()
    }, [user])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            const data = await res.json()
            setForm(prev => ({ ...prev, avatar: data.url }))
        } catch (error) {
            console.error(error)
        } finally {
            setUploading(false)
        }
    }

    const addSkill = () => {
        const trimmed = skillInput.trim()
        if (trimmed && !form.skills.includes(trimmed)) {
            setForm({ ...form, skills: [...form.skills, trimmed] })
        }
        setSkillInput('')
    }

    const removeSkill = (skill: string) => {
        setForm({ ...form, skills: form.skills.filter(s => s !== skill) })
    }

    const handleSave = async () => {
        setSaving(true)
        setSuccess(false)
        try {
            await axiosInstance.put('/freelancer/profile', form)
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (error) {
            console.error(error)
        } finally {
            setSaving(false)
        }
    }

    if (!user || loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    )

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">

                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                        My <span className="text-indigo-600 dark:text-indigo-400">Profile</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Keep your profile updated so clients can find you easily.
                    </p>
                </div>

                {/* Profile Card - Avatar + Trust Score */}
                <div className="flex items-center justify-between bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl px-6 py-5 mb-6 backdrop-blur-md">
                    <div className="flex items-center gap-4">

                        {/* Avatar with upload */}
                        <div className="relative group cursor-pointer w-16 h-16" onClick={() => fileInputRef.current?.click()}>
                            {form.avatar ? (
                                <Image
                                    src={form.avatar}
                                    alt="avatar"
                                    width={64}
                                    height={64}
                                    className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                                />
                            ) : (
                                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                            )}

                            {/* একদম মাঝখানে — সবসময় দেখা যাবে */}
                            <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                                {uploading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Camera className="w-5 h-5 text-white drop-shadow-md" />
                                )}
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </div>

                        <div>
                            <p className="font-black text-slate-800 dark:text-white text-lg leading-tight">{user.name}</p>
                            <p className="text-slate-400 text-sm">{user.email}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Click photo to change</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="flex items-center gap-1 justify-end text-emerald-500 dark:text-emerald-400 font-black text-2xl">
                            <Zap className="w-5 h-5 fill-emerald-500 dark:fill-emerald-400" />
                            {trustScore}
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Trust Score</p>
                    </div>
                </div>

                {/* Main Form Card */}
                <div className="bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl backdrop-blur-md overflow-hidden">
                    <div className="divide-y divide-slate-100 dark:divide-white/5">

                        {/* Bio */}
                        <div className="px-6 py-5">
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                                Bio
                            </label>
                            <textarea
                                rows={4}
                                placeholder="e.g. I'm a Full Stack Developer with 3+ years of experience..."
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none text-sm leading-relaxed transition-all"
                                value={form.bio}
                                onChange={e => setForm({ ...form, bio: e.target.value })}
                            />
                        </div>

                        {/* Experience */}
                        <div className="px-6 py-5">
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                                Experience
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. 3 years of MERN Stack development"
                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-sm transition-all"
                                value={form.experience}
                                onChange={e => setForm({ ...form, experience: e.target.value })}
                            />
                        </div>

                        {/* Portfolio */}
                        <div className="px-6 py-5">
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                                Portfolio Link
                            </label>
                            <div className="relative">
                                <input
                                    type="url"
                                    placeholder="https://yourportfolio.com"
                                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 pr-10 text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-sm transition-all"
                                    value={form.portfolio}
                                    onChange={e => setForm({ ...form, portfolio: e.target.value })}
                                />
                                <ExternalLink className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 dark:text-slate-600" />
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="px-6 py-5">
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                                Skills
                            </label>
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    placeholder="Type a skill and press Enter..."
                                    className="flex-grow bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-sm transition-all"
                                    value={skillInput}
                                    onChange={e => setSkillInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && addSkill()}
                                />
                                <button
                                    onClick={addSkill}
                                    className="px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition-all flex items-center gap-1.5 shrink-0"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
                                {form.skills.length === 0 ? (
                                    <p className="text-slate-300 dark:text-slate-600 text-sm italic">No skills added yet...</p>
                                ) : (
                                    form.skills.map(skill => (
                                        <span key={skill} className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 rounded-xl text-sm font-bold">
                                            {skill}
                                            <button
                                                onClick={() => removeSkill(skill)}
                                                className="w-4 h-4 flex items-center justify-center rounded-md hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="px-6 py-5 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-indigo-500/20"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? 'Saving...' : 'Save Profile'}
                        </button>

                        {success && (
                            <div className="mt-3 text-center py-2.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                                ✅ Profile saved successfully!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}