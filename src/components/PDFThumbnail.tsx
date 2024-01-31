import React from 'react';

interface PDFThumbnailProps {
  data: {
    url: string;
    title: string;
    id: string;
  };
}

const PDFThumbnail: React.FC<PDFThumbnailProps> = ({ data }) => {
  const { url, title, id } = data;

  console.log(url)
  return (
    <div>
      <iframe src={url} title="Iframe Example" width='200px' height='260px' />
      <h2 className='font-medium'>{title}</h2>
    </div>
  );
};

export default PDFThumbnail;