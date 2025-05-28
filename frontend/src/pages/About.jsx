import React from "react";
import Subscribe from "../components/Subscribe";

import { assets } from "../assets/assets";
import Title from "../components/Title";

function About() {
  return (
      <div className="border-t ">
        <div className="flex text-xl sm:text-3xl m-10 justify-center items-center ">
          <Title text1={"ABOUT"} text2={`US`} />
        </div>
        <div className="grid sm:grid-cols-2">
            <img
              className="w-full md:max-w-[450px]"
              src={assets.about_img}
              alt=""
            />
          <div className="flex flex-col sm:m- sm:text-md leading-7 text-gray-500 gap-2 justify-center">
            <p className="">
              Forever was born out of a passion for innovation and a desire to
              revolutionize the way people shop online. Our journey began with a
              simple idea: to provide a platform where customers can easily
              discover, explore, and purchase a wide range of products from the
              comfort of their homes.
            </p>
            <p className="">
              Since our inception, we've worked tirelessly to curate a diverse
              selection of high-quality products that cater to every taste and
              preference. From fashion and beauty to electronics and home
              essentials, we offer an extensive collection sourced from trusted
              brands and suppliers.
            </p>
            <p className="flex flex-col">
              <span className="font-bold mb-5">our mission</span>
              Our mission at Forever is to empower customers with choice,
              convenience, and confidence. We're dedicated to providing a
              seamless shopping experience that exceeds expectations, from
              browsing and ordering to delivery and beyond.
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex text-xl sm:text-3xl my-8 sm:my-12 justify-center ">
            <Title text1={"WHY"} text2={"CHOOSE US"} />
          </div>
          <div className="grid sm:grid-cols-3 min-h-[400px]">
            <div className="flex flex-col border text-center justify-center px-3 gap-2">
              <p className="font-semibold">Quality Assurance:</p>
              <p className="">
                We meticulously select and vet each product to ensure it meets
                our stringent quality standards.
              </p>
            </div>
            <div className="flex flex-col border text-center justify-center px-3 gap-2">
              <p className="font-semibold">Convenience</p>
              <p className="">
                With our user-friendly interface and hassle-free ordering
                process, shopping has never been easier.
              </p>
            </div>
            <div className="flex flex-col border text-center justify-center px-3 gap-2">
              <p className="font-semibold">Exceptional Customer Service:</p>
              <p className="">
                We meticulously select and vet each product to ensure it meets
                our stringent quality standards.
              </p>
            </div>
            <div></div>
          </div>
        </div>
      <Subscribe />
    </div>
  );
}

export default About;
