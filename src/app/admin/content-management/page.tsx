'use client' 

import { Icon } from '@iconify/react'
import { useState, useEffect } from 'react'
import { addPost } from '../../../lib/controller'
import { PostFormError, ViewPostType } from '../../../types/document'
import { onSnapshot, QuerySnapshot, DocumentData  } from 'firebase/firestore'
import { postCollection } from '../../../lib/controller'
import Post  from '../../../components/Post'

export default function ContentMangement () {

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [file, setFilename] = useState<string>('No file chosen yet...')
    const [dirFile, setDirFile] = useState<File[]>([])
    const [errors, setErrors] = useState<PostFormError>({})
    const [header, setHeader] = useState<string>('')
    const [caption, setCaption] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [posts, setPosts] = useState<ViewPostType[]>([]);

    const validateForm = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let newErrors: PostFormError = {};
    
        if (!file || file === 'No file chosen yet...') { 
            newErrors.file = 'File is required.'; 
        } 
    
        if (!header) { 
            newErrors.header = 'Header is required.'; 
        } 
    
        if (!caption) { 
            newErrors.caption = 'Caption is required.'; 
        }
    
        if (!content) { 
            newErrors.content = 'Content is required.'; 
        }
    
        setErrors(newErrors)
        
        if(Object.keys(newErrors).length === 0){
            try{
                setIsLoading(true)
                await addPost({ header, caption, content, file }, dirFile, file)
                
                document.getElementById('post-form')?.reset()
            }catch (error) {
                console.error(error)
            }finally {
                setIsLoading(false)
            }
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (files && files.length > 0) {
            const file = files[0].name
            setFilename(file);
            setDirFile(Array.from(files));
        } else {
            setFilename('No file chosen yet...')
        }
    }
    
    useEffect(() => onSnapshot(postCollection, (snapshot: QuerySnapshot<DocumentData >) => {
        setIsLoading(true)

        try{
            setPosts(
                snapshot.docs.map((doc) => {
                    const data = doc.data()
                    return {
                        id: doc.id,
                        header: data.header || '', // Add default values or handle potential undefined values
                        file: data.file || '',
                        caption: data.caption || '',
                        content: data.content || '',
                        timestamp: data.timestamp || '',
                    }
                })
            )
        }catch(error){
            console.error(error)
        }finally{
            setIsLoading(false)
        }
    }), [])

    return(
        <main className='pl-32 flex gap-4 flex-col py-6 pr-8'>
            <div className='w-full h-full p-2 space-y-5'>
                <form id='post-form' onSubmit={(e) => validateForm(e)} className='p-5 rounded widgets'>
                    <div className='flex flex-row-reverse justify-between'>
                        <div className='flex items-end justify-items-end'>
                            <button type={'submit'}  className='bg-red-600 h-14 flex justify-center items-center space-x-3 hover:bg-red-800 outline-0 transition delay-150 duration-300 ease-in-out p-3 rounded-md text-base font-medium'>
                                <span>{isLoading ? 'Post Uploading...' : 'Upload Post'}</span>
                                {isLoading ? <Icon icon="svg-spinners:180-ring-with-bg" style={{ fontSize: '24px' }} /> : <Icon icon="line-md:cloud-up" style={{ fontSize: '24px' }} />}
                            </button>
                        </div>
                        <div className='pt-2 w-1/3 flex flex-col'>
                            <label htmlFor='file' className='flex justify-between'>
                                <span className='text-base font-semibold'>Photo Content</span>
                                {errors.file && <span className='flex justify-center items-center space-x-1.5 text-pink-500 font-medium'>
                                    <Icon icon="line-md:alert-circle" />
                                    <span>{errors.file}</span>
                                </span>}
                            </label>
                            <input id='file' name='file' className={`${errors.file ? 'ring-pink-700 ring-2' : 'focus:ring-blue-500 focus:ring-2'} w-full bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`} type='file' placeholder='Insert image here' accept='.png, .jpg' onChange={handleFileChange} />
                        </div>
                    </div>
                    <div className='flex w-full space-x-4'>
                        <div className='pt-2 w-full flex flex-col'>
                            <label htmlFor='header' className='flex justify-between'>
                                <span className='text-base font-semibold'>Header</span>
                                {errors.header && <span className='flex justify-center items-center space-x-1.5 text-pink-500 font-medium'>
                                    <Icon icon="line-md:alert-circle" />
                                    <span>{errors.header}</span>
                                </span>}
                            </label>
                            <input id='header' name='header' className={`${errors.header ? 'ring-pink-700 ring-2' : 'focus:ring-blue-500 focus:ring-2'} w-full bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`} type='text' placeholder='Header here' onChange={(e) => setHeader(e.target.value)} />
                        </div>
                        <div className='pt-2 w-full flex flex-col'>
                            <label htmlFor='caption' className='flex justify-between'>
                                <span className='text-base font-semibold'>Caption</span>
                                {errors.caption && <span className='flex justify-center items-center space-x-1.5 text-pink-500 font-medium'>
                                    <Icon icon="line-md:alert-circle" />
                                    <span>{errors.caption}</span>
                                </span>}
                            </label>
                            <input id='caption' name='caption' className={`${errors.caption ? 'ring-pink-700 ring-2' : 'focus:ring-blue-500 focus:ring-2'} w-full bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`} type='text' placeholder='Caption here' onChange={(e) => setCaption(e.target.value)} />
                        </div>
                    </div>
                    
                    <div className='pt-2 flex flex-col'>
                        <label htmlFor='content' className='flex justify-between'>
                            <span className='text-base font-semibold'>Content</span>
                            {errors.content && <span className='flex justify-center items-center space-x-1.5 text-pink-500 font-medium'>
                                <Icon icon="line-md:alert-circle" />
                                <span>{errors.content}</span>
                            </span>}
                        </label>
                        <textarea id='content' name='content' className={`${errors.content ? 'ring-pink-700 ring-2' : 'focus:ring-blue-500 focus:ring-2'} w-full bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`} placeholder='Provide content here' rows={8} onChange={(e) => setContent(e.target.value)} ></textarea>
                    </div>
                </form>

                <section className='p-5 rounded widgets'>
                    <h1 className='text-xl text-slate-100 font-semibold w-full'>Library Posts</h1>
                    <div className='w-full rounded p-2 bg-slate-500 flex'>
                        <span className='w-full font-medium'>Header</span>
                        <span className='w-full font-medium text-center'>Created At</span>
                        <span className='w-full text-end font-medium'>Action</span>
                    </div>
                    {posts.map((post, index) => (
                        <Post key={index} post={post} />
                    ))}
                </section>
            </div>
        </main>
    )
} 