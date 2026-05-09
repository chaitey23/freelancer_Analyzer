import { useCounter } from '../hooks/useCounter'

interface BarProps {
    label: string
    val: number
    color: string
    started: boolean
}

export default function Bar({ label, val, color, started }: BarProps) {
    const count = useCounter(val, 1.4, started)

    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">{label}</span>
                <span className="font-bold text-slate-200">{count}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                        width: started ? `${val}%` : '0%',
                        background: color,
                        boxShadow: `0 0 8px ${color}55`,
                    }}
                />
            </div>
        </div>
    )
}