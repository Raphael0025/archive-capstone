import React, {useEffect, useRef} from 'react'
import Link from 'next/link'

interface PDFThumbnailProps {
  data: {
    url: string;
    title: string;
    id: string;
  };
  width: string;
  height: string;
}

const PDFThumbnail: React.FC<PDFThumbnailProps> = ({data, width, height}) => {
  const { url, title, id } = data;
  
  return (
    <Link href={`/publications/${id}`} className='rounded text-slate-100 p-2 cursor-pointer flex items-center justify-center gradient-link grad-1' style={{width: `${width}`, height: `${height}`}}>
      <h2 className='font-medium text-l text-black text-center'>{title}</h2>
      {/* <embed src={url + '#toolbar=0&page=1'} width={width} height={height}  /> */}
    </Link>
  );
};

export default PDFThumbnail;