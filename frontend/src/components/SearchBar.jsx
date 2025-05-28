import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext';
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';


function SearchBar() {
    const {setShowSearch,setSearch,showSearch,search} = useContext(ShopContext);
    const location = useLocation();
    const [visible,setVisible] = useState(false);
    useEffect(()=>{
        if(location.pathname.includes("collections")) {
            setVisible(true);
        }
        else setVisible(false);     
    })
   return showSearch && visible ? (
        <div className='border-t border-b bg-gray-50 text-center mb-3'>
                <div className='inline-flex relative items-center border-gray-400 justify-center w-full max-w-md p-3'>
                {/* input-field */}
                <input className='flex-1 outline-none bg-inherit border text-sm rounded-xl p-2 m-2' value={search} onChange={(e)=>setSearch(e.target.value)} type="text" placeholder='search' />
                {/* search-icon */}
                <img className='w-5  absolute right-10  cursor-pointer' src={assets.search_icon} alt="" />
                {/* close-search */}
                <img onClick={()=>setShowSearch(false) } className='inline w-3 cursor-pointer' src={assets.cross_icon} alt="" />
                </div>
        </div>
    
  ) : '';
}

export default SearchBar