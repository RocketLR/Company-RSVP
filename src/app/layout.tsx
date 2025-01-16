import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '../components/vNavbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dinner RSVP',
  description: 'Company dinner RSVP form',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="dark" lang="en">
      <body className={`${inter.className} bg-gray-900 text-gray-100`}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}