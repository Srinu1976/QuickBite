import React, { useContext } from 'react'
import {Link} from 'react-router-dom';
import '../styles/thank-you.css'
import { AuthContext } from '../context/AuthContext';

const ThankYou = () => {
  const {user} = useContext(AuthContext)
  return (
    <div className="container">
        <div className='row'>
            <div className="col-lg-12 col-12 pt-5 text-center">
                <div className='thank-you'>
                    <span><i className='ri-checkbox-circle-line'></i></span>
                    <h1 className='mb-3 fw-semibold'>Thank You</h1>
                    <h3 className='mb-4'>Your Order Is Being Prepared.</h3>
                    <Link to={`/my-orders/${user._id}`} className='btn back-btn w-25'>My Orders</Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ThankYou