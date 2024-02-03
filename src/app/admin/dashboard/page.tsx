'use client' 

import PieChart from '../../../components/PieChart'
import {countDocs, countUsers, getTopDownloads, getTopViews } from '../../../lib/controller'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  
    const [totalCapstone, setTotalCapstone] = useState<number>(0)
    const [totalStudents, setTotalStudents] = useState<number>(0)
    const [topDownloads, setTopDownloads] = useState<{ title: string; downloadCount: number }[]>([])
    const [topViews, setTopViews] = useState<{ title: string; viewCount: number }[]>([])

    useEffect(() => {
      const fetchTotalCapstone = async () => {
        try {
          const total = await countDocs()
          const totalUsers = await countUsers()
          const topDownloadsData = await getTopDownloads()
          const topViews = await getTopViews()

          setTotalCapstone(total)
          setTotalStudents(totalUsers)
          setTopDownloads(topDownloadsData)
          setTopViews(topViews)

        } catch (error) {
          console.error('Error fetching total capstone:', error)
        }
      }
  
      fetchTotalCapstone();
    }, []);

    return (
        <main className='pl-32 flex gap-4 flex-col py-6 pr-8'>
            <div>
                <h1 className='text-xl font-semibold'>Dashboard</h1>
            </div>
            <div className='w-full grid lg:grid-cols-2 grid-cols-1 gap-4 place-content-between rounded'> 
                <div className='widgets p-5 flex flex-col justify-between rounded h-28 w-full'>
                  <h2 className='font-medium text-base'>Total Capstones</h2>
                  <span className='text-4xl font-medium'>{totalCapstone !== 0 ? totalCapstone : 'Loading...'}</span>
                </div>
                <div className='widgets p-5 flex flex-col justify-between rounded h-28 w-full'>
                  <h2 className='font-medium text-base'>Total Students</h2>
                  <span className='text-4xl font-medium'>{totalStudents !== 0 ? totalStudents : 'Loading...'}</span>
                </div>
            </div>
            <div className='w-full grid lg:grid-cols-2 grid-cols-1 gap-4 place-content-between rounded'> 
                <PieChart data={topDownloads} title={'Most Downloaded Capstones'} parameter="downloadCount" />
                <PieChart data={topViews} title={'Most Viewed Capstones'} parameter="viewCount" />
            </div>
        </main>
    )
}
