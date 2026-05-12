'use client'

const platforms = [
    {
        name: 'Upwork',
        color: '#14a800',
        svg: (
            <svg viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                <path d="M60.1 5.1c-3.6 0-6.4 2.3-7.6 5.7L50 4H46v20.8l4.4-2.6V16c0 3.6 2.8 6.3 6.4 6.3h.3c3.9-.1 7-3.2 7-7.1 0-3.9-3.1-7.1-7-7.1h-.1zm-.4 10.6c-1.9 0-3.4-1.5-3.4-3.4s1.5-3.4 3.4-3.4 3.4 1.5 3.4 3.4-1.5 3.4-3.4 3.4zM34.4 5.1c-3.9 0-7.1 3.2-7.1 7.1v7.6l4.4-2.6V12c0-1.9 1.5-3.4 3.4-3.4 1.9 0 3.4 1.5 3.4 3.4v5.2l4.4 2.6v-7.6c0-4-3.2-7.1-7.1-7.1h-.4zM8 4H4v10.8c0 3.6 2.8 6.4 6.4 6.4h.3c3.9 0 7-3.2 7-7.1V4h-4.4v10.1c0 1.9-1.5 3.4-3.4 3.4-1.9 0-3.4-1.5-3.4-3.4V4H8zm63.2 1.1l-3.2 8.2-3.2-8.2H60l5.2 12.6-3 7.4h4.8L80 5.1h-8.8z" fill="#14a800" />
            </svg>
        ),
    },
    {
        name: 'Fiverr',
        color: '#1dbf73',
        svg: (
            <svg viewBox="0 0 80 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                <path d="M74.4 10.4h-3.9V7.5c0-1.3.9-1.6 1.5-1.6h2.4V1.2l-3.3-.1c-3.7 0-4.5 2.7-4.5 4.5v4.8h-2.4v4.7h2.4V24h4.8V15.1h3.2l.4-4.7h-.6zM55.3 0c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3zm2.4 10.4h-4.8V24h4.8V10.4zm-9.2 0H44v1.4c-1.1-1.1-2.7-1.8-4.5-1.8-3.9 0-7.1 3.3-7.1 7.4s3.2 7.4 7.1 7.4c1.7 0 3.3-.7 4.5-1.8V24h4.5V10.4zM40 20.1c-1.5 0-2.7-1.2-2.7-2.7s1.2-2.7 2.7-2.7 2.7 1.2 2.7 2.7-1.2 2.7-2.7 2.7zM24 10.4h-4.3l-3.5 9-3.5-9H8L14.1 24h4.7L24 10.4zM4.8 10.4H0V24h4.8V10.4zM2.4 0C1.1 0 0 1.1 0 2.4s1.1 2.4 2.4 2.4 2.4-1.1 2.4-2.4S3.7 0 2.4 0z" fill="#1dbf73" />
            </svg>
        ),
    },
    {
        name: 'Toptal',
        color: '#204ecf',
        svg: (
            <svg viewBox="0 0 90 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                <path d="M17.6 0L11 6.6l3.3 3.3-6.6 6.6-3.3-3.3L0 16.8l6.6 6.6 3.3-3.3 6.6 6.6 3.3-3.3-6.6-6.6 6.6-6.6 3.3 3.3L27 9.9 17.6 0z" fill="#204ecf" />
                <path d="M35.3 5.5H24.8v4.4h3.8V24h4.4V9.9h3.8l-1.5-4.4zM46.6 5.1c-5.2 0-9.4 4.2-9.4 9.4s4.2 9.4 9.4 9.4 9.4-4.2 9.4-9.4-4.2-9.4-9.4-9.4zm0 14.4c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zM70 10.1V5.5H58.2V24h4.4v-5.8H69V14h-6.4v-3.9H70zM75.5 5.5h-4.4V24h11.5v-4.4h-7.1V5.5z" fill="#204ecf" />
            </svg>
        ),
    },
    {
        name: 'Freelancer',
        color: '#0e6ebc',
        svg: (
            <svg viewBox="0 0 110 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                <path d="M18.8 0L12.5 12.5 6.3 0H0l12.5 25 12.5-25h-6.2zM25 0v25h6V0h-6zM40 0v25h6V14h8V8h-8V6h10V0H40zM62 0v25h6V14h3l5 11h7L77 12.8C79.4 11.5 81 9 81 6c0-3.3-2.7-6-6-6H62zm6 6h6c.6 0 1 .4 1 1s-.4 1-1 1h-6V6zM90 0v25h18v-6h-12v-3h10V10H96V6h12V0H90z" fill="#0e6ebc" />
            </svg>
        ),
    },
    {
        name: 'PeoplePerHour',
        color: '#e8630a',
        svg: (
            <svg viewBox="0 0 130 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                <circle cx="13" cy="13" r="13" fill="#e8630a" />
                <text x="13" y="18" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">P</text>
                <path d="M33 5h6v3.5c1-2.2 3-3.5 5.5-3.5 4 0 7 3.1 7 7.5S48.5 20 44.5 20c-2.5 0-4.5-1.3-5.5-3.5V26h-6V5zm10 5c-2.2 0-4 1.7-4 4s1.8 4 4 4 4-1.7 4-4-1.8-4-4-4zM55 5h6v3c.8-2 2.5-3 5-3h1v5.5h-1.5c-2.8 0-4.5 1.5-4.5 4.5V20h-6V5zM70 12.5c0-4.7 3.8-8 9-8s9 3.3 9 8-3.8 8-9 8-9-3.3-9-8zm12 0c0-2.2-1.3-3.5-3-3.5s-3 1.3-3 3.5 1.3 3.5 3 3.5 3-1.3 3-3.5z" fill="#e8630a" />
            </svg>
        ),
    },
    {
        name: 'Guru',
        color: '#ff6600',
        svg: (
            <svg viewBox="0 0 60 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                <path d="M30 1C14.5 1 2 7.7 2 16s12.5 15 28 15 28-6.7 28-15S45.5 1 30 1zm0 23c-11.6 0-21-3.6-21-8s9.4-8 21-8 21 3.6 21 8-9.4 8-21 8z" fill="#ff6600" />
                <circle cx="30" cy="16" r="4" fill="#ff6600" />
            </svg>
        ),
    },
    {
        name: '99designs',
        color: '#7251f4',
        svg: (
            <svg viewBox="0 0 90 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                <circle cx="8" cy="13" r="8" fill="#7251f4" />
                <circle cx="24" cy="13" r="8" fill="#7251f4" opacity="0.6" />
                <path d="M38 4h6v3.5c1-2.2 3-3.5 5.5-3.5 4 0 7 3 7 7.5S53.5 19 49.5 19c-2.5 0-4.5-1.3-5.5-3.5V26h-6V4zm10 5c-2.2 0-4 1.7-4 4s1.8 4 4 4 4-1.7 4-4-1.8-4-4-4zM60 4h6v16h-6V4zm3-5a3 3 0 110 6 3 3 0 010-6z" fill="#7251f4" />
            </svg>
        ),
    },
    {
        name: 'LinkedIn',
        color: '#0077b5',
        svg: (
            <svg viewBox="0 0 90 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                <rect width="12" height="12" rx="2" fill="#0077b5" />
                <rect y="14" width="12" height="12" rx="2" fill="#0077b5" opacity="0.5" />
                <path d="M18 4h5v3c1-2 3-3.5 6-3.5 5 0 8 3 8 8.5V24h-5.5v-10c0-3-1.5-4.5-4-4.5s-4 1.5-4 4.5V24H18V4z" fill="#0077b5" />
                <text x="42" y="18" fill="#0077b5" fontSize="13" fontWeight="700">Jobs</text>
            </svg>
        ),
    },
]

