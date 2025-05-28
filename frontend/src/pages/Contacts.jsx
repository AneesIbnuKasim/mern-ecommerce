import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import Subscribe from "../components/Subscribe";

function Contacts() {
  return (
    <div className="border-t pt-12">
      
      <div className="flex flex-col items-center ">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>
      <div className="flex flex-row justify-center mt-12">
      <div className="flex flex-col md:flex-row justify-space-around gap-6">
        <img className="w-full md:max-w-[480px]" src={assets.contact_img} alt="" />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray-600">OUR STORE</p>
          <p className="text-gray-500">54709 Willms Station <br />
          Suite 350, Washington, USA</p>
          <p className="text-gray-500">Tel: (415) 555‑0132 <br />Email: greatstackdev@gmail.com</p>
          <p className="font-semibold text-xl text-gray-600">Careers at Forever</p>
          <p className="text-gray-500">Learn more about our teams and job openings.</p>
          <button className="border border-black hover:bg-black hover:text-white py-4 px-8 transition-all duration-500">Explore Jobs</button>
        </div>
      </div>
      </div>
      <Subscribe />
    </div>
  );
}

export default Contacts;
