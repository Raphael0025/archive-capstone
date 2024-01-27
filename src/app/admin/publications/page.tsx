'use client' 

import { onSnapshot, QuerySnapshot, DocumentData  } from 'firebase/firestore'
import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { eBookCollection } from '../../../lib/controller'
import { NewDocumentType } from '../../../types/document'
import TableRow  from '../../../components/TableRow'

export default function Articles(): JSX.Element {

    const [articles, setArticles] = useState<NewDocumentType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => onSnapshot(eBookCollection, (snapshot: QuerySnapshot<DocumentData >) => {
        setIsLoading(true)
        try{
            setArticles(
                snapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        title: data.title || '', // Add default values or handle potential undefined values
                        authors: data.authors || '',
                        affiliation: data.affiliation || '',
                        abstract: data.abstract || '',
                        field: data.field || '',
                        level: data.level || '',
                        advisor: data.advisor || '',
                        file: data.file || '',
                        url: data.url || null,
                        resourceType: data.resourceType || '',
                        language: data.language || '',
                    };
                })
            )
        }catch(error){
            console.error(error)
        }finally{
            setIsLoading(false)
        }
    }), [])

    return (
        <main className='pl-32 flex gap-4 flex-col py-6 pr-7 h-dvh'>
            <div>
                <h1 className='text-xl font-semibold'>List of Publications</h1>
            </div>
            <div className='w-full flex flex-col'>
                <div className='w-full grid justify-items-end'>
                    <Link href='/admin/upload-article' className='bg-red-900 flex justify-center items-center space-x-3 hover:bg-red-500 outline-0 transition delay-150 duration-300 ease-in-out p-3 rounded-md text-base font-medium'>
                        <span>Upload an article</span>
                        <Icon icon="line-md:cloud-up" style={{ fontSize: '24px' }} />
                    </Link>
                </div>
                <div className='w-full pt-2'>
                {isLoading ? (
                    <p>Loading... <Icon icon="svg-spinners:180-ring-with-bg" style={{ fontSize: '24px' }} /></p>
                ) : (
                    <table className='w-full table-auto border-collapse border rounded border-slate-500'>
                        <thead>
                            <tr>
                                <th className='border border-slate-600 bg-slate-700 p-2'>Title</th>
                                <th className='border border-slate-600 bg-slate-700 p-2'>Author</th>
                                <th className='border border-slate-600 bg-slate-700 p-2'>Resource Type</th>
                                <th className='border border-slate-600 bg-slate-700 p-2'>File</th>
                            </tr>
                        </thead>
                        <tbody>
                            {articles && articles.length ? (
                                articles.map((article, index) => <TableRow key={index} article={article} />)
                            ) : (
                                <tr>
                                    <td colSpan={3} className='text-center'>
                                        There are no Articles uploaded yet...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
                </div>
            </div>
        </main>
    )
}
