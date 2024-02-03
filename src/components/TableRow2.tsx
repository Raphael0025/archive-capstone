import { UserType } from '../types/document'
import { Icon } from '@iconify/react'
import { deleteUser } from '../lib/controller'
import Link from 'next/link'

interface IProps{
    user: UserType
}

export default function TableRow2 ({user} : IProps) {

    return(
        <tr className='hover:bg-gray-500 odd:bg-neutral-700 even:bg-neutral-800'>
            <td className='w-1/5 text-center p-2'>
                {user.studID}
            </td>
            <td className='w-1/5 text-center p-2'>
                {user.fullName}
            </td>
            <td className='w-1/5 text-center p-2'>
                {user.userName}
            </td>
            <td className='w-1/4 text-center p-2'>
                {user.email}
            </td>
            <td className=' flex justify-center space-x-4  p-2'>
                <Icon onClick={() => deleteUser(user.id)} className='hover:cursor-pointer hover:text-red-600' icon="material-symbols:delete-outline" style={{ fontSize: '24px' }} />
            </td>
        </tr>
    )
}