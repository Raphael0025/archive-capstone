'use client' 

import { onSnapshot, getDocs, doc, query, where, QuerySnapshot, DocumentData } from 'firebase/firestore'
import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { requestsCollection, approveStudentInquiry, cancelStudentInquiry } from '../../../lib/controller'
import { requestType } from '../../../types/document'
import TableRow3  from '../../../components/TableRow3'

export default function StudentInquiries(): JSX.Element {

    const [inquiries, setInquiries] = useState<requestType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true)
    
    useEffect(() => {
        const unsubscribeInquiries = onSnapshot(query(requestsCollection, where('status', '==', 'pending')), (snapshot) => {
            const inquiryData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as requestType[];
    
            setInquiries(inquiryData);
            setIsLoading(false);
        });
    
        return () => unsubscribeInquiries(); // Unsubscribe when component unmounts or when the query changes
    }, []);

    const handleApproveClick = async (inquiryId: string) => {
        try {
            // Call the approveStudentInquiry function
            await approveStudentInquiry(inquiryId);
            // Fetch updated data again
            const querySnapshot = await getDocs(query(requestsCollection, where('status', '==', 'pending')));
            const updatedInquiryData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as requestType[];

            // Update the state with the updated data
            setInquiries(updatedInquiryData);
        } catch (error) {
            console.error('Error approving inquiry:', error);
        }
    };

    const handleCancelledClick = async (inquiryId: string) => {
        try {
            // Call the approveStudentInquiry function
            await cancelStudentInquiry(inquiryId);
            // Fetch updated data again
            const querySnapshot = await getDocs(query(requestsCollection, where('status', '==', 'pending')));
            const updatedInquiryData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as requestType[];

            // Update the state with the updated data
            setInquiries(updatedInquiryData);
        } catch (error) {
            console.error('Error approving inquiry:', error);
        }
    };
    

    return (
        <main className='pl-32 flex gap-4 flex-col py-6 pr-7 h-dvh'>
            <div>
                <h1 className='text-xl font-semibold'>List of Pending Requests</h1>
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
                        <table className='w-full table-auto border-collapse border border-slate-500'>
                            <thead>
                                <tr>
                                    <th className='w-1/5 border border-slate-600 bg-slate-700 p-2'>Full Name</th>
                                    <th className='w-1/5 border border-slate-600 bg-slate-700 p-2'>Capstone Title</th>
                                    <th className='w-1/5 border border-slate-600 bg-slate-700 p-2'>Action</th>
                                </tr>
                            </thead>
                            {inquiries.length === 0 ? (
                                <tfoot>
                                    <tr>
                                        <td colSpan={4} className='w-full p-3 text-center'>
                                            No student inquiries at the moment...
                                        </td>
                                    </tr>
                                </tfoot>
                            ) : (
                                <tbody>
                                    {inquiries.map((inquiry, index) => (
                                        <TableRow3 key={index} inquiry={inquiry} onApproveClick={handleApproveClick} onCancelClick={handleCancelledClick} />
                                    ))}
                                </tbody>
                            )}
                        </table>
                    </>
                    )}
                </div>
            </div>
        </main>
    )
}