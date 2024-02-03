import { requestType } from '../types/document'
import { Icon } from '@iconify/react'
import { approveStudentInquiry } from '../lib/controller'
import Link from 'next/link'

interface IProps{
    inquiry: requestType;
}

export default function TableRow4 ({inquiry } : IProps) {

    return(
        <tr className='hover:bg-gray-500 odd:bg-neutral-700 even:bg-neutral-800'>
            <td className='w-1/5 text-center p-2'>
                {inquiry.title}
            </td>
            <td className='w-1/5 text-center p-2'>
                {inquiry.status}
            </td>
            <td className=' flex justify-center space-x-4  p-2'>
            {inquiry.status === 'pending' ? (
                <p className='text-yellow-500 font-medium'>Pending...</p>
            ) : (
                <a href={inquiry.url} target='_blank' download={inquiry.title} className='bg-red-600 hover:bg-red-900 p-2 font-medium text-l rounded'>Preview to Download</a>
            )}
            </td>
        </tr>
    )
}