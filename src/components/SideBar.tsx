import Link from 'next/link'
import Image from 'next/image'

export default function SideBar(){
    return(
        <nav className='h-full bg-maroon fixed py-8 flex flex-col gap-4 justify-items-center items-center'>
            <div className='flex justify-center items-center px-3 w-full'>
                <Image className='imageWithShadow' priority src="/logo.png" alt="School Logo" width={80} height={80} />
            </div>
            <div className='w-full flex flex-col justify-between'>
                <Link href='/admin/dashboard' className='py-4 px-3 text-center font-medium text-xs hover:bg-red-700'>Dashboard</Link>
                <Link href='/admin/publications' className='py-4 px-3 text-center font-medium text-xs hover:bg-red-700'>Publications</Link>
                <Link href='/admin/content-management' className='py-4 px-3 text-center font-medium text-xs hover:bg-red-700'>Posts</Link>
                <Link href='/admin/student-management' className='py-4 px-3 text-center font-medium text-xs hover:bg-red-700'>Students</Link>
            </div>
        </nav>
    )
}