'use client'

export default function AdminLoader() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <div className="absolute inset-0 rounded-full blur-md bg-indigo-500/10" />
            </div>
        </div>
    )
}