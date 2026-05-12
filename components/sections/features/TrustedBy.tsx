'use client'
const platforms = [
    { name: 'Upwork', color: '#14a800', logoUrl: 'https://cdn.simpleicons.org/upwork/14a800' },
    { name: 'Fiverr', color: '#1dbf73', logoUrl: 'https://cdn.simpleicons.org/fiverr/1dbf73' },
    { name: 'Toptal', color: '#204ecf', logoUrl: 'https://cdn.simpleicons.org/toptal/204ecf' },
    { name: 'LinkedIn', color: '#0077b5', logoUrl: '/logos/linkedin.png' },
    { name: 'Freelancer', color: '#0e6ebc', logoUrl: 'https://cdn.simpleicons.org/freelancer/0e6ebc' },
    { name: '99designs', color: '#7251f4', logoUrl: 'https://cdn.simpleicons.org/99designs/7251f4' },
]

const marqueeItems = [...platforms, ...platforms]

export default function TrustedBy() {
    return (
        <section className="relative w-full py-20 overflow-hidden">

            {/* Ambient glow */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{ background: 'radial-gradient(ellipse 55% 60% at 50% 40%, rgba(99,102,241,0.09), transparent 70%)' }}
            />

            {/* Grid pattern */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                    maskImage: 'radial-gradient(ellipse 70% 80% at 50% 50%, black 30%, transparent 80%)',
                }}
            />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">

                {/* Label row */}
                <div className="mb-11 flex items-center justify-center gap-5">
                    <span
                        className="h-px flex-1 max-w-[140px]"
                        style={{ background: 'linear-gradient(to right, transparent, rgba(99,102,241,0.25), transparent)' }}
                    />
                    <div className="flex items-center gap-2.5">
                        <span className="inline-block w-1 h-1 rounded-full bg-indigo-500/50" />
                        <p className="font-mono text-[19px] font-medium tracking-[0.22em] uppercase text-slate-500/55 whitespace-nowrap">
                            Freelancers analyzed from
                        </p>
                        <span className="inline-block w-1 h-1 rounded-full bg-indigo-500/50" />
                    </div>
                    <span
                        className="h-px flex-1 max-w-[140px]"
                        style={{ background: 'linear-gradient(to left, transparent, rgba(99,102,241,0.25), transparent)' }}
                    />
                </div>

                {/* Marquee wrapper */}
                <div className="relative">

                    {/* Left fade */}
                    <div
                        className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-28"
                        style={{ background: 'linear-gradient(to right, rgb(2 6 23), transparent)' }}
                    />
                    {/* Right fade */}
                    <div
                        className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-28"
                        style={{ background: 'linear-gradient(to left, rgb(2 6 23), transparent)' }}
                    />

                    {/* Scrolling track */}
                    <div className="overflow-hidden py-3">
                        <div className="flex gap-3 w-max [animation:marquee_32s_linear_infinite] hover:[animation-play-state:paused]">
                            {marqueeItems.map((p, i) => (
                                <div
                                    key={`${p.name}-${i}`}
                                    className="group relative flex-shrink-0 flex items-center gap-2.5 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-2.5 backdrop-blur-md transition-all duration-300 hover:border-white/[0.13] hover:bg-white/[0.055] hover:-translate-y-0.5 overflow-hidden cursor-default"
                                >
                                    {/* Per-brand glow blob */}
                                    <span
                                        className="pointer-events-none absolute -top-4 -left-4 w-14 h-14 rounded-full blur-xl opacity-15 group-hover:opacity-25 transition-opacity duration-300"
                                        style={{ backgroundColor: p.color }}
                                    />

                                    {/* Logo box */}
                                    <div className="relative flex items-center justify-center w-8 h-8 rounded-lg border border-white/[0.07] bg-white/[0.05] flex-shrink-0 transition-colors duration-300 group-hover:bg-white/[0.09]">
                                        <img
                                            src={p.logoUrl || `https://cdn.simpleicons.org/${p.domain?.split('.')[0]}/${p.color.replace('#', '')}`}
                                            alt={p.name}
                                            width={18}
                                            height={18}
                                            className="w-[18px] h-[18px] object-contain opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none'
                                            }}
                                        />
                                    </div>

                                    {/* Platform name */}
                                    <span className="text-[13.5px] font-medium text-slate-400/60 group-hover:text-slate-200/95 transition-colors duration-300 whitespace-nowrap tracking-[0.01em]">
                                        {p.name}
                                    </span>

                                    {/* Color dot */}
                                    <span
                                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 opacity-40 group-hover:opacity-90 transition-all duration-300"
                                        style={{ backgroundColor: p.color }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Only keyframe stays in style — can't do this in Tailwind */}
            <style>{`
                @keyframes marquee {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-50%); }
                }
            `}</style>
        </section>
    )
}