'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image'
import { firestore, postCollection } from '../../lib/controller'
import { PostedType } from '../../types/document'
import { doc, getDoc, onSnapshot, collection, QuerySnapshot, DocumentData } from 'firebase/firestore'
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

export default function AnnouncementsComponent() {
    const [announcements, setAnnouncements] = useState<PostedType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(postCollection, (snapshot: QuerySnapshot<DocumentData>) => {
            setIsLoading(true);
            try {
                setAnnouncements(
                    snapshot.docs.map((doc) => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            header: data.header || '',
                            content: data.content || '',
                            file: data.file || '',
                            timestamp: data.timestamp || null,
                            caption: data.caption || '',
                            url: data.url || '',
                        };
                    })
                );
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        });

        return () => {
            // Unsubscribe when the component unmounts or when you want to clean up the subscription
            unsubscribe();
        };
    }, []);

    return (
        <main className='w-full h-dvh pt-20'>
            <div className='w-full bg-cover bg-library h-36' />
            <section className='p-5 px-12 w-full'>
                <h1 className='text-3xl font-bold mb-4'>Announcements</h1>
                {isLoading ? (
                    <p className='text-center w-full justify-center items-center flex text-xl font-medium space-x-4'>
                        <span>Loading...</span>
                        {/* You can use your loading icon here */}
                    </p>
                ) : announcements.length === 0 ? (
                    <p className='text-center w-full text-xl font-medium'>No announcements available.</p>
                ) : (
                    <div className='w-full grid gap-4 place-items-center'>
                        {announcements.map((announcement) => (
                            <div key={announcement.id} className='w-fit flex justify-start items-start flex-col p-5 widgets rounded'>
                                <h2 className='text-2xl font-semibold'>{announcement.header}</h2>
                                <Image src={announcement.url} alt={announcement.header} width={500} height={500} />
                                <div className='flex w-full justify-between'>
                                    <caption>{announcement.caption}</caption>
                                    <p>{format(
                                        new Date((announcement.timestamp as Timestamp).seconds * 1000),
                                        'MMM-dd-yyyy HH:mm:ss'
                                    )}</p>
                                </div>
                                
                                <p>{announcement.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
