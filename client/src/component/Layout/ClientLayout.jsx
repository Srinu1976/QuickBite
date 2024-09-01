import React from 'react'
import Header from '../Header/Header.jsx'
import Routers from '../../router/Routers'
import Footer from '../Footer/footer.jsx'

const ClientLayout = () => {
  return (
    <div>
        <Header/>
        <Routers/>
        <Footer/>
    </div>
  )
}

export default ClientLayout