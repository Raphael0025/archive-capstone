'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link'
import { useArticles } from '@/context/ArticleContext'
import { Icon } from '@iconify/react';
import { DocumentTypeWithTimestamp } from '@/types/document' 

export default function Articles() {
    const {data: allBooks} = useArticles()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [sort, setSort] = useState<string>('All');
    const [sortOrder, setSortOrder] = useState<string>('asc');
    const [filterYear, setFilterYear] = useState<string>('All');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;
    
    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/\s+/g, '-');
    };

    if(!allBooks){
        return
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
        <main className="w-full place-items-center h-dvh pt-20">
            <div className='w-full bg-cover bg-library h-36' />
            <section className='p-5 px-6 md:px-12 w-full'>
                <div className='w-full flex flex-col place-items-center h-fit pt-4 overflow-y-hidden'>
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
                        <p className='text-center w-1/2 justify-center items-center flex text-xl font-medium space-x-4'>
                            <span>Loading...</span>
                            <Icon icon='svg-spinners:180-ring-with-bg' style={{ fontSize: '24px' }} />
                        </p>
                    ) : sort && currentArticles.length === 0 ? (
                        <p className='text-center w-full text-xl font-medium'>No matching records for the selected sort.</p>
                    ) : sort ? (
                        <div className='flex flex-col justify-center p-2 w-full gap-4'>
                            {currentArticles.map((article) => (
                                <Link key={article.id} href={`/publications/${article.slug}`} className=' rounded hover:-translate-y-2 hover:ring-2 ring-slate-700 text-slate-100 transition ease-in-out delay-150 duration-300 p-2 cursor-pointer flex flex-col md:flex-row items-end md:items-center space-y-4 md:space-y-0 justify-between' >
                                    <div className='flex flex-col'>
                                        <h2 className='font-medium text-l text-white md:text-center'>{article.title}</h2>
                                        <figcaption className='text-xs italic text-l text-white md:text-start'>by {article.authors}</figcaption>
                                    </div>
                                    <p className='text-xs'>{`${article.timestamp.toDate().toLocaleString('en-US', {month: 'short', year: 'numeric'})}`}</p>
                                </Link>
                            ))}
                        </div>
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
            </section>
        </main>
    )
}
