'use client' 

import { onSnapshot, getDocs, QuerySnapshot, DocumentData } from 'firebase/firestore'
import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usersCollection } from '../../../lib/controller'
import { UserType } from '../../../types/document'
import TableRow2  from '../../../components/TableRow2'

export default function StudentManagement(): JSX.Element {

    const [users, setUsers] = useState<UserType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    
    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                // Fetch user data from usersCollection
                const querySnapshot = await getDocs(usersCollection);
                
                const userData = querySnapshot.docs
                    .filter((doc) => doc.data().role === 'student') // Filter users with role 'student'
                    .map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as UserType[];

                setUsers(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);
    

    return (
        <main className='pl-32 flex gap-4 flex-col py-6 pr-7 h-dvh'>
            <div>
                <h1 className='text-xl font-semibold'>List of Students</h1>
            </div>
            <div className='w-full flex flex-col'>
                <div className='w-full h-fit pt-4 overflow-y-hidden'>                    
                    {isLoading ? (
                        <p className='text-center w-full justify-center items-center flex text-xl font-medium space-x-4'>
                            <span>Loading...</span>
                            <Icon icon='svg-spinners:180-ring-with-bg' style={{ fontSize: '24px' }} />
                        </p>
                    ) : (
                    <>
                        <table className='w-full  table-auto border-collapse border border-slate-500'>
                            <thead>
                                <tr>
                                    <th className='w-1/5 border border-slate-600 bg-slate-700 p-2'>Student ID</th>
                                    <th className='w-1/5 border border-slate-600 bg-slate-700 p-2'>Full Name</th>
                                    <th className='w-1/5 border border-slate-600 bg-slate-700 p-2'>User Name</th>
                                    <th className='w-1/5 border border-slate-600 bg-slate-700 p-2'>Email</th>
                                    <th className='w-1/5 border border-slate-600 bg-slate-700 p-2'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <TableRow2 key={index} user={user} />
                                ))}
                            </tbody>
                        </table>
                    </>
                    )}
                </div>
            </div>
        </main>
    )
}