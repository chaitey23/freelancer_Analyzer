import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center overflow-hidden px-4">

      <div className="absolute inset-0 z-0">
        <video
          autoPlay loop muted playsInline
          className="w-full h-full object-cover opacity-40"
        >
          <source src="/videos/hero_vdo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-slate-950/60 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>
      </div>

      <div className="relative z-10 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-semibold border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 backdrop-blur-md">
          AI-Powered Freelancer Insights
        </div>

        <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-6 text-white leading-[1.1]">
          Analyze Freelancers <br />
          <span style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>With Precision.</span>
        </h1>

        <p className="text-lg md:text-xl mb-10 text-slate-300 max-w-xl mx-auto leading-relaxed">
          Stop guessing. Use our smart reputation scoring to find the
          perfect talent for your next big project.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/register" className="px-8 py-4 rounded-full font-bold text-white transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            Start Analyzing Free
          </Link>
          <Link href="/login" className="px-8 py-4 rounded-full font-bold text-white border border-white/20 backdrop-blur-md hover:bg-white/10 transition-all">
            View Demo
          </Link>
        </div>
      </div>
    </div>
  )
}