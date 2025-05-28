import React, { useEffect, useState } from "react";
import { createContext } from "react";;
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const ShopContext = createContext();

function ShopContextProvider({ children }) {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [product, setProduct] = useState([]);
  const [cartItem, setCartItem] = useState({});
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('');

  //add-products-to-cart
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("select a size");
      return;
    }
    const cartData = structuredClone(cartItem);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else cartData[itemId][size] = 1;
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItem(cartData);
    toast.success('Item added to cart')

    //-------------------add cart-item to database---------------------
    
      if (token) {
        try {
        await axios.post(backendUrl+"/api/cart/add",{itemId,size},{headers:{token}});
        
      }catch (error) {
        console.log(error);
        toast.error(error.message);
        
      }
    } 
  };

  //----------------------get-cart-total-quantity----------------------
  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItem) {
      for (const item in cartItem[items]) {
        if (cartItem[items][item] > 0) {
          totalCount += cartItem[items][item];
        }
      }
    }
    return totalCount;
  };

  // ----------------------updation-deletion-product-quantity-----------------------
  const updateQuantity = async(itemId,size,quantity)=>{
    const cartData = structuredClone(cartItem);
    if(quantity>0) {
      cartData[itemId][size] = quantity;
    }
    else {
      delete cartData[itemId][size];
      if(Object.keys(cartData[itemId]).length === 0){
        delete cartData[itemId];
      }
    }
    setCartItem(cartData);

    //------------------- update cart-items in database---------------
    if (token) {
      try {
        
        await axios.post(backendUrl+"/api/cart/update",{itemId, size, quantity},{headers:{token}})
      } catch (error) {
        console.log(error);
        toast.error(error.message);
        
      }
    }
  }
  const getUserCart = async (token)=>{
   try {
    const response = await axios.post(backendUrl+"/api/cart/get",{},{headers:{token}});
    if(response.data.success) {
      setCartItem(response.data.cartData);
    }
   } catch (error) {
    console.log(error);
        toast.error(error.message);
   }
    
  }

  //-----------------get-cart-total-amount-----------------
  const getCartAmount = ()=>{
    let totalAmount = 0;
    for(const items in cartItem) {
      const productData = products.find((product)=>product._id===items);
      for (const item in cartItem[items]) {  
        totalAmount += productData.price*cartItem[items][item];
      }
    }
    return totalAmount;
  }

  //------------get product data from DB----------------
  const getProductData = async()=>{
    try {
      const response = await axios.get(backendUrl+'/api/product/list');
    if (response.data.success) {
      setProducts(response.data.products);
    }
    else {
      toast.error(response.data.message);
    }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }  
  }

  useEffect(()=>{
      getProductData();
  },[products])

  useEffect(()=>{
    if(!token && localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'))
      getUserCart(localStorage.getItem('token'));
    }
  },[token])

  const value = {
    currency,
    navigate,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    product,
    setProduct,
    cartItem,
    setCartItem,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    backendUrl,
    products,
    token,
    setToken,
    
  };
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export default ShopContextProvider;
