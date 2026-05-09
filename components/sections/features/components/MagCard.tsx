import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface MagCardProps {
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
}

export default function MagCard({ children, className, style }: MagCardProps) {
    const ref = useRef<HTMLDivElement>(null)
    const glowRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const onMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            const cx = rect.width / 2
            const cy = rect.height / 2
            gsap.to(el, {
                rotateX: ((y - cy) / cy) * -7,
                rotateY: ((x - cx) / cx) * 7,
                transformPerspective: 1000,
                duration: 0.4,
                ease: 'power2.out',
            })
            if (glowRef.current) {
                gsap.to(glowRef.current, { opacity: 1, left: x, top: y, duration: 0.3 })
            }
        }

        const onLeave = () => {
            gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' })
            if (glowRef.current) gsap.to(glowRef.current, { opacity: 0, duration: 0.4 })
        }

        el.addEventListener('mousemove', onMove)
        el.addEventListener('mouseleave', onLeave)
        return () => {
            el.removeEventListener('mousemove', onMove)
            el.removeEventListener('mouseleave', onLeave)
        }
    }, [])

    return (
        <div ref={ref} className={className} style={{ ...style, transformStyle: 'preserve-3d' }}>
            <div
                ref={glowRef}
                className="pointer-events-none absolute w-40 h-40 rounded-full opacity-0 -translate-x-1/2 -translate-y-1/2 z-0"
                style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
                    filter: 'blur(14px)',
                }}
            />
            {children}
        </div>
    )
}