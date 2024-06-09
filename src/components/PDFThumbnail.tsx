import React, {useEffect, useRef} from 'react'
import Link from 'next/link'

interface PDFThumbnailProps {
  data: {
    url: string;
    title: string;
    slug: string;
  };
  width: string;
  height: string;
}

const PDFThumbnail: React.FC<PDFThumbnailProps> = ({data, width, height}) => {
  const { url, title, slug } = data;
  
  return (
    <Link href={`/publications/${slug}`} className='rounded text-slate-100 p-2 md:w-52 mb-5 md:mb-0 cursor-pointer flex items-center justify-center gradient-link grad-1' style={{ height: `300px`}}>
      <h2 className='font-medium text-l text-black text-center'>{title}</h2>
      {/* <embed src={url + '#toolbar=0&page=1'} width={width} height={height}  /> */}
    </Link>
  );
};

export default PDFThumbnail;