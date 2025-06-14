import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'


function Sidebar() {
  return (
    <div className='w-[18%] min-h-screen border-r-1'>
        <div className='flex flex-col gap-5 pt-6 pl-[20%] text-[15px]'>
            <NavLink to="/add" className='flex gap-3 items-center border border-gray-300 brder-r-0 px-3 py-2 rounded-1 '>
                <img className='w-5 h-5' src={assets.add_icon} alt="add-icon" />
                <p className='hidden md:block'>Add Product</p>
            </NavLink>
            <NavLink to="/list" className='flex gap-3 items-center border border-gray-300 brder-r-0 px-3 py-2 rounded-1 '>
                <img className='w-5 h-5' src={assets.order_icon} alt="add-icon" />
                <p className='hidden md:block'>List Items</p>
            </NavLink>
            <NavLink to="/orders" className='flex gap-3 items-center border border-gray-300 brder-r-0 px-3 py-2 rounded-1 '>
                <img className='w-5 h-5' src={assets.parcel_icon} alt="add-icon" />
                <p className='hidden md:block'>Orders</p>
            </NavLink>
            <NavLink to="/messages" className='flex gap-3 items-center border border-gray-300 brder-r-0 px-3 py-2 rounded-1 '>
                <img className='w-5 h-5' src={assets.parcel_icon} alt="add-icon" />
                <p className='hidden md:block'>Messages</p>
            </NavLink>
        </div>

    </div>
  )
}

export default Sidebar