import { requestType } from '../types/document'
import { Icon } from '@iconify/react'
import { approveStudentInquiry } from '../lib/controller'
import Link from 'next/link'

interface IProps{
    inquiry: requestType;
    onApproveClick: (inquiryId: string) => void;
    onCancelClick: (inquiryId: string) => void;
}

export default function TableRow3 ({inquiry, onApproveClick, onCancelClick } : IProps) {

    return(
        <tr className='hover:bg-gray-500 odd:bg-neutral-700 even:bg-neutral-800'>
            <td className='w-1/5 text-center p-2'>
                {inquiry.fullName}
            </td>
            <td className='w-1/5 text-center p-2'>
                {inquiry.title}
            </td>
            <td className=' flex justify-center space-x-4  p-2'>
                <button onClick={() => onApproveClick(inquiry.id)} className='bg-red-600 hover:bg-red-900 p-2 font-medium text-l rounded '>Approved</button>
                <button onClick={() => onCancelClick(inquiry.id)} className='hover:bg-slate-100 border-2 border-red-600 hover:text-red-500 hover:border-slate-100 p-2 font-medium text-l rounded '>Cancel</button>
            </td>
        </tr>
    )
}