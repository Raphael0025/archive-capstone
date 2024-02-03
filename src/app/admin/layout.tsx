import type { Metadata } from 'next'
import SideBar from '../../components/SideBar'

export const metadata: Metadata = {
  title: 'E-Capstone Portal | Admin',
  description: 'Admin',
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {

  return (
    <>
        <SideBar />
        {children}
    </>
  )
}
