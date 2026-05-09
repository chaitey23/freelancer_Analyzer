import FeaturesSection from '@/components/sections/features/FeaturesSection'
import HowItWorksSection from '@/components/sections/HowItWorksSection'
import StatsSection from '@/components/sections/StatsSection'

import Link from 'next/link'
export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">

        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay loop muted playsInline
            className="w-full h-full object-cover opacity-40"
          >
            <source src="/videos/hero_vdo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-slate-950/60 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center w-full max-w-4xl mx-auto py-24 sm:py-32">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-5 sm:mb-6 px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 backdrop-blur-md">
            ✦ AI-Powered Freelancer Insights
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-5 sm:mb-6 text-white leading-[1.1]">
            Analyze Freelancers{' '}
            <br className="hidden sm:block" />
            <span
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              With Precision.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 sm:mb-10 text-slate-300 max-w-xs sm:max-w-md md:max-w-xl mx-auto leading-relaxed px-2 sm:px-0">
            Stop guessing. Use our smart reputation scoring to find the
            perfect talent for your next big project.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0">
            <Link
              href="/register"
              className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base text-white transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            >
              Start Analyzing Free
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold text-sm sm:text-base text-white border border-white/20 backdrop-blur-md hover:bg-white/10 transition-all"
            >
              View Demo
            </Link>
          </div>
        </div>
      </div>

      <StatsSection />
      <HowItWorksSection />
      <FeaturesSection />
    </>
  )
}