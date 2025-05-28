import React, { useContext, useEffect } from "react";
import Title from "./Title";
import { ShopContext } from "../contexts/ShopContext";

function CartTotal() {
  const { currency, delivery_fee ,getCartAmount } = useContext(ShopContext);

  return (
    <div className="flex">
      <div className="w-[200px] md:w-[400px] lg:w-[500px]">
        <div className=" text-2xl mb-5">
          <Title text1={"CART"} text2={"TOTAL"} />
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <p>Subtotal</p>
            <p>{currency}{getCartAmount()}</p>
          </div>
          <hr />
          <div className="flex justify-between">
            <p>Shipping Fee</p>
            <p>{currency}{delivery_fee}.00</p>
          </div>
          <div className="flex justify-between">
            <p>Total</p>
            <p>{currency}{getCartAmount === 0 ? 0: getCartAmount()+delivery_fee}.00</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartTotal;
