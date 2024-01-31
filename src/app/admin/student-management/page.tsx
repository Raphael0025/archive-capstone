'use client' 

import { onSnapshot, QuerySnapshot, DocumentData  } from 'firebase/firestore'
import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { eBookCollection } from '../../../lib/controller'
import { DocumentType } from '../../../types/document'
import TableRow  from '../../../components/TableRow'

export default function StudentManagement () {


    
    return(
        <main className='pl-36 flex gap-4 flex-col py-6 pr-8'>
            <h1 className='text-xl text-slate-100 font-semibold w-full'>Student Management </h1>
            <div className='w-full flex flex-col'>
                <div className='w-full h-fit pt-4 overflow-y-hidden'>                    
                    {/* {isLoading ? (
                        <p className='text-center w-full justify-center items-center flex text-xl font-medium space-x-4'>
                            <span>Loading...</span>
                            <Icon icon='svg-spinners:180-ring-with-bg' style={{ fontSize: '24px' }} />
                        </p>
                    ) : sort && currentArticles.length === 0 ? (
                        <p className='text-center w-full text-xl font-medium'>No matching records for the selected sort.</p>
                    ) : sort ? (
                        <>
                            <table className='w-full  table-auto border-collapse border border-slate-500'>
                                <thead>
                                    <tr>
                                        <th className='w-1/5 border border-slate-600 bg-slate-700 p-2'>Title</th>
                                        <th className='w-1/5 border border-slate-600 bg-slate-700 p-2'>Author</th>
                                        <th className='w-1/5 border border-slate-600 bg-slate-700 p-2'>Category</th>
                                        <th className='w-1/5 border border-slate-600 bg-slate-700 p-2'>File</th>
                                        <th className='w-1/5 border border-slate-600 bg-slate-700 p-2'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentArticles.map((article, index) => (
                                        <TableRow key={index} article={article} />
                                    ))} 
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <p className='text-center w-full text-xl font-medium'>Select a sort option to display records.</p>
                    )} */}
                </div>
                <div className='flex justify-center mt-4'>
                    {/* {[...Array(totalFilteredPages).keys()].map((number) => (
                        <button key={number} onClick={() => paginate(number + 1)} className={`mx-1 px-3 py-2 ${
                                currentPage === number + 1
                                    ? 'bg-gray-600 text-white'
                                    : 'bg-gray-300 text-gray-700'
                            } rounded-md focus:outline-none focus:ring focus:border-blue-300 transition duration-300`}
>
                            {number + 1}
                        </button>
                    ))} */}
                </div>
            </div>
        </main>
    )
}