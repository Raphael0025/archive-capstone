'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { firestore, loginUser } from '../../../lib/controller'
import { LoginError } from '../../../types/document'
import { Icon } from '@iconify/react';

export default function Login(){
    
    const [userName, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const [errors, setErrors] = useState<LoginError>({})
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const router = useRouter();

    const validateForm = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let newErrors: LoginError = {};
    
        if (!userName) { 
            newErrors.userName = 'User Name is required.'; 
        } 
    
        if (!password) { 
            newErrors.password = 'Password is required.'; 
        } 
    
        setErrors(newErrors)
        
        if(Object.keys(newErrors).length === 0){
            try{
                setIsLoading(true)
                const user = await loginUser(userName, password)
                if(user.role === 'admin' || user.role === 'employee'){
                    router.push('/admin/dashboard')
                } else {
                    router.push('/')
                }
            }catch (error) {
                console.error(error)
            }finally {
                setIsLoading(false)
            }
        }
    }

    return(
        <main className="w-full h-dvh flex">
            <section className='w-1/4 px-6 pt-8 h-full flex flex-col bg-maroon'>
                <div className='flex justify-center items-center px-3 w-full'>
                    <Image className='imageWithShadow' priority src="/logo.png" alt="School Logo" width={100} height={100} />
                </div>
                <div className='w-full flex justify-center pt-8 flex-col '>
                    <h2 className='font-bold text-3xl text-center pb-4'>E-Capstone Portal</h2>
                    <form onSubmit={(e) => validateForm(e)}>
                        <h2 className='font-semibold text-xl py-3'>Login to your account</h2>
                        <div className='pt-2 flex flex-col'>
                            <label htmlFor='userName' className='flex justify-between'>
                                <span className='text-base font-semibold'>User Name or Student ID</span>
                            </label>
                            <input id='userName' name='userName' className={`${errors.userName ? 'ring-pink-700 ring-2' : 'focus:ring-blue-500 focus:ring-2'} w-full bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`} type='text' placeholder='Provide User Name or Student ID here' onChange={(e) => setUsername(e.target.value)} />
                            {errors.userName && <span className='flex justify-end items-center space-x-1.5 text-red-950 font-medium'>
                                <Icon icon="line-md:alert-circle" />
                                <span>{errors.userName}</span>
                            </span>}
                        </div>

                        <div className='pt-2 flex flex-col'>
                            <label htmlFor='password' className='flex justify-between'>
                                <span className='text-base font-semibold'>Password</span>
                            </label>
                            <input id='password' name='password' className={`${errors.password ? 'ring-pink-700 ring-2' : 'focus:ring-blue-500 focus:ring-2'} w-full bg-slate-200 p-2 font-medium outline-0 rounded-md border border-slate-500  text-sm text-black`} type='password' placeholder='Provide password here' onChange={(e) => setPassword(e.target.value)} />
                            {errors.password && <span className='flex justify-end items-center space-x-1.5 text-red-950 font-medium'>
                                <Icon icon="line-md:alert-circle" />
                                <span>{errors.password}</span>
                            </span>}
                        </div>
                        <div className='w-full grid pt-3 justify-items-start'>
                            <button type={'submit'}  className='bg-neutral-900 flex justify-center items-center space-x-3 hover:bg-zinc-700 outline-0 transition delay-150 duration-300 ease-in-out p-3 rounded-md text-base font-medium'>
                                <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                                {isLoading ? <Icon icon="svg-spinners:180-ring-with-bg" style={{ fontSize: '24px' }} /> : <Icon icon="ic:baseline-log-in" style={{ fontSize: '24px' }} />}
                            </button>
                        </div>
                        <div className='w-full pt-3 flex justify-center space-x-4'>
                            <span className='text-xs'> Do not Have an Account yet?</span> 
                            <Link href='/registration' className='text-xs hover:text-sky-400'>Click here to Register</Link>
                        </div>
                    </form>
                </div>
            </section>
            <div className='w-3/4 p-2 bg-cover login-library' />
        </main>
    )
}