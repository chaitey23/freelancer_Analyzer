// import type { Metadata } from 'next'
// import { Geist } from 'next/font/google'
// import './globals.css'
// import Navbar from '@/components/Navbar'

// const geist = Geist({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'Freelancer Analyzer',
//   description: 'Find trusted freelancers with smart reputation scoring',
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body className={geist.className}>
//         <Navbar />
//         {children}
//       </body>
//     </html>
//   )
// }
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import AnimatedBackground from '@/components/AnimatedBackground' // আপনার অ্যানিমেশন ফাইলের পাথ ঠিক করে নিন

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
      <body className={`${geist.className} relative min-h-screen`}>

        <div className="fixed inset-0 z-[-1] pointer-events-none">
          <AnimatedBackground />
        </div>

        <Navbar />

        <main>
          {children}
        </main>

      </body>
    </html>
  )
}