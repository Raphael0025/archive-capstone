'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { firestore, registerUser } from '../../../lib/controller'
import { RegistrationError, UserRegisteration } from '../../../types/document'
import { Icon } from '@iconify/react';

export default function Registration(){
    
    const [userName, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [fullName, setFullName] = useState<string>('')
    const [studID, setStudID] = useState<string>('')
    const [email, setEmail] = useState<string>('')

    const [errors, setErrors] = useState<RegistrationError>({})
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const router = useRouter();

    const validateForm = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let newErrors: RegistrationError = {};
    
        if (!userName) { 
            newErrors.userName = 'User Name is required.'; 
        } 
    
        if (!password) { 
            newErrors.password = 'Password is required.'; 
        } 

        if (!email) { 
            newErrors.email = 'Email is required.'; 
        } 
    
        if (!fullName) { 
            newErrors.fullName = 'Full Name is required.'; 
        }
        
        if (!studID) { 
            newErrors.studID = 'Student ID is required.'; 
        }
    
        setErrors(newErrors)
        
        if(Object.keys(newErrors).length === 0){
            try{
                setIsLoading(true)
                const userId = await registerUser({
                    userName,
                    password,
                    fullName,
                    studID,
                    email,
                })

                router.push('/login')
            }catch (error) {
                console.error(error)
            }finally {
                setIsLoading(false)
            }
        }
    }

    return(
        <main className="w-full h-dvh grid place-items-center p-8 bg-cover login-library">
            <section className='lg:w-1/2 md:w-3/4 sm:full p-8 h-fit flex flex-col bg-maroon rounded'>
                <div className='w-full flex justify-center flex-col '>
                    <form onSubmit={(e) => validateForm(e)}>
                        <h2 className='font-bold text-3xl py-3'>Register an account</h2>
                        <div className='pt-2 w-full grid lg:grid-cols-3 grid-cols-1 gap-4 place-content-between'>
                            <div className='pt-2 flex flex-col'>
                                <label htmlFor='studID' className='flex justify-between'>
                                    <span className='text-base font-semibold'>Student ID</span>
                                </label>
                                <input id='studID' name='studID' className={`${errors.studID ? 'ring-pink-700 ring-2' : 'focus:ring-blue-500 focus:ring-2'} w-full bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`} type='text' placeholder='Provide Student ID here' onChange={(e) => setStudID(e.target.value)} />
                                {errors.studID && <span className='flex justify-end items-center space-x-1.5 text-red-950 font-medium'>
                                    <Icon icon="line-md:alert-circle" />
                                    <span>{errors.studID}</span>
                                </span>}
                            </div>

                            <div className='pt-2 flex flex-col'>
                                <label htmlFor='fullName' className='flex justify-between'>
                                    <span className='text-base font-semibold'>Full Name</span>
                                </label>
                                <input id='fullName' name='fullName' className={`${errors.fullName ? 'ring-pink-700 ring-2' : 'focus:ring-blue-500 focus:ring-2'} w-full bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`} type='text' placeholder='Provide Full Name here' onChange={(e) => setFullName(e.target.value)} />
                                {errors.fullName && <span className='flex justify-end items-center space-x-1.5 text-red-950 font-medium'>
                                    <Icon icon="line-md:alert-circle" />
                                    <span>{errors.fullName}</span>
                                </span>}
                            </div>

                            <div className='pt-2 flex flex-col'>
                                <label htmlFor='userName' className='flex justify-between'>
                                    <span className='text-base font-semibold'>User Name</span>
                                </label>
                                <input id='userName' name='userName' className={`${errors.userName ? 'ring-pink-700 ring-2' : 'focus:ring-blue-500 focus:ring-2'} w-full bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`} type='text' placeholder='Provide User Name here' onChange={(e) => setUsername(e.target.value)} />
                                {errors.userName && <span className='flex justify-end items-center space-x-1.5 text-red-950 font-medium'>
                                    <Icon icon="line-md:alert-circle" />
                                    <span>{errors.userName}</span>
                                </span>}
                            </div>
                        </div>

                        
                        <div className='pt-2 w-full grid lg:grid-cols-2 grid-cols-1 gap-4 place-content-between'>
                            <div className='pt-2 w-full flex flex-col'>
                                <label htmlFor='email' className='flex justify-between'>
                                    <span className='text-base font-semibold'>Email</span>
                                </label>
                                <input id='email' name='email' className={`${errors.email ? 'ring-pink-700 ring-2' : 'focus:ring-blue-500 focus:ring-2'} w-full bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`} type='email' placeholder='Provide Email here' onChange={(e) => setEmail(e.target.value)} />
                                {errors.email && <span className='flex justify-end items-center space-x-1.5 text-red-950 font-medium'>
                                    <Icon icon="line-md:alert-circle" />
                                    <span>{errors.email}</span>
                                </span>}
                            </div>

                            <div className='pt-2 w-full flex flex-col'>
                                <label htmlFor='password' className='flex justify-between'>
                                    <span className='text-base font-semibold'>Password</span>
                                </label>
                                <input id='password' name='password' className={`${errors.password ? 'ring-pink-700 ring-2' : 'focus:ring-blue-500 focus:ring-2'} w-full bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`} type='password' placeholder='Provide password here' onChange={(e) => setPassword(e.target.value)} />
                                {errors.password && <span className='flex justify-end items-center space-x-1.5 text-red-950 font-medium'>
                                    <Icon icon="line-md:alert-circle" />
                                    <span>{errors.password}</span>
                                </span>}
                            </div>
                        </div>
                        


                        <div className='w-full grid pt-3 justify-items-start'>
                            <button type={'submit'}  className='bg-neutral-900 flex justify-center items-center space-x-3 hover:bg-zinc-700 outline-0 transition delay-150 duration-300 ease-in-out p-3 rounded-md text-base font-medium'>
                                <span>{isLoading ? 'Creating Account...' : 'Register'}</span>
                                {isLoading ? <Icon icon="svg-spinners:180-ring-with-bg" style={{ fontSize: '24px' }} /> : <Icon icon="ic:baseline-log-in" style={{ fontSize: '24px' }} />}
                            </button>
                        </div>
                        <div className='w-full pt-3 flex justify-center space-x-4'>
                            <span className='text-xs'> Already Have an Account?</span> 
                            <Link href='/login' className='text-xs hover:text-sky-400'>Sign-in here</Link>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    )
}