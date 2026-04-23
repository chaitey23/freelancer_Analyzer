
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import AnimatedBackground from '@/components/AnimatedBackground'
const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Freelancer Analyzer',
  description: 'Find trusted freelancers with smart reputation scoring',
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} relative min-h-screen bg-slate-950`}>
        <div className="fixed inset-0 z-0 pointer-events-none">
          <AnimatedBackground />
        </div>
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />

          <main className="flex-grow">
            {children}
          </main>
        </div>
      </body>
    </html >
  )
}