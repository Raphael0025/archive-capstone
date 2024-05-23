'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react';
import PDFThumbnail from '../components/PDFThumbnail'
import {getTopDownloads, firestore, getTopViews, eBookCollection} from '@/lib/controller'
import Link from 'next/link'
import { doc, getDoc, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore'
import {DocumentType} from '@/types/document'

export default function Home() {

  const [topDownloads, setTopDownloads] = useState<Array<any>>([])
  const [topViews, setTopViews] = useState<Array<any>>([])
  const itemsPerPage = 5
  const [articles, setArticles] = useState<DocumentType[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [sort, setSort] = useState<string>('All')
  const [currentPage, setCurrentPage] = useState<number>(1)

  useEffect(() => {
    // Fetch top downloads when the component mounts
    const fetchTopDownloads = async () => {
      try {
        const downloads = await getTopDownloads();
        setTopDownloads(downloads || []);
      } catch (error) {
        console.error('Error fetching top downloads:', error);
      }
    };

    fetchTopDownloads();
  }, []);

  useEffect(() => {
    // Fetch top downloads when the component mounts
    const fetchTopViews = async () => {
      try {
        const views = await getTopViews();
        setTopViews(views || []);
      } catch (error) {
        console.error('Error fetching top views:', error);
      }
    };

    fetchTopViews();
  }, []);

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
      }).sort((a, b) => a.category.localeCompare(b.category));
  
      const totalFilteredRecords = sortedArticles.length;
  
      const indexOfLastArticle = currentPage * itemsPerPage;
      const indexOfFirstArticle = indexOfLastArticle - itemsPerPage;
      const currentArticles = sort ? sortedArticles.slice(indexOfFirstArticle, indexOfLastArticle) : [];
  
      const totalFilteredPages = Math.ceil(totalFilteredRecords / itemsPerPage);
  
      const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <main className='w-full h-dvh pt-16 grid gap-5'>
          <div className='w-full bg-cover library h-36' />

          <section className='p-5 px-12 w-full'>
            <div>

            </div>
            <div className='p-3 px-4 w-full'>
              <h2 className='text-xl font-semibold'>Most Viewed Articles</h2>
              <div className='flex pt-2 w-full justify-between'>
                {Array.isArray(topViews) &&
                topViews.map((download) => (
                  <PDFThumbnail key={download.id} data={download} width={'200px'} height={'260px'} />
                ))}
              </div>
            </div>
            <div className='p-3 px-4 w-full'>
              <h2 className='text-xl font-semibold'>Capstone Articles</h2>
              <div className='flex pt-2 w-full justify-between'>
              {currentArticles.map((article) => (
                  <PDFThumbnail key={article.id} data={article} width={'200px'} height={'260px'} />
              ))}
              </div>
              <div className='flex w-full pt-2 justify-end'>
                  <Link href='/publications' className='text-slate-100 hover:text-red-400 '>
                    <span className='text-l font-medium'>{'See More...'}</span>
                  </Link>
              </div>
            </div>
          </section>
        </main>
    )
}
