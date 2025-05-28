import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../contexts/ShopContext'
import ProductItem from './ProductItem';
import Title from './Title';

function BestSeller() {
  const {products} = useContext(ShopContext);
  const [bestSeller,setBestSeller] = useState([]);
  
  useEffect(()=>{
        const bestProduct = products.filter((item)=>item.bestseller);
        setBestSeller(bestProduct.slice(0,8));
  },[products])
  
  return (
    
    <div className="my-10 " navigate={(`product:${bestSeller._id}`)}>
        <div className="text-center">
        <Title text1={'BEST'} text2={'SELLERS'} />
        </div>
        <div >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {
                bestSeller.map((item,index)=>(
                    <ProductItem key={index} _id={item._id} image={item.image} name={item.name} price={item.price} />
                ))
            }
        </div>
    </div>
    </div>
    
    
  )
}

export default BestSeller