'use client'

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { updateDoc, firestore, addStudentInquiry, eBookCollection } from '../../lib/controller'
import { Icon } from '@iconify/react';
import { doc, getDoc, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore'
import Link from 'next/link'
import PDFThumbnail from '../../components/PDFThumbnail'
import { DocumentType } from '../../types/document' 

export default function Articles() {

    const [articles, setArticles] = useState<DocumentType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [sort, setSort] = useState<string>('All');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;
    
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
      }, [articles.length]);

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
        <main className="w-full h-dvh pt-20">
            <div className='w-full bg-cover bg-library h-36' />
            <section className='p-5 px-12 w-full'>
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
                        <div className='place-items-center pt-2 w-full grid grid-cols-5 gap-4'>
                            {currentArticles.map((article) => (
                                <PDFThumbnail key={article.id} data={article} width={'200px'} height={'260px'} />
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
