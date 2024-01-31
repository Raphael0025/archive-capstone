'use client' 

import PieChart from '../../../components/PieChart'
import {countDocs} from '../../../lib/controller'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  
    const [totalCapstone, setTotalCapstone] = useState<number>(0)

    useEffect(() => {
      const fetchTotalCapstone = async () => {
        try {
          const total = await countDocs();
          setTotalCapstone(total);
        } catch (error) {
          console.error('Error fetching total capstone:', error);
        }
      };
  
      fetchTotalCapstone();
    }, []);

    return (
        <main className='pl-32 flex gap-4 flex-col py-6 pr-8 h-screen'>
            <div>
                <h1 className='text-xl font-semibold'>Dashboard</h1>
            </div>
            <div className='w-full flex space-x-5 rounded'> 
                <div className='widgets p-5 flex flex-col justify-between rounded h-28 w-1/2'>
                  <h2 className='font-medium text-base'>Total Capstones</h2>
                  <span className='text-4xl font-medium'>{totalCapstone !== 0 ? totalCapstone : 'Loading...'}</span>
                </div>
                <div className='widgets p-5 rounded h-28 w-1/2'>
                  <h2 className='font-medium text-base'>Total Students</h2>

                </div>
                {/* <div className='widgets p-5 rounded h-28 w-1/2'>
                  <h2 className='font-medium text-base'>Overview</h2>

                </div> */}
            </div>
            <div className='w-full h-3/5 flex space-x-5 rounded'> 
                <PieChart />
                <PieChart />
            </div>
        </main>
    )
}
