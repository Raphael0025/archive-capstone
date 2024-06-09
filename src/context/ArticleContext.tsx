'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { query, orderBy, onSnapshot } from 'firebase/firestore';
import { DocumentTypeWithTimestamp } from '@/types/document' 
import { eBookCollection } from '@/lib/controller'

const ArticleContext = createContext<{data: DocumentTypeWithTimestamp[] | null; setData: React.Dispatch<React.SetStateAction<DocumentTypeWithTimestamp[] | null>>}>({data: null, setData: () => {} })

interface ArticleProviderProps {
    children: ReactNode;
}

export const ArticleProvider: React.FC<ArticleProviderProps> = ({children}) => {
    const [data, setData] = useState<DocumentTypeWithTimestamp[] | null>(null)
    useEffect(() => {
        const fetchData = async () => {
            const initDataRef = query(eBookCollection, orderBy('title', 'asc'));
            const unsubscribe = onSnapshot(initDataRef, (snapshot) => {
                const updateBook = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as DocumentTypeWithTimestamp[]
                setData(updateBook)
            })
            return () => {
                unsubscribe()
            }
        }
        fetchData()
    }, [])
    return(
        <ArticleContext.Provider value={{data, setData}}>
            {children}
        </ArticleContext.Provider>
    )
}

export const useArticles = () => {
    const context = useContext(ArticleContext)
    if(context === undefined){
        throw new Error('useArticle must be used within a Article Provider')
    }
    return context
}