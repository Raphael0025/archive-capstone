'use client' 

import VerticalBarChart from '@/components/VerticalBarChart'
import {countDocs, countUsers, countStudents, countGuests, countEmployees } from '@/lib/controller'
import { useState, useEffect } from 'react'
import { useArticles } from '@/context/ArticleContext'
import { DocumentTypeWithTimestamp } from '@/types/document'

export default function Dashboard() {
    const {data: allBooks} = useArticles()
  
    const [totalCapstone, setTotalCapstone] = useState<number>(0)
    const [totalUsers, setTotalUsers] = useState<number>(0)
    const [totalStudents, setTotalStudents] = useState<number>(0)
    const [totalGuests, setTotalGuests] = useState<number>(0)
    const [totalEmployees, setTotalEmployees] = useState<number>(0)

    useEffect(() => {
      const fetchTotalCapstone = async () => {
        try {
          const total = await countDocs()
          const totalUsers = await countUsers()
          const totalStudent = await countStudents()
          const totalEmployee = await countEmployees()
          const totalGuest = await countGuests()

          setTotalCapstone(total)
          setTotalUsers(totalUsers)
          setTotalStudents(totalStudent)
          setTotalEmployees(totalEmployee)
          setTotalGuests(totalGuest)

        } catch (error) {
          console.error('Error fetching total capstone:', error)
        }
      }
      fetchTotalCapstone();
    }, []);

    /// Get current year and 5 years ago
  const currentYear = new Date().getFullYear();
  const startYear = (currentYear - 1) - 5;
  
  // Generate labels from 5 years ago to current year
  const labels = Array.from({ length: 6 }, (_, i) => (startYear + i).toString());

  // Initialize arrays to store download and view counts per year
  const downloadCountsPerYear = Array(6).fill(0);
  const viewCountsPerYear = Array(6).fill(0);

  if (allBooks) {
    allBooks.forEach((book: DocumentTypeWithTimestamp) => {
      const year = book.timestamp.toDate().getFullYear();
      if (year >= startYear && year <= currentYear) {
        const index = year - startYear;
        downloadCountsPerYear[index] += book.downloadCount || 0;
        viewCountsPerYear[index] += book.viewCount || 0;
      }
    });
  }

  // Create datasets for the chart
  const datasets = [
    {
      label: 'Downloads',
      data: downloadCountsPerYear,
      backgroundColor: 'rgba(75, 192, 192, 1)',
      stack: 'Stack 0',
    },
    {
      label: 'Views',
      data: viewCountsPerYear,
      backgroundColor: 'rgba(54, 162, 235, 1)',
      stack: 'Stack 1',
    },
  ];
    return (
        <main className='pl-32 flex gap-4 flex-col py-6 pr-8'>
            <div>
                <h1 className='text-xl font-semibold'>Dashboard</h1>
            </div>
            <div className='w-full grid lg:grid-cols-5 grid-cols-1 gap-4 place-content-between rounded'> 
              <div className='widgets p-5 flex flex-col justify-between rounded h-28 w-full'>
                <h2 className='font-medium text-base'>Total Capstones</h2>
                <span className='text-4xl font-medium'>{totalCapstone !== null ? (totalCapstone !== 0 ? totalCapstone : 0) : 'Loading...'}</span>
              </div>
              <div className='widgets p-5 flex flex-col justify-between rounded h-28 w-full'>
                <h2 className='font-medium text-base'>Total Users</h2>
                <span className='text-4xl font-medium'>{totalUsers !== null ? (totalUsers !== 0 ? totalUsers : 0) : 'Loading...'}</span>
              </div>
              <div className='widgets p-5 flex flex-col justify-between rounded h-28 w-full'>
                <h2 className='font-medium text-base'>Total Students</h2>
                <span className='text-4xl font-medium'>{totalStudents !== null ? (totalStudents !== 0 ? totalStudents : 0) : 'Loading...'}</span>
              </div>
              <div className='widgets p-5 flex flex-col justify-between rounded h-28 w-full'>
                <h2 className='font-medium text-base'>Total Employees</h2>
                <span className='text-4xl font-medium'>{totalEmployees !== null ? (totalEmployees !== 0 ? totalEmployees : 0) : 'Loading...'}</span>
              </div>
              <div className='widgets p-5 flex flex-col justify-between rounded h-28 w-full'>
                <h2 className='font-medium text-base'>Total Guests</h2>
                <span className='text-4xl font-medium'>{totalGuests !== null ? (totalGuests !== 0 ? totalGuests : 0) : 'Loading...'}</span>
              </div>
            </div>
            <div className='w-full grid lg:grid-cols-2 grid-cols-1 gap-4 place-content-between bg-zinc-800 p-8 rounded'> 
                <VerticalBarChart datasets={datasets} labels={labels} />
            </div>
        </main>
    )
}
