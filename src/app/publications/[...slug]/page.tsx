'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { firestore, addStudentInquiry } from '../../../lib/controller';
import { doc, getDocs, query, where, collection, updateDoc, increment } from 'firebase/firestore';
import { useArticles } from '@/context/ArticleContext'

interface PageProps {
    params: { slug: string[] }; // Adjust the type according to your actual data structure
}

export default function Page({ params }: PageProps) {
    const {data: allBooks} = useArticles()
    const router = useRouter();
    const [eBookData, setEBookData] = useState<any>(null);
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [userDetails, setUserDetails] = useState<any>(null);

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/\s+/g, '-');
    }

    // Find the article with the matching title (slug) and increment view count
    useEffect(() => {
        if(!allBooks){
            return
        }
        const slug = decodeURIComponent(params.slug[0]);
        
        const article = allBooks.find(article => {
            return generateSlug(article.title) === slug;
        })
        
        if (article) {
            setEBookData(article)
            const incrementViewCount = async () => {
                try {
                    const docRef = doc(firestore, 'eBooks', article.id);
                    await updateDoc(docRef, {
                        viewCount: increment(1)
                    });
                } catch (error) {
                    console.error('Error incrementing view count:', error);
                }
            };
            incrementViewCount();
        } else {
            console.log('No such document!');
        }
        setLoading(false);
        
    }, []);

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
                            articleId: eBookData.id,
                            uid: userId,
                            fullName: userDocData.fullName,
                            status: 'pending',
                        };
                        await addStudentInquiry(inquiryData);

                        // Redirect to profile page after request is made
                        router.push('/profile');
                    }
                } else {
                    router.push('/login');
                }
            } else {
                router.push('/login');
            }
        } catch (error) {
            console.error('Error handling download request:', error);
        }
    };

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };
        document.addEventListener('contextmenu', handleContextMenu);
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    return (
        <main className='w-full h-dvh pt-20'>
            <div className='md:p-6 p-2 w-full'>
                {loading && <p>Loading...</p>}
                {!loading && eBookData && (
                    <div className='w-full grid gap-4'>
                        <h2 className='text-xl p-3 px-6 text-red-500 widgets rounded font-bold'>{eBookData.title}</h2>
                        <section className='w-full flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4'>
                            <aside className='p-4 widgets rounded md:w-1/4 flex flex-col h-fit justify-center items-center'>
                                <h3 className='text-xl text-white font-semibold'>Contents</h3>
                                <div className='w-full pt-2 '>
                                    <p className='p-3 text-white bg-light-gray flex justify-between rounded'>
                                        <span className='font-medium'>Author(s)</span>
                                        <span className='font-medium'>{eBookData.authors}</span>
                                    </p>
                                    <p className='p-3 text-white flex justify-between rounded'>
                                        <span className='font-medium'>Advisor</span>
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
                            <div className='md:w-3/4 p-4 rounded widgets '>
                                <div className='w-full p-2 flex justify-end'>
                                    <button onClick={handleRequestDownload} className='bg-red-600 flex justify-center items-center space-x-3 hover:bg-red-800 outline-0 transition delay-150 duration-300 ease-in-out p-3 rounded-md text-base font-medium'>Request to download</button>
                                </div>
                                <div className='relative' style={{ height: '700px', overflow: 'hidden' }}>
                                    <iframe className='cursor-auto pt-2 rounded abstract unselectable no-scrollbar' src={eBookData.url + '#toolbar=0'} width={'100%'} height={'700px'}  />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center" onContextMenu={(e) => e.preventDefault()}>
                                        <p className="text-white text-lg font-bold">To view the whole abstract, please download the article.</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </main>
    );
}
