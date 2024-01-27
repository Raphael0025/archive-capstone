import Link from 'next/link'
import Image from 'next/image'

export default function Navbar(){
    return(
        <nav className='w-full fixed px-12 py-3.5 flex justify-items-center items-center'>
            <div className='flex justify-center items-center px-3 w-full'>
                <Image src="/logo.png" alt="School Logo" width={80} height={80} />
            </div>
            <div className='w-full flex justify-between'>
                <Link href='/' className='text-center p-2 hover:text-red-900'>Home</Link>
                <Link href='/articles' className='text-center p-2 hover:text-red-900'>Articles</Link>
                <Link href='/announcements' className='text-center p-2 hover:text-red-900'>Announcements</Link>
            </div>
            <div className='w-full grid justify-items-end'>
                <Link href='/' className='px-3 py-1 transition ease-in-out duration-300 rounded outline outline-2 outline-red-800 hover:duration-300 hover:text-slate-50 hover:bg-red-800'>
                    <p className='font-sans font-medium'>Sign In</p>
                </Link>
            </div>
        </nav>
    )
}