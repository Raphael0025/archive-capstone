'use client'

import React from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

import { useState } from 'react';

export default function PDFViwer(){
    const pdfUrl = 'https://firebasestorage.googleapis.com/v0/b/fire-project-d6eda.appspot.com/o/Documents%2FResearch%20Paper%2F04_Worksheet_1_Del_Mundo.pdf?alt=media&token=7a980916-1bb0-46fb-acdd-e68f16b865b1'

    return (
    <div className='w-52 p-2 text-black hover:scale-110 transition delay-150 duration-300 ease-in-out rounded-md bg-slate-200'>
        <Document file={pdfUrl} className='w-48'>
            <Page pageNumber={1} height={280} width={192} />
        </Document>
        <div className='w-full flex flex-col justify-center items-center'>
            <h1 className='text-xl'>Sample Title</h1>
            <figcaption>Sample caption</figcaption>
        </div>
    </div>
    );
};
