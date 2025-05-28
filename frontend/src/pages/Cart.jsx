import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../contexts/ShopContext";
import Title from "../components/Title";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

function Cart() {
  const { products, currency, navigate, cartItem, updateQuantity } =
    useContext(ShopContext);
  const [cartData, setCartData] = useState([]);
  useEffect(() => {
      const tempData = [];
    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        if (cartItem[items][item] != 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItem[items][item],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItem]);

  return cartData.length > 0 ? (
    <div className="border-t pt-14">
      {/* -------------Cart-title------------- */}
      <div className="font-medium text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>
    {/* map product */}
      {cartData.map((item, index) => {
        const productData = products.find(
          (product) => product._id === item._id
        );

        return (

          <div key={index} className=" border-t border-b py-5 text-gray-700 grid grid-cols-8 sm:grid-cols-3 items-center">
            <div className=" flex flex-start col-span-5 md:col-span-1 gap-6">
              <img className="w-16 sm:w-20" src={productData.image[0]} alt="cart-img" />
              <div className="flex flex-col">
                <p className="text-xs sm:text-lg font-medium">
                  {productData.name}
                </p>
                <div className="flex item-center gap-5 my-2">
                  <p>{`Price:${currency}${productData.price}`}</p>
                  <p className="border px-2 sm:px-3 sm:py-1 bg-slate-50 ">
                    {item.size}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
            <input
              onChange={(e) =>
                e.target.value === ""
                  ? updateQuantity(item._id, item.size, 1)
                  : updateQuantity(item._id, item.size, Number(e.target.value))
              }
              className="border  max-w-10 sm:max-w-20 h-7 px-1 sm:px-2 py-1"
              min={1}
              value={item.quantity}
              type="number"
            />
            </div>
            <div className="flex justify-end">
            <img
              onClick={() => updateQuantity(item._id, item.size, 0)}
              className="w-4 h-5 cursor-pointer"
              src={assets.bin_icon}
              alt="bin-icon"
            />
            </div>
          </div>

        );
      })}
      {/* -------------------Cart-Total-Price------------------ */}
      <div className="flex m-8  justify-end">
      <CartTotal />
      </div>
      <div className="w-full text-end">
        <button  onClick={() => navigate("/place-order")} className="bg-black text-white font-medium sm:text-xl py-4 p-3 sm:px-9 rounded m-5">
          proceed to checkout
        </button>
      </div>
    </div>
  ) : (
    <div className="flex flex-col  justify-center items-center text-center h-[40vh]">
      <p className="font-medium text-3xl"> Your cart is Empty</p>
      <button
        onClick={() => navigate("/")}
        className="text-white bg-blue-500 py-3 px-2 rounded-xl mt-5"
      >
        Shop Now
      </button>
    </div>
  );
}

export default Cart;
