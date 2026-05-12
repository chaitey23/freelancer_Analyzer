interface ScoreRingProps {
    value: number
    color: string
}

export default function ScoreRing({ value, color }: ScoreRingProps) {
    const r = 36
    const circ = 2 * Math.PI * r
    const dash = (value / 100) * circ

    return (
        <div className="relative flex items-center justify-center w-24 h-24 flex-shrink-0">
            <svg width="96" height="96" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                <circle
                    cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="6"
                    strokeDasharray={`${dash} ${circ}`}
                />
            </svg>
            <span className="absolute text-xl font-black text-white">{value}</span>
        </div>
    )
}