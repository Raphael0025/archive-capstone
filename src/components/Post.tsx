import { ViewPostType } from '../types/document'
import { Icon } from '@iconify/react'
import { deletePost } from '../lib/controller'
import Link from 'next/link'
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore'; 

interface IProps{
    post: ViewPostType;
}

export default function Post ({post}: IProps) {
    
    const formatTimestamp = (timestamp: Timestamp) => {
        const date = timestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date
        return format(date, 'MMMM dd, yyyy'); // Adjust the format based on your preference
    };

    return(
        <div className='w-full py-3 px-2 border-b-2 flex justify-between border-slate-500'>
            <span className='w-full'>
                {post.header}
            </span>
            <span className='w-full'>
                {formatTimestamp(post.timestamp)}
            </span>
            <span className='flex space-x-4'>
                <Link href={`/admin/content-management/${post.id}`} className='hover:cursor-pointer hover:text-green-600'>
                    <Icon icon="uil:edit" style={{ fontSize: '24px' }} />
                </Link>

                <Icon onClick={() => deletePost(post.id, post.file)} className='hover:cursor-pointer hover:text-red-600' icon="material-symbols:delete-outline" style={{ fontSize: '24px' }} />
            </span>
        </div>
    )
}