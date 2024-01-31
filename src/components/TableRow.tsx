import { DocumentType } from '../types/document'
import { Icon } from '@iconify/react'
import { deleteRecord } from '../lib/controller'
import Link from 'next/link'

interface IProps{
    article: DocumentType
}

export default function TableRow ({article} : IProps) {

    return(
        <tr className='hover:bg-gray-500 odd:bg-neutral-700 even:bg-neutral-800'>
            <td className='w-1/5 text-center p-2'>
                {article.title}
            </td>
            <td className='w-1/5 text-center p-2'>
                {article.authors}
            </td>
            <td className='w-1/5 text-center p-2'>
                {article.category}
            </td>
            <td className='w-1/4 text-center p-2'>
                {article.file}
            </td>
            <td className=' flex justify-center space-x-4  p-2'>
                <Link href={`/admin/publications/${article.id}`} className='hover:cursor-pointer hover:text-green-600'>
                    <Icon icon="uil:edit" style={{ fontSize: '24px' }} />
                </Link>
                <Icon onClick={() => deleteRecord(article.id, article.category, article.resourceType, article.file)} className='hover:cursor-pointer hover:text-red-600' icon="material-symbols:delete-outline" style={{ fontSize: '24px' }} />
            </td>
        </tr>
    )
}