// import Link from 'next/link'

// export default function Home() {
//   return (
//     // আমরা এখানে 'bg-transparent' রাখবো যাতে layout.tsx এর ব্যাকগ্রাউন্ড দেখা যায়
//     <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-20 bg-transparent">

//       <div className="text-center max-w-2xl mb-16 relative z-10">
//         {/* Badge */}
//         <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-semibold border border-indigo-200 bg-indigo-50/80 text-indigo-600 backdrop-blur-sm dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
//           ✦ Smart Reputation Scoring
//         </div>

//         {/* Heading */}
//         <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-5 leading-tight text-white">
//           Freelancer
//           <span
//             className="block"
//             style={{
//               background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
//               WebkitBackgroundClip: 'text',
//               WebkitTextFillColor: 'transparent',
//             }}
//           >
//             Analyzer
//           </span>
//         </h1>

//         {/* Subtitle */}
//         <p className="text-lg mb-10 leading-relaxed text-slate-400">
//           Find trusted freelancers with smart reputation scoring —
//           AI-powered insights to make smarter hiring decisions.
//         </p>

//         {/* CTA Buttons */}
//         <div className="flex flex-wrap gap-3 justify-center">
//           <Link
//             href="/register"
//             className="px-7 py-3 rounded-full font-semibold text-white text-sm transition-all duration-200 hover:scale-105 hover:shadow-xl"
//             style={{
//               background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
//               boxShadow: '0 4px 24px rgba(99,102,241,0.35)',
//             }}
//           >
//             Get Started Free →
//           </Link>
//           <Link
//             href="/login"
//             className="px-7 py-3 rounded-full font-semibold text-sm border border-slate-700 text-white transition-all duration-200 hover:scale-105 hover:bg-white/5"
//           >
//             Login
//           </Link>
//         </div>
//       </div>

//       {/* ─── Video Section ─── */}
//       <div className="relative max-w-5xl w-full mx-auto group z-10">
//         {/* ভিডিওর পেছনে গ্লো ইফেক্ট */}
//         <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

//         {/* মেইন ভিডিও কন্টেইনার */}
//         <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-950/40 backdrop-blur-md">
//           <video
//             autoPlay
//             loop
//             muted
//             playsInline
//             className="w-full h-auto shadow-inner"
//           >
//             <source src="/videos/hero_vdo.mp4" type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//         </div>
//       </div>
//     </div>
//   )
// }
import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center overflow-hidden px-4">

      {/* ─── ভিডিও কন্টেইনার (এটি এখন লেখার নিচে থাকবে) ─── */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay loop muted playsInline
          className="w-full h-full object-cover opacity-40" // ওবাসিটি কমানো হয়েছে যাতে লেখা স্পষ্ট হয়
        >
          <source src="/videos/hero_vdo.mp4" type="video/mp4" />
        </video>
        {/* ভিডিওর ওপর হালকা অন্ধকার আস্তরণ (Overlay) */}
        <div className="absolute inset-0 bg-slate-950/60 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"></div>
      </div>

      {/* ─── মেইন কন্টেন্ট (ভিডিওর ওপরে) ─── */}
      <div className="relative z-10 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-semibold border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 backdrop-blur-md">
          ✦ AI-Powered Freelancer Insights
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