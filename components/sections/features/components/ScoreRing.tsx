import { useCounter } from '../hooks/useCounter'

interface ScoreRingProps {
    value: number
    color: string
    started: boolean
}

export default function ScoreRing({ value, color, started }: ScoreRingProps) {
    const count = useCounter(value, 1.8, started)
    const r = 36
    const circ = 2 * Math.PI * r
    const dash = started ? (count / 100) * circ : 0

    return (
        <div className="relative flex items-center justify-center w-24 h-24 flex-shrink-0">
            <svg width="96" height="96" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                <circle
                    cx="48" cy="48" r={r} fill="none" stroke={color} strokeWidth="6"
                    strokeDasharray={`${dash} ${circ}`}
                    style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dasharray 0.05s linear' }}
                />
            </svg>
            <span className="absolute text-xl font-black text-white">{count}</span>
        </div>
    )
}