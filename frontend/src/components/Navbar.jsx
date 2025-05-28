import React, { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { NavLink, Link } from "react-router-dom";
import { ShopContext } from "../contexts/ShopContext.jsx";

function Navbar() {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, showSearch, getCartCount, token, setToken, setCartItem, navigate} =
    useContext(ShopContext);
  const context = useContext(ShopContext);
  // console.log("ShopContext in Navbar:", context);
  // -------------Logout User-------------------
  const logout = async () => {
    localStorage.removeItem('token');
    setToken("");
    setCartItem({});
    navigate('/login');
  };
  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <img src={assets.logo} alt="logo" className="w-36" />
      {/* -------------ul menu------------------------  */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <li className="flex flex-row gap-5">
          <NavLink to="/" className="flex flex-col items-center gap-1 ">
            <p>Home</p>
            <hr className="w-2/4 h-[2px] border-none bg-black hidden" />
          </NavLink>
          <NavLink
            to="/collections"
            className="flex flex-col items-center gap-1 "
          >
            <p>Collections</p>
            <hr className="w-2/4 h-[2px] border-none bg-black hidden" />
          </NavLink>
          <NavLink to="/about" className="flex flex-col items-center gap-1 ">
            <p>About</p>
            <hr className="w-2/4 h-[2px] border-none bg-black hidden" />
          </NavLink>
          <NavLink to="/contacts" className="flex flex-col items-center gap-1 ">
            <p>Contacts</p>
            <hr className="w-2/4 h-[2px] border-none bg-black hidden" />
          </NavLink>
        </li>
      </ul>
      {/* -------------search-icon--------------------- */}
      <div className="flex item-center gap-6">
        <img
          onClick={() => setShowSearch(!showSearch)}
          src={assets.search_icon}
          className="w-5 gap-1 cursor-pointer"
        />
        {/* ----------profile-icon--------------------- */}
        <div className="group relative">
            <img onClick={()=>token ? null:navigate('/login')} className="w-5 cursor-pointer" src={assets.profile_icon} alt="profile-icon" />
          {/* dropdown-menu for profile */}
       {token &&   <div className="dropdown-menu hidden absolute group-hover:block right-0 pt-4 bg-slate-50">
            <div className="flex flex-col w-[9vw] gap-1  py-3 px-5 text-gray-500 items-center">
              <p  className="cursor-pointer hover:text-black ">My Profile</p>
              <p onClick={()=>navigate('/orders')} className="cursor-pointer hover:text-black">Orders</p>
              <p onClick={logout} className="cursor-pointer hover:text-black">Logout</p>
            </div>
          </div> }
        </div>
        {/* ----------link to shopping-cart------------- */}
        <Link to="/cart" className="relative">
          <img className="w-5 min-w-5" src={assets.cart_icon} alt="cart-img" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 rounded-full text-[8px] bg-black text-white ">
            {getCartCount()}
          </p>
        </Link>
        {/* ----------------menu-icon----------------- */}
        <img
          onClick={() => setVisible(true)}
          className="w-5 sm:hidden cursor-pointer"
          src={assets.menu_icon}
          alt="menu-icon"
        />
      </div>
      {/* ----------------sidebar-menu-smaller-screens------------ */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col gap-5 w-35 py-3 px-5 text-gray-500 rounded">
          <img
            onClick={() => setVisible(false)}
            className="h-4 w-5 rotate-180"
            src={assets.dropdown_icon}
            alt=""
          />
          <p>Back</p>
          <div className="flex flex-col ">
            <NavLink
              onClick={() => setVisible(false)}
              to="/"
              className="py-2 pl-6 border"
            >
              Home
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              to="/collections"
              className="py-2 pl-6 border"
            >
              Collection
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              to="about"
              className="py-2 pl-6 border"
            >
              About
            </NavLink>
            <NavLink
              onClick={() => setVisible(false)}
              to="contact"
              className="py-2 pl-6 border"
            >
              Contacts
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
