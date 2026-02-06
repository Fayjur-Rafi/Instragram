import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from './LeftSidebar'

const MainLayout = () => {
  return (
    <div>
        <LeftSidebar/>
        <div className='ml-[260px]'> {/* Added left margin to offset fixed sidebar */}
            <Outlet/>
        </div>
    </div>
  )
}

export default MainLayout