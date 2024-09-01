import React from 'react'
import AdminRouters from '../../router/AdminRouters.jsx'
import Sidebar from '../../AdminPanel/component/Sidebar.jsx'

const AdminLayout = () => {
  return (
    <div className='d-flex'>
      <Sidebar/>
      <AdminRouters/>
      <div className='end-point-space d-block' style={{width:"10px"}}></div>
    </div>
  )
}

export default AdminLayout