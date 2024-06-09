
import type { Metadata } from 'next'
import './globals.css'
import Navbar from '../components/Navbar'
import {ArticleProvider} from '@/context/ArticleContext'

export const metadata: Metadata = {
  title: 'CDSCDB CAPSTONE PORTAL',
  description: 'Online portal to view and download related capstone articles to your study.',
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ArticleProvider>
          <Navbar />
          {children}
        </ArticleProvider>
      </body>
    </html>
  )
}
