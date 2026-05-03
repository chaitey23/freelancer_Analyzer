import { LucideIcon } from 'lucide-react'

type ButtonColor = 'indigo' | 'amber' | 'emerald' | 'red'

interface ActionButtonProps {
    icon: LucideIcon
    onClick: () => void
    color: ButtonColor
    title: string
    disabled?: boolean
}

const COLOR_THEMES: Record<ButtonColor, string> = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20',
    amber: 'bg-amber-500/10  text-amber-400  border-amber-500/20  hover:bg-amber-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20',
    red: 'bg-red-500/10    text-red-400    border-red-500/20    hover:bg-red-500/20',
}

export default function ActionButton({
    icon: Icon,
    onClick,
    color,
    title,
    disabled = false,
}: ActionButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-2 rounded-xl border transition-all active:scale-90 cursor-pointer
                        disabled:opacity-40 disabled:cursor-not-allowed
                        ${COLOR_THEMES[color]}`}
        >
            <Icon className="w-3.5 h-3.5" />
        </button>
    )
}