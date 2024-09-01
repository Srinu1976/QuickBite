import React from 'react'

const Information = () => {
  return (
    <div className="">
            <div className="">
                <div className='modal-content'>
                    <h3 className="title">Information</h3>
                    <div>
                        <h3 className='section-title'>Home Delivery</h3>
                        <ul className='list'>
                            <li className='list-item'>Approx: 45 min</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className='section-title'>Collection</h3>
                        <ul className='list'>
                            <li className='list-item'>Approx: 15 min</li>
                        </ul>
                    </div>
                    <div className="mt-2">
                        <h3 className='section-title'>Payment Methods Accepted</h3>
                        <ul className='list'>
                            <li className='list-item'>Cash</li>
                            <li className='list-item'>Debit/Credit Card</li>
                            <li className='list-item'>PayPal Express (Credit Cards And Debit Cards)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default Information
