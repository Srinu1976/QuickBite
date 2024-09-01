import React from 'react';

const WorkingHours = ({ isOpen, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      // Close the modal only if the overlay (background) is clicked directly
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-gray-800 bg-opacity-50" onClick={handleOverlayClick}>
      <div className="bg-white shadow-2xl p-6 rounded-lg" style={{width:'300px'}}>
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <div className='text-left'>
          <h3 className="text-2xl font-bold mb-4 text-center">Working Hours</h3>
          <div className='flex gap-2 flex-col justify-center items-center'>
            <div className='flex justify-between w-full border-b border-[#000000af]' style={{width:'100%'}}>
                <h2 className='text-sm font-normal'>Sunday</h2>
                <p className='text-sm font-light'>15:45 - 01:00</p>
            </div>
            <div className='flex justify-between w-full border-b border-[#000000af]'>
                <h2 className='text-sm font-normal'>Monday</h2>
                <p className='text-sm font-light'>15:45 - 01:00</p>
            </div>
            <div className='flex justify-between w-full border-b border-[#000000af]'>
                <h2 className='text-sm font-normal'>Tuesday</h2>
                <p className='text-sm font-light'>15:45 - 01:00</p>
            </div>
            <div className='flex justify-between w-full border-b border-[#000000af]'>
                <h2 className='text-sm font-normal'>Wednesday</h2>
                <p className='text-sm font-light'>15:45 - 01:00</p>
            </div>
            <div className='flex justify-between w-full border-b border-[#000000af]'>
                <h2 className='text-sm font-normal'>Thursday</h2>
                <p className='text-sm font-light'>15:45 - 01:00</p>
            </div>
            <div className='flex justify-between w-full border-b border-[#000000af]'>
                <h2 className='text-sm font-normal'>Friday</h2>
                <p className='text-sm font-light'>15:45 - 01:00</p>
            </div>
            <div className='flex justify-between w-full border-b border-[#000000af]'>
                <h2 className='text-sm font-normal'>Saturday</h2>
                <p className='text-sm font-light'>15:45 - 01:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingHours;
