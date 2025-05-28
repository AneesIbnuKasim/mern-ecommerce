import React, { useContext, useEffect, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../contexts/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

function placeOrder() {
  const [method, setMethod] = useState("");
  const {
    navigate,
    backendUrl,
    token,
    getCartAmount,
    delivery_fee,
    setCartItem,
    cartItem,
    products,
  } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phoneNumber: "",
  });
  const onchnageHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const sumbitOrder = async (e) => {
    e.preventDefault();

    let orderItems = [];
    for (let items in cartItem) {
      for (let item in cartItem[items]) {
        if (cartItem[items][item] > 0) {
          const itemInfo = structuredClone(
            products.find((product) => product._id == items)
          );
          if (itemInfo) {
            itemInfo.size = item;
            itemInfo.quantity = cartItem[items][item];
            orderItems.push(itemInfo);
          }
        }
      }
    }

    let orderInfo = {
      address: formData,
      items: orderItems,
      amount: getCartAmount() + delivery_fee,
    };
    
    //api calls to payment
    switch (method) {
      case "cod":
        const response = await axios.post(
          backendUrl + "/api/order/place",
          orderInfo,
          { headers: { token } }
        );
        
        if(response.data.success) {
          setCartItem({})
          navigate('/orders')
          toast.success(response.data.message)
        }else {
          toast.error(response.data.message)
        }
        break;
      case "stripe":
        await axios.post(
          backendUrl + "/api/orders/stripe",
          { orderInfo },
          { headers: { token } }
        );
        break;
      case "razorpay":
        await axios.post(
          backendUrl + "/api/orders/razorpay",
          { orderInfo },
          { headers: { token } }
        );
        break;
      default:
        toast.error("select a payment method");
        break;
    }
  };

  return (
    <form
      onSubmit={sumbitOrder}
      className="flex flex-col lg:flex-row pt-6 sm:pt-14 border-t sm:justify-between"
    >
      {/* -----------------left-side----------------- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onchnageHandler}
            name="firstName"
            value={formData.firstName}
            className="border border-gray-500 outline-none w-1/2 py-1.5 px-3.5  rounded"
            type="text"
            placeholder="first name"
          />
          <input
            required
            onChange={onchnageHandler}
            name="lastName"
            value={formData.lastName}
            className="border border-gray-500 outline-none w-1/2 py-1.5 px-3.5 rounded"
            type="text"
            placeholder="last name"
          />
        </div>
        <input
          required
          onChange={onchnageHandler}
          name="email"
          value={formData.email}
          className="border border-gray-500 outline-none py-1.5 px-3.5 rounded"
          type="email"
          placeholder="Email"
        />
        <input
          required
          onChange={onchnageHandler}
          name="street"
          value={formData.street}
          className="border border-gray-500 outline-none py-1.5 px-3.5 rounded"
          type="text"
          placeholder="street"
        />
        <div className="flex gap-3">
          <input
            required
            onChange={onchnageHandler}
            name="city"
            value={formData.city}
            className="border border-gray-500 outline-none w-1/2 py-1.5 px-3.5  rounded"
            type="text"
            placeholder="city"
          />
          <input
            required
            onChange={onchnageHandler}
            name="state"
            value={formData.state}
            className="border border-gray-500 outline-none w-1/2 py-1.5 px-3.5 rounded"
            type="text"
            placeholder="state"
          />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onchnageHandler}
            name="zipCode"
            value={formData.zipCode}
            className="border border-gray-500 outline-none w-1/2 py-1.5 px-3.5  rounded"
            type="number"
            placeholder="zip code"
          />
          <input
            required
            onChange={onchnageHandler}
            name="country"
            value={formData.country}
            className="border border-gray-500 outline-none w-1/2 py-1.5 px-3.5 rounded"
            type="text"
            placeholder="country"
          />
        </div>
        <input
          required
          onChange={onchnageHandler}
          name="phoneNumber"
          value={formData.phoneNumber}
          className="border border-gray-500 outline-none py-1.5 px-3.5 rounded"
          type="number"
          placeholder="phone"
        />
      </div>
      {/* -------------------Right-Side----------------- */}
      <div className="mt-8">
        <div>
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          {/* ----------------payment-selection----------------- */}
          <div className="flex flex-col lg:flex-row gap-3 mt-5 ">
            <div className="flex items-center border gap-3 px-3 py-1.5">
              <p
                onClick={() => setMethod("stripe")}
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "stripe" ? "bg-green-500" : ""
                }`}
              ></p>
              <img
                className="h-5 mx-4"
                src={assets.stripe_logo}
                alt="stripe-logo"
              />
            </div>
            <div className="flex items-center border gap-1 px-3 py-1.5">
              <p
                onClick={() => setMethod("razorpay")}
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "razorpay" ? "bg-green-500" : ""
                }`}
              ></p>
              <img
                className="h-5 mx-4"
                src={assets.razorpay_logo}
                alt="razorpay-logo"
              />
            </div>
            <div className="flex items-center border  px-3 py-1.5">
              <p
                onClick={() => setMethod("cod")}
                className={`min-w-3.5 h-3.5 border rounded-full ${
                  method === "cod" ? "bg-green-500" : ""
                } `}
              ></p>
              <p>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className="mt-4 w-full text-end">
            <button type="submit" className="bg-black text-white py-1.5 px-6">
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default placeOrder;
