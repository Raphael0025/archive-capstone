'use client'

import { usePathname  } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar(){
    const pathname = usePathname()
    const [customToken, setCustomToken] = useState<string | null>(null);
    const router = useRouter()
    const [drawerOpen, setDrawerOpen] = useState(false);

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
    <nav className='w-full fixed bg-glass md:px-12 px-5 py-3 flex justify-between items-center'>
        <div className='flex justify-start items-center px-3'>
            <Image src="/logo.png" alt="School Logo" width={50} height={50} />
        </div>
        <div className='hidden md:flex items-center w-1/2 justify-between'>
            <Link href='/' className='text-center font-medium p-2 hover:text-red-500'>Home</Link>
            <Link href='/publications' className='text-center p-2 font-medium hover:text-red-500'>Articles</Link>
            <Link href='/announcements' className='text-center p-2 font-medium hover:text-red-500'>Announcements</Link>
        </div>
        <div className='hidden md:flex  justify-end'>
            {typeof window !== 'undefined' && localStorage.getItem('customToken') ? (
            <div className='flex space-x-4 justify-between'>
                <Link href='/profile' className='px-3 py-1 rounded hover:text-slate-50 '>
                <span className='font-sans font-medium'>Go to Profile</span>
                </Link>
                <button
                className='px-3 cursor-pointer py-1 transition ease-in-out duration-300 rounded outline outline-2 outline-red-600 hover:duration-300 hover:text-slate-50 hover:bg-red-600'
                onClick={() => {
                    localStorage.removeItem('customToken');
                    router.push('/');
                }}
                >
                <p className='font-sans font-medium'>Logout</p>
                </button>
            </div>
            ) : (
            <Link href='/login' className='px-3 py-1 transition ease-in-out duration-300 rounded outline outline-2 outline-red-600 hover:duration-300 hover:text-slate-50 hover:bg-red-600'>
                <span className='font-sans font-medium'>Sign In</span>
            </Link>
            )}
        </div>
        <div className='md:hidden flex items-center'>
            <button onClick={() => setDrawerOpen(!drawerOpen)}>
            {drawerOpen ? '' : <FaBars size={24} />}
            </button>
        </div>
        {drawerOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-10 z-10'>
            <div className='fixed top-0 left-0 bg-glass w-full  h-full p-4 shadow-lg z-20'>
                <button
                className='text-right'
                onClick={() => setDrawerOpen(false)}
                >
                <FaTimes size={24} />
                </button>
                <nav className='mt-4 w-3/4 flex bg-black bg-opacity-90 p-3 flex-col space-y-4'>
                <Link href='/' className='text-center font-medium p-2 hover:text-red-500' onClick={() => setDrawerOpen(false)}>Home</Link>
                <Link href='/publications' className='text-center p-2 font-medium hover:text-red-500' onClick={() => setDrawerOpen(false)}>Articles</Link>
                <Link href='/announcements' className='text-center p-2 font-medium hover:text-red-500' onClick={() => setDrawerOpen(false)}>Announcements</Link>
                {typeof window !== 'undefined' && localStorage.getItem('customToken') ? (
                    <div className='flex flex-col space-y-4'>
                    <Link href='/profile' className='px-3 py-1 text-center rounded hover:text-slate-50 ' onClick={() => setDrawerOpen(false)}>
                        <span className='font-sans font-medium text-center'>Go to Profile</span>
                    </Link>
                    <button
                        className='px-3 cursor-pointer py-1 transition ease-in-out duration-300 rounded outline outline-2 outline-red-600 hover:duration-300 hover:text-slate-50 hover:bg-red-600'
                        onClick={() => {
                        localStorage.removeItem('customToken');
                        router.push('/');
                        setDrawerOpen(false);
                        }}
                    >
                        <p className='font-sans font-medium'>Logout</p>
                    </button>
                    </div>
                ) : (
                    <Link href='/login' className='px-3 py-1 transition ease-in-out duration-300 rounded outline outline-2 outline-red-600 hover:duration-300 hover:text-slate-50 hover:bg-red-600' onClick={() => setDrawerOpen(false)}>
                    <span className='font-sans font-medium'>Sign In</span>
                    </Link>
                )}
                </nav>
            </div>
        </div>
        )}
    </nav>
    )
}

