import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import { ShopContext } from '../contexts/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify';

function Orders() {
  const { currency, backendUrl, token } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([])
  const loadOrderData = async ()=>{
   try {
    if (!token) {
      return null
     }
      const response = await axios.post(backendUrl+'/api/order/userorders',{},{headers:{token}})
      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.map((order)=>{
          order.items.map((item)=>{
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['status'] = order.status
            item['date'] = order.date
            allOrdersItem.push(item)
          })
      })
      setOrderData(allOrdersItem.reverse())
      }
   } catch (error) {
    console.log(error);
    toast.error(error.message)
   }
  }
  useEffect(()=>{
    loadOrderData();
  },[token])

  return (
    <div>
      <div className='text-xl sm:text-2xl border-t pt-12'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>
      <div>
          {orderData.map((item,index)=>( 
             
            <div key={index} className='flex flex-col md:flex-row md:items-center md:justify-between m-3 flex-start border-t pt-2'>
                <div className='flex item-start gap-6 text-sm '>
                <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
                <div className='flex flex-col ml-5 gap-3'>
                  <p>{item.name}</p>
                  <div className='flex gap-3'>
                    <p>{currency}{item.price}</p>
                    <p>Quantity:{item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p>Date: <span className='text-gray-400'>{` ${new Date(item.date).toLocaleDateString()}`}</span></p>
                  <p>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                </div>
                </div>
                <div className='flex mt-5 sm:mt-0 md:w-1/2 justify-between '>
                <div className='flex items-center gap-2'>
                <p className='w-4 h-4 rounded-full bg-green-500'></p>
                <p>{item.status}</p>
                </div>
                <button className='text-sm border px-4 py-2 font-medium rounded-sm'>Track Order</button>
                </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Orders