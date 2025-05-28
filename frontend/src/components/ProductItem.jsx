import React, { useContext } from "react";
import { ShopContext } from "../contexts/ShopContext";
import { Link } from "react-router-dom";

function ProductItem({...items}) {
  const { currency, setProduct, product } = useContext(ShopContext);
  const {_id,name,image,price} = items;
  

  return (
    <Link onClick={()=>setProduct(items)} to={`/product/${_id}`}>
      <div className="overflow-hidden py-5 ml-3">
        <img className="hover:shadow-lg  hover:scale-110 transition ease-in-out" src={image?.[0]} alt={name} />
      </div>
      <p className="text-sm p-5">{name}</p>
      <p className="font-medium p-4">{price}{currency}</p>
    </Link>
  );
}

export default ProductItem;
