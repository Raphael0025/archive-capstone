'use client'

import { useRouter } from 'next/navigation';
import Link from 'next/link'
import Image from 'next/image'

export default function SideBar(){
    const router = useRouter();

    const handleLogout = () => {
        // Remove customToken from localStorage
        localStorage.removeItem('customToken');

        // Redirect to the home page
        router.push('/');
    }

    return(
        <nav className='h-full bg-maroon fixed py-8 flex flex-col gap-4 justify-items-center items-center'>
            <div className='flex justify-center items-center px-3 w-full'>
                <Image className='imageWithShadow' priority src="/logo.png" alt="School Logo" width={80} height={80} />
            </div>
            <div className='w-full flex flex-col h-full justify-between'>
                <div className='flex flex-col justify-between'>
                    <Link href='/admin/dashboard' className='py-4 px-3 text-center font-medium text-xs hover:bg-red-700'>Analytics</Link>
                    <Link href='/admin/publications' className='py-4 px-3 text-center font-medium text-xs hover:bg-red-700'>Publications</Link>
                    <Link href='/admin/student-requests' className='py-4 px-3 text-center font-medium text-xs hover:bg-red-700'>Student Requests</Link>
                    <Link href='/admin/content-management' className='py-4 px-3 text-center font-medium text-xs hover:bg-red-700'>Announcements</Link>
                    <Link href='/admin/student-management' className='py-4 px-3 text-center font-medium text-xs hover:bg-red-700'>Registered Users</Link>
                </div>
                
                <button onClick={handleLogout} className='py-4 px-3 text-center font-medium text-xs hover:bg-red-700'>Logout</button>
            </div>
        </nav>
    )
}