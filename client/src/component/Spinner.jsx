import React from 'react'
import ReactLoading from 'react-loading';


const Spinner = () => {
  return (
    <div className="container w-25 d-flex align-items-center min-vh-100 justify-content-center">
        <ReactLoading type="spin" color="var(--primary-color)" height={'20%'} width={'20%'} />
      </div>
  )
}

export default Spinner