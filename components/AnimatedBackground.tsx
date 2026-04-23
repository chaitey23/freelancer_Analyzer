'use client'
import { useEffect, useRef, useState } from 'react'

// ─── Types ───────────────────────────────────────────────
interface Particle {
    x: number; y: number; vx: number; vy: number;
    radius: number; opacity: number; pulse: number; pulseSpeed: number;
}

// ─── Hook: Animated Canvas ────────────────────────────────
function useParticleCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>, dark: boolean) {
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')!
        let animId: number
        let particles: Particle[] = []
        const PARTICLE_COUNT = 90
        const MAX_DIST = 140

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener('resize', resize)

        const spawn = (): Particle => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 2 + 1,
            opacity: Math.random() * 0.6 + 0.2,
            pulse: 0,
            pulseSpeed: Math.random() * 0.02 + 0.01,
        })

        particles = Array.from({ length: PARTICLE_COUNT }, spawn)

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            const bg = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, canvas.width * 0.8
            )
            if (dark) {
                bg.addColorStop(0, '#0d0f1a'); bg.addColorStop(0.5, '#080b16'); bg.addColorStop(1, '#04060f');
            } else {
                bg.addColorStop(0, '#ffffff'); bg.addColorStop(0.5, '#f8faff'); bg.addColorStop(1, '#f0f4ff');
            }
            ctx.fillStyle = bg
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            const glowColor = dark
                ? ['rgba(99,102,241,0.06)', 'rgba(139,92,246,0.04)', 'rgba(59,130,246,0.05)']
                : ['rgba(99,102,241,0.12)', 'rgba(236,72,153,0.07)', 'rgba(6,182,212,0.08)']

            const blobs = [
                { x: canvas.width * 0.15, y: canvas.height * 0.25, r: 380, c: glowColor[0] },
                { x: canvas.width * 0.85, y: canvas.height * 0.5, r: 300, c: glowColor[1] },
                { x: canvas.width * 0.5, y: canvas.height * 0.85, r: 260, c: glowColor[2] },
            ]
            blobs.forEach(b => {
                const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
                g.addColorStop(0, b.c); g.addColorStop(1, 'transparent')
                ctx.fillStyle = g
                ctx.fillRect(0, 0, canvas.width, canvas.height)
            })

            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy; p.pulse += p.pulseSpeed
                const pulsedOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse))
                if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0
                if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0

                const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 5)
                const dotColor = dark ? `rgba(147,165,255,${pulsedOpacity})` : `rgba(99,102,241,${pulsedOpacity * 0.5})`
                glow.addColorStop(0, dotColor); glow.addColorStop(1, 'transparent')
                ctx.fillStyle = glow
                ctx.beginPath(); ctx.arc(p.x, p.y, p.radius * 5, 0, Math.PI * 2); ctx.fill()

                ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
                ctx.fillStyle = dark ? `rgba(180,190,255,${pulsedOpacity})` : `rgba(79,70,229,${pulsedOpacity * 0.7})`
                ctx.fill()
            })

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < MAX_DIST) {
                        const alpha = (1 - dist / MAX_DIST) * (dark ? 0.18 : 0.2)
                        ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y)
                        ctx.strokeStyle = dark ? `rgba(130,140,255,${alpha})` : `rgba(99,102,241,${alpha})`
                        ctx.lineWidth = dark ? 0.8 : 0.6; ctx.stroke()
                    }
                }
            }
            animId = requestAnimationFrame(draw)
        }
        draw()
        return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
    }, [dark, canvasRef])
}

// ─── Main Background Component (Only Visuals) ─────────────
export default function AnimatedBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [dark, setDark] = useState(true)

    useParticleCanvas(canvasRef, dark)

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
            {/* Animated Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }} />
            {/* Grain overlay for texture */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
                }}
            />


        </div>
    )
}
