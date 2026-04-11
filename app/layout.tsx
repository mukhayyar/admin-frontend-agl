import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AGL App Store Admin',
  description: 'Admin panel for AGL App Store',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
