import { requestType } from '../types/document'
import { Icon } from '@iconify/react'
import { approveStudentInquiry } from '../lib/controller'
import Link from 'next/link'

interface IProps{
    inquiry: requestType;
}

export default function TableRow4 ({inquiry } : IProps) {

    return(
        <div className='hover:bg-gray-500 odd:bg-neutral-700 flex justify-between even:bg-neutral-800'>
            <div className='w-full p-2'>
                {inquiry.title}
            </div>
            <div className='w-full text-center p-2'>
            {inquiry.status === 'pending' ? (
                <p className='text-yellow-500 font-medium'>Request Pending...</p>
            ) : inquiry.status === 'cancelled' ? (
                <p className=' font-medium'>Request has been Cancelled</p>
            ) : (
                <p className=' font-medium'>Ready to download</p>
            )}
            </div>
            <div className='w-full flex justify-center space-x-4  p-2'>
            {inquiry.status === 'pending' ? (
                <p className='text-yellow-500 font-medium'>Pending...</p>
            ) : inquiry.status === 'cancelled' ? (
                <p className='text-red-500 font-medium'>Request has been Cancelled</p>
            ) : (
                <a href={inquiry.url} target='_blank' download={inquiry.title} className='bg-red-600 hover:bg-red-900 p-2 font-medium text-l rounded'>Preview to Download</a>
            )}
            </div>
        </div>
    )
}