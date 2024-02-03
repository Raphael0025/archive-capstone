'use client' 

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { updatePost, firestore } from '../../../../lib/controller'
import { PostFormError, PostType } from '../../../../types/document'
import { Icon } from '@iconify/react';
import { doc, getDoc, serverTimestamp  } from 'firebase/firestore'


interface PostProps {
    params: { id: string }; // Adjust the type according to your actual data structure
}

export default function Page({params}: PostProps) {
    const docData = doc(firestore, `announcements/${params.id}`)
    
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [file, setFilename] = useState<string>('No file chosen yet...')
    const [oldFile, setOldFile] = useState<string>('')
    const [dirFile, setDirFile] = useState<File[]>([])
    const [errors, setErrors] = useState<PostFormError>({})
    const [header, setHeader] = useState<string>('')
    const [caption, setCaption] = useState<string>('')
    const [content, setContent] = useState<string>('')
    
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const docSnap = await getDoc(docData)

            if(docSnap.exists()){
                const { header, caption, content, file } = docSnap.data()
                setHeader(header)
                setCaption(caption)
                setContent(content)
                setFilename(file)
                setOldFile(file)
            }
        }
        fetchData()
    }, [params.id, docData])

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
                const postData: PostType = {
                    id: params.id, // Assuming you have access to the post ID
                    url: '', // Provide the URL if available
                    header,
                    caption,
                    content,
                    file,
                  };

                await updatePost(params.id, postData, dirFile, file, oldFile)

                router.push('/admin/content-management')
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

    return(
        <div className='pl-32 flex gap-4 flex-col py-6 pr-8'>
            <form id='post-form' onSubmit={(e) => validateForm(e)} className='p-5 rounded widgets'>
                <div className='flex flex-row-reverse justify-between'>
                    <div className='flex items-end justify-items-end'>
                        <button type={'submit'}  className='bg-red-600 h-14 flex justify-center items-center space-x-3 hover:bg-red-800 outline-0 transition delay-150 duration-300 ease-in-out p-3 rounded-md text-base font-medium'>
                            <span>{isLoading ? 'Saving...' : 'Save'}</span>
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
                        <input id='header' name='header' className={`${errors.header ? 'ring-pink-700 ring-2' : 'focus:ring-blue-500 focus:ring-2'} w-full bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`} value={header} type='text' placeholder='Header here' onChange={(e) => setHeader(e.target.value)} />
                    </div>
                    <div className='pt-2 w-full flex flex-col'>
                        <label htmlFor='caption' className='flex justify-between'>
                            <span className='text-base font-semibold'>Caption</span>
                            {errors.caption && <span className='flex justify-center items-center space-x-1.5 text-pink-500 font-medium'>
                                <Icon icon="line-md:alert-circle" />
                                <span>{errors.caption}</span>
                            </span>}
                        </label>
                        <input id='caption' name='caption' className={`${errors.caption ? 'ring-pink-700 ring-2' : 'focus:ring-blue-500 focus:ring-2'} w-full bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`} value={caption} type='text' placeholder='Caption here' onChange={(e) => setCaption(e.target.value)} />
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
                    <textarea id='content' name='content' className={`${errors.content ? 'ring-pink-700 ring-2' : 'focus:ring-blue-500 focus:ring-2'} w-full bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`} placeholder='Provide content here' rows={8} onChange={(e) => setContent(e.target.value)} value={content}></textarea>
                </div>
            </form>
        </div>
    )
}