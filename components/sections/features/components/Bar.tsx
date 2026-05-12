interface BarProps {
    label: string
    val: number
    color: string
}

export default function Bar({ label, val, color }: BarProps) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">{label}</span>
                <span className="font-bold text-slate-200">{val}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                    className="h-full rounded-full"
                    style={{
                        width: `${val}%`,
                        background: color,
                    }}
                />
            </div>
        </div>
    )
}