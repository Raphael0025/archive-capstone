'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react';
import PDFThumbnail from '../components/PDFThumbnail'
import {getTopDownloads} from '../lib/controller'

export default function Home() {

  const [topDownloads, setTopDownloads] = useState<Array<any>>([]);

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
    return (
        <main className='w-full h-dvh pt-16 grid gap-5'>
          <div className='w-full bg-cover library h-36' />

          <section className='p-5 px-12 w-full'>
            <div>

            </div>
            <div className='p-3 px-4 w-full'>
              <h2 className='text-xl font-semibold'>Most Viewed Articles</h2>
              <div className='flex w-full justify-between'>
                {Array.isArray(topDownloads) &&
                topDownloads.map((download) => (
                  <PDFThumbnail key={download.id} data={download}  />
                ))}
              </div>
            </div>
            <div className='p-3 px-4 w-full'>
              <h2 className='text-xl font-semibold'>Capstone Articles</h2>
              <div className='flex w-full justify-between'>
                
                <div className='flex flex-end'>

                </div>
              </div>
            </div>
          </section>
        </main>
    )
}
