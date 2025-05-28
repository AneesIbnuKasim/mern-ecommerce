import React from 'react'

function Subscribe() {
    const onSubmitHandler = (event)=>{
            event.preventDefault();
    }
  return (
    <div className='flex flex-col mt-[70px] sm:mt-[150px] items-center'>
        <p className='sm: text-3xl '>Subscribe now & get 20% off</p>
        <p className='text-sm text-gray-500 mt-3'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
        <form className='mt-[46px]' action="">
        <input className='w-90% py-2 px-2 md:min-w-[350px]  border outline-none' type='email' placeholder='enter your email ' required />
        <button onClick={onSubmitHandler} className='border rounded bg-black text-white mb-[100px] md:mb-[140px] lg:mb-[200px] py-2 px-5 sm:w-[140px] sm:h-[56px]  md:w-[171px] md:h-[62px]'>Submit</button>
        </form>
    </div>
  )
}

export default Subscribe