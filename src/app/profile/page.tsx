'use client'

import { useState, useEffect } from 'react';
import { firestore, requestsCollection } from '../../lib/controller';
import { Icon } from '@iconify/react'
import { UserType, requestType } from '../../types/document';
import { query, collection, where, getDocs, onSnapshot, DocumentData } from 'firebase/firestore';
import TableRow4 from '../../components/TableRow4'

export default function Profile() {
    const [user, setUser] = useState<UserType | null>(null);
    const [matchingInquiries, setMatchingInquiries] = useState<requestType[]>([]);
    const [downloadsArray, setDownloadsArray] = useState<string[]>([]);
    const [userName, setUserName] = useState<string>('');
    const [inquiries, setInquiries] = useState<requestType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            const customToken = localStorage.getItem('customToken');
            setUserName(customToken || '');

            if (customToken) {
                const usersCollectionRef = collection(firestore, 'users');
                const userQuery = query(usersCollectionRef, where('userName', '==', customToken));

                const unsubscribeUser = onSnapshot(userQuery, (userSnapshot) => {
                    if (!userSnapshot.empty) {
                        const userData = userSnapshot.docs[0].data() as UserType;
                        setUser(userData);

                        const downloads = userData?.downloads || [];
                        setDownloadsArray(downloads);

                        const requestsCollection = collection(firestore, 'student-inquiries');
                        const unsubscribeInquiries = onSnapshot(requestsCollection, (inquiriesSnapshot) => {
                            const inquiryData = inquiriesSnapshot.docs.map((doc) => ({
                                id: doc.id,
                                ...doc.data(),
                            })) as requestType[];

                            setInquiries(inquiryData);

                            const uniqueInquiries: requestType[] = [];
                            const uniqueIds = new Set<string>();

                            downloads.forEach((downloadId) => {
                                const matchingInquiry = inquiryData.find((inquiry) => inquiry.id === downloadId);

                                if (matchingInquiry && !uniqueIds.has(matchingInquiry.id)) {
                                    uniqueInquiries.push(matchingInquiry);
                                    uniqueIds.add(matchingInquiry.id);
                                }
                            });

                            setMatchingInquiries(uniqueInquiries);
                        });

                        // Cleanup the inquiries listener when component unmounts or customToken changes
                        return () => {
                            unsubscribeInquiries();
                        }; 
                    } else {
                        console.error('User document not found.');
                    }
                })
                // Cleanup the user listener when component unmounts or customToken changes
                return () => {
                    unsubscribeUser();
                };
            } else {
                console.error('Unable to decode username from custom token.');
            }
        };

        fetchData();
    }, []);

    return (
        <main className='w-full h-dvh pt-20'>
            <div className='w-full bg-cover bg-library h-36' />
            <section className='p-5 px-12 w-full'>
                <h1 className='text-3xl font-bold mb-4'>User Profile</h1>

                {user ? (
                    <div className='flex w-full justify-between items-start'>
                        <p className='w-full'>Student ID: {user.userID}</p>
                        <p className='w-full'>Full Name: {user.fullName}</p>
                        <p className='w-full'>Username: {userName}</p>
                        <p className='w-full'>Email: {user.email}</p>
                    </div>
                ) : (
                    <p>User details not available.</p>
                )}
                <div className='w-full h-fit pt-4 overflow-y-hidden'>  
                    <div className='w-full  table-auto border-collapse border border-slate-500'>
                        <div>
                            <div className='flex justify-between'>
                                <h5 className='w-full text-center border border-slate-600 bg-slate-700 p-2'>Capstone Title</h5>
                                <h5 className='w-full text-center border border-slate-600 bg-slate-700 p-2'>Status</h5>
                                <h5 className='w-full text-center border border-slate-600 bg-slate-700 p-2'>Action</h5>
                            </div>
                        </div>
                        <div>
                        {matchingInquiries.map((inquiry, index) => (
                        <div key={index} className='hover:bg-gray-500 odd:bg-neutral-700 flex justify-between even:bg-neutral-800'>
                            <div className='w-full p-2'>
                                {inquiry.title}
                            </div>
                            <div className='w-full text-center p-2'>
                            {inquiry.status === 'pending' ? (
                                <p className='text-yellow-500 font-medium'>Request Pending...</p>
                            ) : inquiry.status === 'cancelled' ? (
                                <p className=' font-medium'>Request has been Cancelled</p>
                            ) : (
                                <p className=' font-medium'>Ready to download</p>
                            )}
                            </div>
                            <div className='w-full flex justify-center space-x-4  p-2'>
                            {inquiry.status === 'pending' ? (
                                <p className='text-yellow-500 font-medium'>Pending...</p>
                            ) : inquiry.status === 'cancelled' ? (
                                <p className='text-red-500 font-medium'>Request has been Cancelled</p>
                            ) : (
                                <a href={inquiry.url} target='_blank' download={inquiry.title} className='bg-red-600 hover:bg-red-900 p-2 font-medium text-l rounded'>Preview to Download</a>
                            )}
                            </div>
                        </div>
                        ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
