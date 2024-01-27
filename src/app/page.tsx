import Image from 'next/image'

export default function Home() {
    return (
        <main className='w-full h-dvh pt-16 grid gap-5'>
          <div className='w-full bg-cover library h-36' />
          <div className='widgets w-full h-screen p-12 px-24 flex'>
            <div className='w-full grid gap-3'>
              <h1 className='text-lg'>Latest Announcements</h1>
              <div>
                
              </div>
            </div>
            <div className='w-full'>
              <h1 className='text-lg'>Latest Published</h1>
              <div>
                
              </div>
            </div>
          </div>
        </main>
    )
}
