'use client'

import React from 'react';

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

import { useState } from 'react';

export default function PDFViwer(){
  
  return (
    <div className="pl-32 flex gap-4 flex-col py-6 pr-6 ">
        <h1 className='text-xl font-semibold'>PDF Viewer</h1>
        <div className='w-52 p-2 text-black hover:scale-110 transition delay-150 duration-300 ease-in-out rounded-md bg-slate-200'>
          
          <div className='w-full flex flex-col justify-center items-center'>
            <h1 className='text-xl'>Sample Title</h1>
            <figcaption>Sample caption</figcaption>
          </div>
        </div>
    </div>
  );
};
