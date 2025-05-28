import React from "react";
import { assets } from "../assets/assets.js";

function Navbar({setToken}) {
  return (
    <div>
      <div className="flex py-2 px-[4%] items-center justify-between">
        <img className="w-[max(10%,80px)]" src={assets.logo} alt="logo" />
        <button onClick={()=>setToken('')} className="bg-gray-600 text-white py-2 px-5 rounded-full sm:px-7 text-xs sm:text-sm">
          Logout
        </button>
      </div>
      <hr />
    </div>
  );
}

export default Navbar;
