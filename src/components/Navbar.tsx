'use client'

import { usePathname  } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react';

export default function Navbar(){
    const pathname = usePathname()
    const [customToken, setCustomToken] = useState<string | null>(null);
    const router = useRouter()

    useEffect(() => {
        // Listen for changes in customToken
        const handleStorageChange = () => {
          // Trigger a refresh when customToken exists
          if (localStorage.getItem('customToken')) {
            window.location.reload();
          }
        };
    
        // Attach event listener for storage changes
        window.addEventListener('storage', handleStorageChange);
    
        // Cleanup event listener on component unmount
        return () => {
          window.removeEventListener('storage', handleStorageChange);
        };
      }, []);

    const shouldHideNavbar = pathname?.startsWith('/admin') || pathname?.startsWith('/login') || pathname?.startsWith('/registration');

    if (shouldHideNavbar) {
        return null; // Don't render anything if conditions are met
    }

    return(
        <nav className='w-full fixed bg-glass px-12 py-3 flex justify-items-center items-center'>
            <div className='flex justify-start items-center px-3 w-full'>
                <Image src="/logo.png" alt="School Logo" width={50} height={50} />
            </div>
            <div className='w-full flex justify-between'>
                <Link href='/' className='text-center font-medium p-2 hover:text-red-500'>Home</Link>
                <Link href='/publications' className='text-center p-2 font-medium hover:text-red-500'>Articles</Link>
                <Link href='/announcements' className='text-center p-2 font-medium hover:text-red-500'>Announcements</Link>
            </div>
            <div className='w-full grid justify-items-end'>
            {typeof window !== 'undefined' && localStorage.getItem('customToken') ? (
                // Render user profile if customToken exists
                <div className='flex space-x-4 justify-between'>
                    <Link href='/profile' className='px-3 py-1 rounded hover:text-slate-50 '>
                        <span className='font-sans font-medium'>Go to Profile</span>
                    </Link>
                    <button className='px-3 cursor-pointer py-1 transition ease-in-out duration-300 rounded outline outline-2 outline-red-600 hover:duration-300 hover:text-slate-50 hover:bg-red-600' onClick={() => {localStorage.removeItem('customToken');
                    router.push('/');}}>
                        <p className='font-sans font-medium'>Logout</p>
                    </button>
                </div>
                ) : (
                // Render Sign In button if customToken does not exist
                <Link href='/login' className='px-3 py-1 transition ease-in-out duration-300 rounded outline outline-2 outline-red-600 hover:duration-300 hover:text-slate-50 hover:bg-red-600'>
                    <span className='font-sans font-medium'>Sign In</span>
                </Link>
            )}
            </div>
        </nav>
    )
}

