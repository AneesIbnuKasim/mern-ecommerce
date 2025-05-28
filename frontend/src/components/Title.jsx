import React from 'react'

function Title({text1,text2}) {
  return (
    <div className='inline-flex text-xl sm:text-3xl items-center  '>
        <p>{text1}</p> <span className='bold ml-2'>{text2}</span>
        <p className='w-8 h-[2px] bg-gray-500'></p>
    </div>
  )
}

export default Title