// Duplicate for seamless loop
const marqueeItems = [...platforms, ...platforms]

export default function TrustedBy() {
    return (
        <section className="relative w-full py-14 mt-7 overflow-hidden">

            {/* Subtle top divider */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-14 bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent" />

            {/* Ambient glow */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                    background: 'radial-gradient(ellipse 60% 50% at 50% 50%, #6366f1, transparent)',
                }}
            />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">

                {/* Label */}
                <div className="mb-10 flex items-center justify-center gap-4">
                    <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-white/10" />
                    <p className="text-xl font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Freelancers analyzed from
                    </p>
                    <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-white/10" />
                </div>

                {/* Marquee wrapper */}
                <div className="relative">

                    {/* Left fade */}
                    <div
                        className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-24"
                        style={{
                            background: 'linear-gradient(to right, rgb(2 6 23), transparent)',
                        }}
                    />
                    {/* Right fade */}
                    <div
                        className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-24"
                        style={{
                            background: 'linear-gradient(to left, rgb(2 6 23), transparent)',
                        }}
                    />

                    {/* Scrolling track */}
                    <div className="overflow-hidden">
                        <div className="flex gap-4 trusted-marquee">
                            {marqueeItems.map((platform, i) => (
                                <div
                                    key={`${platform.name}-${i}`}
                                    className="group flex-shrink-0 flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-6 py-3.5 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.06]"
                                    style={{
                                        boxShadow: '0 0 0 0 transparent',
                                    }}
                                >
                                    {/* Colored dot */}
                                    <div
                                        className="h-2 w-2 rounded-full flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
                                        style={{ backgroundColor: platform.color }}
                                    />
                                    {/* Logo SVG */}
                                    <div className="opacity-50 group-hover:opacity-90 transition-opacity duration-300 flex items-center">
                                        {platform.svg}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom count hint */}
                <div className="mt-8 text-center">
                    <span className="text-[11px] text-slate-600 tracking-wide">
                        + 12 more platforms supported
                    </span>
                </div>
            </div>

            {/* CSS for marquee animation */}
            <style jsx>{`
                .trusted-marquee {
                    animation: marquee 30s linear infinite;
                    width: max-content;
                }

                .trusted-marquee:hover {
                    animation-play-state: paused;
                }

                @keyframes marquee {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-50%); }
                }
            `}</style>
        </section>
    )
}