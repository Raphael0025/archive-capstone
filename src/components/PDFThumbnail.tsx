import React from 'react';

interface PDFThumbnailProps {
  fileUrl: string;
  title: string;
  id: string;
}

const PDFThumbnail: React.FC<PDFThumbnailProps> = ({ fileUrl, title, id }) => {
  return (
    <div>
      <iframe frameBorder='0' src={fileUrl} title="Iframe Example" width='200px' height='260px' />
      <h2 className='font-medium'>{title}</h2>
    </div>
  );
};

export default PDFThumbnail;