'use client'

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { firestore, addStudentInquiry, usersCollection } from '../../../lib/controller'
import { Icon } from '@iconify/react';
import { doc, getDoc, getDocs, query, where, collection } from 'firebase/firestore'

interface PageProps {
    params: { id: string }; // Adjust the type according to your actual data structure
}

export default function Page({params}: PageProps){
    const router = useRouter()
    const [eBookData, setEBookData] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [userDetails, setUserDetails] = useState<any>(null); 

    useEffect(() => {
        const fetchData = async () => {
          try {
            const docRef = doc(firestore, 'eBooks', params.id);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
              setEBookData(docSnap.data());
            } else {
              console.log('No such document!');
            }
          } catch (error) {
            console.error('Error getting document:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, [params.id]);

    const handleRequestDownload = async () => {
        try {
          // Retrieve custom token from localStorage
          const customToken = localStorage.getItem('customToken');
    
          if (customToken) {
            // Manually find the user document using the custom token
            const usersCollectionRef = collection(firestore, 'users');
            const q = query(usersCollectionRef, where('userName', '==', customToken));
            const userQuerySnapshot = await getDocs(q);
    
            if (!userQuerySnapshot.empty) {
              const userDocData = userQuerySnapshot.docs[0].data();
              const userId = userQuerySnapshot.docs[0].id;
              setUserDetails({
                fullName: userDocData.fullName,
                studID: userDocData.studID,
                uid: userId,
              });

              // Call addStudentInquiry function with the required data
              if (eBookData) {
                const inquiryData = {
                  title: eBookData.title,
                  url: eBookData.url,
                  articleId: params.id,
                  uid: userId,
                  fullName: userDocData.fullName,
                  studID: userDocData.studID,
                  status: 'pending',
                };
                addStudentInquiry(inquiryData);

                router.push('/profile')
              }
            } else {
              console.log('User document not found.')
                router.push('/login')
            }
          } else {
            console.log('Custom token not found in localStorage.');
            router.push('/login')
          }
        } catch (error) {
          console.error('Error handling download request:', error);
        }
      };
    

    return(
        <main className='w-full h-dvh pt-20'>
            <div className='p-6 w-full'>
            {loading && <p>Loading...</p>}
            {!loading && eBookData && (
                <div className='w-full grid gap-4'>
                    <h2 className='text-xl p-3 px-6 text-red-500 widgets rounded font-bold'>{eBookData.title}</h2>
                    <section className='w-full flex space-x-4'>
                        <aside className='p-4 widgets rounded w-1/4 flex flex-col h-fit justify-center items-center'>
                            <h3 className='text-xl text-white font-semibold'>Contents</h3>
                            <div className='w-full pt-2 '>
                                <p className='p-3 text-white bg-light-gray flex justify-between rounded'>
                                    <span className='font-medium'>Author(s)</span>
                                    <span className='font-medium'>{eBookData.authors}</span>
                                </p>
                                <p className='p-3 text-white flex justify-between rounded'>
                                    <span className='font-medium'>Degree Field</span>
                                    <span className='font-medium'>{eBookData.advisor}</span>
                                </p>
                                <p className='p-3 text-white flex justify-between rounded'>
                                    <span className='font-medium'>Category</span>
                                    <span className='font-medium'>{eBookData.category}</span>
                                </p>
                                <p className='p-3 text-white bg-light-gray flex justify-between rounded'>
                                    <span className='font-medium'>Views</span>
                                    <span className='font-medium'>{eBookData.viewCount}</span>
                                </p>
                                <p className='p-3 text-white flex justify-between rounded'>
                                    <span className='font-medium'>Degree Field</span>
                                    <span className='font-medium'>{eBookData.field}</span>
                                </p>
                            </div>
                        </aside>
                        <div className='w-3/4 p-4 rounded widgets '>
                            <div className='w-full p-2 flex justify-end'>
                                <button onClick={handleRequestDownload} className='bg-red-600 flex justify-center items-center space-x-3 hover:bg-red-800 outline-0 transition delay-150 duration-300 ease-in-out p-3 rounded-md text-base font-medium'>Request to download</button>
                            </div>
                            <h2 className='font-semibold text-xl pb-2'>Abstract</h2>
                            <p className='w-full text-wrap line-clamp-6 truncate'>{eBookData.abstract}</p>
                            <iframe className='cursor-auto pt-2 rounded abstract unselectable' src={eBookData.url + '#toolbar=0'} width={'100%'} height={'700px'} />
                        </div>
                    </section>
                </div>
            )}
            </div>
        </main>
    )
}