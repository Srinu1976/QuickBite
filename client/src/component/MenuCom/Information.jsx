import React from 'react';

const Information = ({ isOpen, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      // Close the modal only if the overlay (background) is clicked directly
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-gray-800 bg-opacity-50" onClick={handleOverlayClick}>
      <div className="bg-white shadow-2xl p-6 rounded-lg w-96">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          Information
        </button>
        <div className='text-left'>
          <h3 className="text-2xl font-bold mb-4 text-center">Information</h3>
          <div>
            <h3 className='text-lg font-medium mb-2'>Minimum Order For Delivery</h3>
            <ul className='ml-4 flex flex-col gap-1'>
              <li className='text-sm font-light list-disc'>£0.00 SR1</li>
              <li className='text-sm font-light list-disc'>£0.00 SR2</li>
              <li className='text-sm font-light list-disc'>£0.00 SR3</li>
              <li className='text-sm font-light list-disc'>£0.00 SR4</li>
              <li className='text-sm font-light list-disc'>£0.00 SR5</li>
              <li className='text-sm font-light list-disc'>£0.00 SR6</li>
            </ul>
          </div>
          <div className="mt-2">
            <h3 className='text-lg font-medium mb-2'>Payment Methods Accepted</h3>
            <ul className='ml-4 flex flex-col gap-1'>
              <li className='text-sm font-light list-disc'>Cash</li>
              <li className='text-sm font-light list-disc'>Debit/Credit Card</li>
              <li className='text-sm font-light list-disc'>PayPal Express (Credit Cards And Debit Cards)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Information;
