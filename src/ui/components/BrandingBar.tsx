import React from 'react';
import Dialog from './Dialog';
import { handleCloseClick } from '../pages/Home';


const BrandingBar: React.FC = () => {
  return (
    <div className="absolute -top-10 -left-7 right-0 flex justify-between items-center p-4">
      <div className="text-white font-bold text-2xl">
        <Dialog handleClose={handleCloseClick} />
      </div>
      
      <div className="text-white text-2xl ">
        <span className="text-blue-300">one</span>
        <span className="text-blue-100">room</span>
      </div>
    </div>
  );
};

export default BrandingBar;