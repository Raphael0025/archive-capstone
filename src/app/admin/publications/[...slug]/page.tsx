'use client' 

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { updateDocData, firestore } from '../../../../lib/controller'
import { UpdateFormErrors } from '../../../../types/document'
import { Icon } from '@iconify/react';
import { doc, getDoc } from 'firebase/firestore'
import { useArticles } from '@/context/ArticleContext'

interface ArticleProps {
    params: { slug: string[] }; // Adjust the type according to your actual data structure
}

export default function Article({params}: ArticleProps){
    const {data: allBooks} = useArticles()

    const [file, setFilename] = useState<string>('No file chosen yet...')
    const [title, setTitle] = useState<string>('')
    const [authors, setAuthors] = useState<string>('')
    const [category, setCategory] = useState<string>('')
    const [field, setField] = useState<string>('')
    const [advisor, setAdvisor] = useState<string>('')
    const [dirFile, setDirFile] = useState<File[]>([])
    const [errors, setErrors] = useState<UpdateFormErrors>({})
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [oldCategory, setOldCategory] = useState<string>('')
    const [oldFile, setOldFile] = useState<string>('No file chosen yet...')
    const [articleId, setArticleId] = useState<string>('')

    const router = useRouter();

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/\s+/g, '-');
    }

    useEffect(() => {
        if (!allBooks) {
            return;
        }
        const slug = decodeURIComponent(params.slug[0]);
        console.log('Slug from params:', slug);

        const fetchData = async () => {
            const article = allBooks.find(article => generateSlug(article.title) === slug);

            if (article) {
                const { id, title, file, authors, category, field, advisor } = article;
                setArticleId(id);
                setTitle(title);
                setFilename(file);
                setAuthors(authors);
                setCategory(category);
                setField(field);
                setAdvisor(advisor);
                setOldFile(file);
                setOldCategory(category);
            }
        };
        fetchData();
    }, [allBooks, params.slug]);

    const validateForm = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('changed click in validate form')
        let newErrors: UpdateFormErrors = {};
    
        if (!file || file === 'No file chosen yet...') { 
            newErrors.file = 'File is required.'; 
        } 
    
        if (!title) { 
            newErrors.title = 'Title is required.'; 
        } 
    
        if (!authors) { 
            newErrors.authors = 'Authors is required.'; 
        }
    
        if (!category) { 
            newErrors.category = 'Category is required.'; 
        }

        if (!field) {
            newErrors.field = 'Degree Field is required.';
        }
    
        if (!advisor) { 
            newErrors.advisor = 'Advisor is required.'; 
        }
    
        setErrors(newErrors)
        
        if(Object.keys(newErrors).length === 0){
            console.log('just in case to click after 2')
            try{
                setIsLoading(true)
                await updateDocData(articleId, { title, authors, category, field, advisor, file}, dirFile, oldCategory, category, file, oldFile)

                router.push('/admin/publications')
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
        <main className="pl-32 flex gap-4 flex-col py-6 pr-8 ">
            <div>
                <h1 className='text-xl font-semibold'>Update Document</h1>
            </div>
            <form onSubmit={(e) => validateForm(e)} className='w-full p-5 widgets border-dashed border border-slate-300 rounded-md'>
                <div className='w-full grid justify-items-end'>
                    <button type={'submit'} className='bg-red-600 flex justify-center items-center space-x-3 hover:bg-red-800 outline-0 transition delay-150 duration-300 ease-in-out p-3 rounded-md text-base font-medium'>
                        <span>{isLoading ? 'Updating...' : 'Update'}</span>
                        {isLoading ? <Icon icon="svg-spinners:180-ring-with-bg" style={{ fontSize: '24px' }} /> : <Icon icon="line-md:cloud-up" style={{ fontSize: '24px' }} />}
                    </button>
                </div>
                <div className='flex flex-col'>
                    <label htmlFor='doc-file' className='w-1/3 flex justify-between'>
                        <span className='text-base font-semibold'>Document File</span>
                        {errors.file === 'File is required.' 
                            ? <span className='text-pink-500 flex justify-center items-center space-x-1.5 font-medium'>
                                <Icon icon="line-md:alert-circle" />
                                <span>{errors.file}</span>
                            </span> 
                            : null}
                    </label>
                    <div className='flex items-center space-x-6'>
                        <input id='doc-file' name='doc-file' hidden={true} type='file' accept='.pdf' onChange={handleFileChange} />
                        <span id='custom-file-input' className={`${errors.file === 'File is required.' ? 'ring-pink-700 ring-2' : ''} w-1/3 bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`}>
                            {file}
                        </span>
                        <label htmlFor='doc-file' className='flex justify-center items-center space-x-3 cursor-pointer bg-red-600 hover:bg-red-800 transition delay-150 duration-300 ease-in-out p-2 rounded-md text-base font-medium' > 
                            <span>Choose a file</span>
                            <Icon icon={'line-md:text-box-multiple'} style={{fontSize: '24px'}} />
                        </label>
                    </div>
                </div>

                <div className='pt-2'>
                    <h1 className='pt-2 font-bold text-base text-gray-400'>Authorship</h1>
                    <div className='pt-2 flex flex-col'>
                        <label htmlFor='title' className='flex justify-between'>
                            <span className='text-base font-semibold'>Title</span>
                            {errors.title && <span className='flex justify-center items-center space-x-1.5 text-pink-500 font-medium'>
                                <Icon icon="line-md:alert-circle" />
                                <span>{errors.title}</span>
                            </span>}
                        </label>
                        <input id='title' name='title' className={`${errors.title ? 'ring-pink-700 ring-2' : 'focus:ring-blue-500 focus:ring-2'} w-full bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`} type='text' value={title} placeholder='Provide capstone title here' onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className='pt-2 flex w-full justify-between space-x-6'>
                        <div className='flex flex-col w-full'>
                            <label htmlFor='authors' className='flex justify-between'>
                                <span className='text-base font-semibold'>Author(s)</span>
                                {errors.authors && <span className='flex justify-center items-center space-x-1.5 text-pink-500 font-medium'>
                                    <Icon icon="line-md:alert-circle" />
                                    <span>{errors.authors}</span>
                                </span>}
                            </label>
                            <input id='authors' name='authors' className={`${errors.authors ? 'ring-pink-700 ring-2' : 'focus:ring-blue-500 focus:ring-2'} w-full bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`} type='text' placeholder='Provide author(s) here' onChange={(e) => setAuthors(e.target.value)} value={authors} />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label htmlFor='category' className='flex justify-between'>
                                <span className='text-base font-semibold'>Category</span>
                                {errors.category && <span className='flex justify-center items-center space-x-1.5 text-pink-500 font-medium'>
                                    <Icon icon="line-md:alert-circle" />
                                    <span>{errors.category}</span>
                                </span>}
                            </label>
                            <select name='category' id='category' value={category} onChange={(e) => setCategory(e.target.value)} className={`${errors.category ? 'ring-pink-700 ring-2' : 'focus:ring-blue-500 focus:ring-2'} w-full bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`} >
                                <option className='text-gray-500' value='' disabled>Select category</option>
                                <option value='Software'>Software</option>
                                <option value='Hardware'>Hardware</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className='pt-2'>
                    <h1 className='pt-2 font-bold text-base text-gray-400'>Academic Details</h1>
                    <div className='pt-2 w-full flex justify-between space-x-6'>
                        <div className='flex flex-col w-full'>
                            <label htmlFor='field' className='flex justify-between'>
                                <span className='text-base font-semibold'>Degree Field</span>
                                {errors.field && <span className='flex justify-center items-center space-x-1.5 text-pink-500 font-medium'>
                                    <Icon icon="line-md:alert-circle" />
                                    <span>{errors.field}</span>
                                </span>}
                            </label>
                            <input id='field' name='field' className={`${errors.field ? 'ring-pink-700 ring-2' : 'focus:ring-blue-500 focus:ring-2'} w-full bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`} type='text' placeholder='Specify Degree Field' onChange={(e) => setField(e.target.value)} value={field} />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label htmlFor='advisor' className='flex justify-between'>
                                <span className='text-base font-semibold'>Advisor</span>
                                {errors.advisor && <span className='flex justify-center items-center space-x-1.5 text-pink-500 font-medium'>
                                    <Icon icon="line-md:alert-circle" />
                                    <span>{errors.advisor}</span>
                                </span>}
                            </label>
                            <input id='advisor' name='advisor' className={`${errors.advisor ? 'ring-pink-700 ring-2' : 'focus:ring-blue-500 focus:ring-2'} w-full bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`} type='text' placeholder='Provide Advisor`s name' onChange={(e) => setAdvisor(e.target.value)} value={advisor} />
                        </div>
                    </div>
                </div>
            </form>
        </main>
    )
}