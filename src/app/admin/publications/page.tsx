'use client' 

import { onSnapshot, QuerySnapshot, DocumentData  } from 'firebase/firestore'
import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { eBookCollection } from '../../../lib/controller'
import { DocumentType } from '../../../types/document'
import TableRow  from '../../../components/TableRow'

export default function Articles(): JSX.Element {

    const [articles, setArticles] = useState<DocumentType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;
    const [sort, setSort] = useState<string>('All');
    
    useEffect(() => {
        const unsubscribe = onSnapshot(eBookCollection, (snapshot: QuerySnapshot<DocumentData>) => {
          setIsLoading(true);
          console.log(articles.length); // Using articles.length
          try {
            setArticles(
              snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                  id: doc.id,
                  title: data.title || '', // Add default values or handle potential undefined values
                  authors: data.authors || '',
                  category: data.category || '',
                  abstract: data.abstract || '',
                  field: data.field || '',
                  level: data.level || '',
                  advisor: data.advisor || '',
                  file: data.file || '',
                  url: data.url || null,
                  resourceType: data.resourceType || '',
                  downloadCount: data.downloadCount || 0,
                  viewCount: data.viewCount || 0,
                };
              })
            );
          } catch (error) {
            console.error(error);
          } finally {
            setIsLoading(false);
          }
        });
      
        return () => {
          // Unsubscribe when the component unmounts or when you want to clean up the subscription
          unsubscribe();
        };
      }, [articles.length]); // Include articles.length in the dependency array
      

    const sortedArticles = articles
    .filter((article) => {
        // Filter articles based on the selected sort value
        switch (sort) {
            case 'Software':
            case 'Hardware':
                return article.category === sort;
            default:
                return true; // Display all articles if no sort value or unknown sort value
        }
    })
    .sort((a, b) => a.category.localeCompare(b.category));

    const totalFilteredRecords = sortedArticles.length;

    const indexOfLastArticle = currentPage * itemsPerPage;
    const indexOfFirstArticle = indexOfLastArticle - itemsPerPage;
    const currentArticles = sort ? sortedArticles.slice(indexOfFirstArticle, indexOfLastArticle) : [];

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
                    <div className='w-full py-3 flex justify-end items-center space-x-4'>
                        <span className='text-xl font-medium'>Filter:</span>
                        <select name='sort' id='sort' value={sort} onChange={(e) => setSort(e.target.value)} className={`w-28 bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`} >
                            <option value='All'>All</option>
                            <option value='Software'>Software</option>
                            <option value='Hardware'>Hardware</option>
                        </select>
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