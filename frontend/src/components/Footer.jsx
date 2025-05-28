import React from 'react'
import { assets } from '../assets/assets'
import {Link} from 'react-router-dom'

function Footer() {
  return (
    <div>
    <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-12 sm:mt-10'>
        <div>
            <img className='w-[161px] h-[47px] mb-[20px]' src={assets.logo} alt="logo" />
            <p className=' text-[18px] leading-[30px] max-w-md'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
        </div>
        <div className='flex flex-col'>
            <Link to="/" className='font-semibold mb-[40px] text-[22px]'>COMPANY</Link>
            <Link to="/" className='mb-[8px] text-[18px] text-gray-700'>Home</Link>
            <Link to="/about" className='mb-[8px] text-[18px] text-gray-700'>About</Link>
            <Link to="/delivery" className='mb-[8px] text-[18px] text-gray-700'>Delivery</Link>
            <Link to="/privacy-policy" className='mb-[8px] text-[18px] text-gray-700'>Privacy policy</Link>
        </div>
        <div className='flex flex-col gap-1 '>
            <ul className='font-semibold mb-[40px] text-[22px]'>GET IN TOUCH</ul>
            <li className='mb-[8px] text-[18px] text-gray-700'>+1-212-456-7890</li>
            <li className='mb-[8px] text-[18px] text-gray-700'>forever@gmail.com</li>
        </div>
    </div>
    <hr className='my-5 border-gray-500'/>
    <p className='text-center text-[18px] text-gray-500 pb-5'>Copyright 2025 © Forever - All Right Reserved.</p>

    </div>
  )
}

export default Footer