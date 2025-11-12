import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Offline - Minimoda',
  description: 'You are currently offline. Some features may not be available.',
}

export default function OfflineLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
