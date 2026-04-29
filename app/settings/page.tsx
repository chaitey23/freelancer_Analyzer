/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import axiosInstance from '@/lib/axios'
import { Camera, Save, Lock } from 'lucide-react'
import Image from 'next/image'

const EyeIcon = ({ show, toggle }: { show: boolean, toggle: () => void }) => (
    <button type="button" onClick={toggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
        {show ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
        ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
        )}
    </button>
)

export default function SettingsPage() {
    const { user } = useAuth()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)

    const [profileForm, setProfileForm] = useState({
        name: '',
        email: '',
        avatar: ''
    })
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [profileLoading, setProfileLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [profileMsg, setProfileMsg] = useState({ type: '', text: '' })
    const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' })

    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    useEffect(() => {
        if (!user) return

        const loadProfile = async () => {
            if (user.role === 'freelancer') {
                try {
                    const res = await axiosInstance.get('/freelancer/profile')
                    setProfileForm({
                        name: user.name || '',
                        email: user.email || '',
                        avatar: res.data.profile?.avatar || ''
                    })
                } catch {
                    setProfileForm({
                        name: user.name || '',
                        email: user.email || '',
                        avatar: ''
                    })
                }
            } else {
                setProfileForm({
                    name: user.name || '',
                    email: user.email || '',
                    avatar: user.avatar || ''
                })
            }
        }

        loadProfile()
    }, [user])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            const data = await res.json()
            setProfileForm(prev => ({ ...prev, avatar: data.url }))
        } catch {
            console.error('Upload failed')
        } finally {
            setUploading(false)
        }
    }

    const handleProfileSave = async () => {
        setProfileLoading(true)
        setProfileMsg({ type: '', text: '' })
        try {
            const res = await axiosInstance.put('/user/update', profileForm)
            const updatedUser = res.data.user
            const stored = JSON.parse(localStorage.getItem('user') || '{}')
            const merged = { ...stored, ...updatedUser }
            localStorage.setItem('user', JSON.stringify(merged))
            window.dispatchEvent(new Event('storage'))
            setProfileMsg({ type: 'success', text: 'Profile updated successfully!' })
        } catch (err: any) {
            setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Something went wrong' })
        } finally {
            setProfileLoading(false)
        }
    }

    const handlePasswordSave = async () => {
        setPasswordMsg({ type: '', text: '' })
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordMsg({ type: 'error', text: 'New passwords do not match' })
            return
        }
        setPasswordLoading(true)
        try {
            await axiosInstance.put('/user/password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            })
            setPasswordMsg({ type: 'success', text: 'Password changed successfully!' })
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        } catch (err: any) {
            setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Something went wrong' })
        } finally {
            setPasswordLoading(false)
        }
    }

    const inputClass = "w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 text-slate-800 dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 text-sm transition-all"

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
        </div>
    )

    return (
        <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">

                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                        Account <span className="text-indigo-600 dark:text-indigo-400">Settings</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Manage your profile and security settings.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    <div className="bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl backdrop-blur-md overflow-hidden h-full flex flex-col">

                        {/* Avatar */}
                        <div className="px-6 py-5 flex items-center gap-5 border-b border-slate-100 dark:border-white/5">
                            <div className="relative cursor-pointer w-24 h-24 shrink-0" onClick={() => fileInputRef.current?.click()}>
                                {profileForm.avatar ? (
                                    <Image src={profileForm.avatar} alt="avatar" width={96} height={96} className="w-24 h-24 rounded-2xl object-cover shadow-lg" />
                                ) : (
                                    <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-lg">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                                    {uploading
                                        ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        : <Camera className="w-5 h-5 text-white" />
                                    }
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </div>
                            <div>
                                <p className="font-black text-slate-800 dark:text-white text-lg leading-tight">{user.name}</p>
                                <p className="text-slate-400 text-sm">{user.email}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">Click photo to change</p>
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-white/5">
                            <div className="px-6 py-5">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Full Name</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={profileForm.name}
                                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                                />
                            </div>
                            <div className="px-6 py-5">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Email Address</label>
                                <input
                                    type="email"
                                    className={inputClass}
                                    value={profileForm.email}
                                    onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="px-6 py-5 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 mt-auto">
                            <button
                                onClick={handleProfileSave}
                                disabled={profileLoading}
                                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-indigo-500/20 cursor-pointer"
                            >
                                <Save className="w-4 h-4" />
                                {profileLoading ? 'Saving...' : 'Save Profile'}
                            </button>
                            {profileMsg.text && (
                                <div className={`mt-3 text-center py-2.5 rounded-2xl font-bold text-sm border ${profileMsg.type === 'success'
                                    ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400'
                                    }`}>
                                    {profileMsg.type === 'success' ? '✅' : '❌'} {profileMsg.text}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl backdrop-blur-md overflow-hidden h-full flex flex-col">
                        <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center">
                                <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="font-black text-slate-800 dark:text-white text-sm">Change Password</p>
                                <p className="text-slate-400 text-xs">Make sure it's at least 6 characters</p>
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-white/5">
                            <div className="px-6 py-5">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Current Password</label>
                                <div className="relative">
                                    <input type={showCurrent ? 'text' : 'password'} className={inputClass + ' pr-12'} placeholder="••••••••" value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} />
                                    <EyeIcon show={showCurrent} toggle={() => setShowCurrent(!showCurrent)} />
                                </div>
                            </div>
                            <div className="px-6 py-5">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">New Password</label>
                                <div className="relative">
                                    <input type={showNew ? 'text' : 'password'} className={inputClass + ' pr-12'} placeholder="••••••••" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
                                    <EyeIcon show={showNew} toggle={() => setShowNew(!showNew)} />
                                </div>
                            </div>
                            <div className="px-6 py-5">
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Confirm New Password</label>
                                <div className="relative">
                                    <input type={showConfirm ? 'text' : 'password'} className={inputClass + ' pr-12'} placeholder="••••••••" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} />
                                    <EyeIcon show={showConfirm} toggle={() => setShowConfirm(!showConfirm)} />
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-5 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 mt-auto">
                            <button
                                onClick={handlePasswordSave}
                                disabled={passwordLoading}
                                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-indigo-500/20 cursor-pointer"
                            >
                                <Lock className="w-4 h-4" />
                                {passwordLoading ? 'Updating...' : 'Update Password'}
                            </button>
                            {passwordMsg.text && (
                                <div className={`mt-3 text-center py-2.5 rounded-2xl font-bold text-sm border ${passwordMsg.type === 'success'
                                    ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400'
                                    }`}>
                                    {passwordMsg.type === 'success' ? '✅' : '❌'} {passwordMsg.text}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}