import React from "react";
import { assets } from "../assets/assets";

function OurPolicy() {
  return (
    <div className="flex flex-col sm:flex-row mt-[150px] justify-around text-center">
      <div className="">
        <img className="w-[59px] h-[59px] m-auto mb-5" src={assets.exchange_icon} alt="" />
        <p className="font-semibold text-[18px]">Easy Exchange Policy</p>
        <p className="text-gray-500">We offer hassle free  exchange policy</p>
      </div>
      <div>
        <img className="w-[59px] h-[59px] m-auto mb-5" src={assets.quality_icon} alt="" />
        <p className="font-semibold text-[18px]">7 Days Return Policy</p>
        <p className="text-gray-500">We provide 7 days free return policy </p>
      </div>
      <div>
        <img className="w-[59px] h-[59px] m-auto mb-5" src={assets.support_img} alt="" />
        <p className="font-semibold text-[18px]">Best Customer Support</p>
        <p className="text-gray-500">We provide 24/7 customer support</p>
      </div>
    </div>
  );
}

export default OurPolicy;
