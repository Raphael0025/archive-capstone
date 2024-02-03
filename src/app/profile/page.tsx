'use client'

import { useState, useEffect } from 'react';
import { firestore, requestsCollection } from '../../lib/controller';
import { Icon } from '@iconify/react'
import { UserType, requestType } from '../../types/document';
import { query, collection, where, getDocs, DocumentData } from 'firebase/firestore';
import TableRow4 from '../../components/TableRow4'

export default function Profile() {
    const [user, setUser] = useState<UserType | null>(null);
    const [matchingInquiries, setMatchingInquiries] = useState<requestType[]>([]);
    const [downloadsArray, setDownloadsArray] = useState<string[]>([]);
    const [userName, setUserName] = useState<string>('');
    const [inquiries, setInquiries] = useState<requestType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const fetchData = async () => {
            const customToken = localStorage.getItem('customToken');
            setUserName(customToken || '');
    
            if (customToken) {
                try {
                    const usersCollectionRef = collection(firestore, 'users');
                    const userQuery = query(usersCollectionRef, where('userName', '==', customToken));
    
                    const userSnapshot = await getDocs(userQuery);
    
                    if (!userSnapshot.empty) {
                        const userData = userSnapshot.docs[0].data() as UserType;
                        setUser(userData);
    
                        // Assuming 'downloads' is an array field in the user document
                        const downloads = userData?.downloads || [];
                        setDownloadsArray(downloads);
    
                        const requestsCollection = collection(firestore, 'student-inquiries');
                        const inquiriesSnapshot = await getDocs(requestsCollection);
    
                        const inquiryData = inquiriesSnapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        })) as requestType[];
    
                        setInquiries(inquiryData);

                        downloads.forEach((downloadId) => {
                            // Find matching inquiry for each download
                            const matchingInquiry = inquiryData.find((inquiry) => inquiry.id === downloadId);
    
                            if (matchingInquiry) {
                                // Store the matching inquiry data in a state variable
                                setMatchingInquiries((prevInquiries) => [...prevInquiries, matchingInquiry]);
                            }
                            console.log(matchingInquiry)
                        });
                    } else {
                        console.error('User document not found.');
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
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
                        <p className='w-full'>Student ID: {user.studID}</p>
                        <p className='w-full'>Full Name: {user.fullName}</p>
                        <p className='w-full'>Username: {userName}</p>
                        <p className='w-full'>Email: {user.email}</p>
                    </div>
                ) : (
                    <p>User details not available.</p>
                )}
                <div className='w-full h-fit pt-4 overflow-y-hidden'>  
                    <table className='w-full  table-auto border-collapse border border-slate-500'>
                        <thead>
                            <tr>
                                <th className='w-1/5 border border-slate-600 bg-slate-700 p-2'>Capstone Title</th>
                                <th className='w-1/5 border border-slate-600 bg-slate-700 p-2'>Status</th>
                                <th className='w-1/5 border border-slate-600 bg-slate-700 p-2'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {matchingInquiries.map((inquiry, index) => (
                            <TableRow4 key={index} inquiry={inquiry} />
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}

