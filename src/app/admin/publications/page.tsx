'use client' 

import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DocumentTypeWithTimestamp } from '@/types/document'
import TableRow  from '../../../components/TableRow'
import { useArticles } from '@/context/ArticleContext'

export default function Articles(): JSX.Element {
    const {data: allBooks} = useArticles()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;
    const [sort, setSort] = useState<string>('All');
    const [sortOrder, setSortOrder] = useState<string>('asc');
    const [filterYear, setFilterYear] = useState<string>('All');

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/\s+/g, '-');
    }

    if(!allBooks){
        return <div>Loading...</div>;
    }

    // Extract unique years from timestamps
    const years = Array.from(new Set(allBooks.map(article => article.timestamp.toDate().getFullYear()))).sort((a, b) => b - a);

    // Add slug to each article
    const articlesWithSlugs = allBooks.map((article: DocumentTypeWithTimestamp) => ({
        ...article,
        slug: generateSlug(article.title)
    }));

    const sortedArticles = articlesWithSlugs
        .filter((article) => {
            if (sort !== 'All' && article.category !== sort) return false;
            if (filterYear !== 'All' && article.timestamp.toDate().getFullYear() !== parseInt(filterYear)) return false;
            return true;
        })
        .sort((a, b) => {
            switch (sortOrder) {
                case 'asc':
                    return a.title.localeCompare(b.title);
                case 'desc':
                    return b.title.localeCompare(a.title);
                case 'yearAsc':
                    return a.timestamp.toDate().getTime() - b.timestamp.toDate().getTime();
                case 'yearDesc':
                    return b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime();
                default:
                    return 0;
            }
        });

    const totalFilteredRecords = sortedArticles.length;

    const indexOfLastArticle = currentPage * itemsPerPage;
    const indexOfFirstArticle = indexOfLastArticle - itemsPerPage;
    const currentArticles = sortedArticles.slice(indexOfFirstArticle, indexOfLastArticle);

    const totalFilteredPages = Math.ceil(totalFilteredRecords / itemsPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <main className='pl-32 flex gap-4 flex-col py-6 pr-7 h-dvh'>
            <div>
                <h1 className='text-xl font-semibold'>List of Publications</h1>
            </div>
            <div className='w-full flex flex-col'>
                <div className='w-full grid justify-items-end'>
                    <Link href='/admin/upload-article' className='bg-red-600 flex justify-center items-center space-x-3 hover:bg-red-800 outline-0 transition delay-150 duration-300 ease-in-out p-3 rounded-md text-base font-medium'>
                        <span>Upload an article</span>
                        <Icon icon="line-md:cloud-up" style={{ fontSize: '24px' }} />
                    </Link>
                </div>
                <div className='w-full h-fit pt-4 overflow-y-hidden'>
                    <div className='flex w-full space-x-6 justify-end items-end'>
                        <div className=' py-3 flex space-x-4'>
                            <span className='text-xl font-medium'>Filter:</span>
                            <select name='sort' id='sort' value={sort} onChange={(e) => setSort(e.target.value)} className={`w-28 bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`} >
                                <option value='All'>All</option>
                                <option value='Software'>Software</option>
                                <option value='Hardware'>Hardware</option>
                            </select>
                            <select name='year' id='year' value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className={`w-28 bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500 text-sm text-black`} >
                                <option value='All'>All Years</option>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                        <div className=' py-3 flex space-x-4'>
                            <span className='text-xl font-medium'>Sort:</span>
                            <select name='sortOrder' id='sortOrder' value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={`w-28 bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500 text-sm text-black`} >
                                <option value='asc'>Title Asc</option>
                                <option value='desc'>Title Desc</option>
                                <option value='yearAsc'>Year Asc</option>
                                <option value='yearDesc'>Year Desc</option>
                            </select>
                        </div>
                    </div>
                    {isLoading ? (
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
                    )}
                </div>
                <div className='flex justify-center mt-4'>
                    {[...Array(totalFilteredPages).keys()].map((number) => (
                        <button key={number} onClick={() => paginate(number + 1)} className={`mx-1 px-3 py-2 ${
                                currentPage === number + 1
                                    ? 'bg-gray-600 text-white'
                                    : 'bg-gray-300 text-gray-700'
                            } rounded-md focus:outline-none focus:ring focus:border-blue-300 transition duration-300`}
>
                            {number + 1}
                        </button>
                    ))}
                </div>
            </div>
        </main>
    )
}