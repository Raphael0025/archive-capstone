'use client' 

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { updateDoc, firestore } from '../../../../lib/controller'
import { UpdateFormErrors } from '../../../../types/document'
import { Icon } from '@iconify/react';
import { doc, getDoc } from 'firebase/firestore'

interface ArticleProps {
    params: { id: string }; // Adjust the type according to your actual data structure
}

export default function Article({params}: ArticleProps){

    const docData = doc(firestore, `eBooks/${params.id}`)

    const [file, setFilename] = useState<string>('No file chosen yet...')
    const [title, setTitle] = useState<string>('')
    const [authors, setAuthors] = useState<string>('')
    const [category, setCategory] = useState<string>('')
    const [abstract, setAbstract] = useState<string>('')
    const [field, setField] = useState<string>('')
    const [level, setLevel] = useState<string>('')
    const [advisor, setAdvisor] = useState<string>('')
    const [resourceType, setResourceType] = useState<string>('')
    const [dirFile, setDirFile] = useState<File[]>([])
    const [errors, setErrors] = useState<UpdateFormErrors>({})
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [oldCategory, setOldCategory] = useState<string>('')
    const [oldResource, setOldResource] = useState<string>('')
    const [oldFile, setOldFile] = useState<string>('No file chosen yet...')

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const docSnap = await getDoc(docData)

            if(docSnap.exists()){
                const { title, file, authors, category, abstract, field, level, advisor, resourceType } = docSnap.data()
                setTitle(title)
                setFilename(file)
                setAuthors(authors)
                setCategory(category)
                setAbstract(abstract)
                setField(field)
                setLevel(level)
                setAdvisor(advisor)
                setResourceType(resourceType)
                setOldFile(file)
                setOldCategory(category)
                setOldResource(resourceType)
            }
        }
        fetchData()
    }, [params.id, docData])

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
    
        if (!abstract) { 
            newErrors.abstract = 'Abstract is required.'; 
        }
    
        if (!level) { 
            newErrors.level = 'Degree Level is required.'; 
        }

        if (!field) {
            newErrors.field = 'Degree Field is required.';
        }
    
        if (!advisor) { 
            newErrors.advisor = 'Advisor is required.'; 
        }
    
        if (!resourceType) { 
            newErrors.resourceType = 'Resource Type is required.'; 
        }
        setErrors(newErrors)
        
        if(Object.keys(newErrors).length === 0){
            console.log('just in case to click after 2')
            try{
                setIsLoading(true)
                await updateDoc(params.id, { title, authors, category, abstract, field, level, advisor, file, resourceType}, dirFile, oldCategory, category, file, oldFile, resourceType, oldResource)

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
                    <div className='pt-2 flex flex-col'>
                        <label htmlFor='abstract' className='flex justify-between'>
                            <span className='text-base font-semibold'>Abstract</span>
                            {errors.abstract && <span className='flex justify-center items-center space-x-1.5 text-pink-500 font-medium'>
                                <Icon icon="line-md:alert-circle" />
                                <span>{errors.abstract}</span>
                            </span>}
                        </label>
                        <textarea id='abstract' name='abstract' className={`${errors.abstract ? 'ring-pink-700 ring-2' : 'focus:ring-blue-500 focus:ring-2'} w-full bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`} value={abstract} placeholder='Provide Abstract here' rows={8} onChange={(e) => setAbstract(e.target.value)} ></textarea>
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
                            <label htmlFor='levellevel' className='flex justify-between'>
                                <span className='text-base font-semibold'>Degree Level</span>
                                {errors.level && <span className='flex justify-center items-center space-x-1.5 text-pink-500 font-medium'>
                                    <Icon icon="line-md:alert-circle" />
                                    <span>{errors.level}</span>
                                </span>}
                            </label>
                            <select name='level' id='level' value={level} onChange={(e) => setLevel(e.target.value)} className={`${errors.level ? 'ring-pink-700 ring-2' : 'focus:ring-blue-500 focus:ring-2'} w-full bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`} >
                                <option className='text-gray-500' value='' disabled >Select Degree Level</option>
                                <option value='Bachelor'>Bachelor&rsquo;s</option>
                                <option value='Masteral'>Masteral</option>
                                <option value='Doctoral'>Doctoral</option>
                            </select>
                        </div>
                    </div>
                    <div className='pt-2 w-full flex justify-between space-x-6'>
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
                        <div className='flex flex-col w-full'>
                            <label htmlFor='resourceType' className='flex justify-between'>
                                <span className='text-base font-semibold'>Resource Type</span>
                                {errors.resourceType && <span className='flex justify-center items-center space-x-1.5 text-pink-500 font-medium'>
                                    <Icon icon='line-md:alert-circle' />
                                    <span>{errors.resourceType}</span>
                                </span>}
                            </label>
                            <select name='resourceType' id='resourceType' value={resourceType} onChange={(e) => setResourceType(e.target.value)} className={`${errors.resourceType ? 'ring-pink-700 ring-2' : 'focus:ring-blue-500 focus:ring-2'} w-full bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`} >
                                <option className='text-gray-500' value='' disabled>Select type of resource</option>
                                <option value='Research Paper'>Research Paper</option>
                                <option value='Thesis'>Thesis</option>
                                <option value='Capstone'>Capstone</option>
                                <option value='Dissertation'>Dissertation</option>
                            </select>    
                        </div>
                    </div>
                </div>
            </form>
        </main>
    )
}