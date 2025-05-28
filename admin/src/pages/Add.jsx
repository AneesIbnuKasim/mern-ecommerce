import React from "react";
import { assets } from "../assets/assets";
import { useState } from "react";
import { useEffect } from "react";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";

function Add({token}) {
  const [image1,setImage1] = useState(false);
  const [image2,setImage2] = useState(false);
  const [image3,setImage3] = useState(false);
  const [image4,setImage4] = useState(false);

  const [name,setName] = useState('');
  const [category,setCategory] = useState('Men');
  const [subCategory,setSubCategory] = useState('Topwear');
  const [description,setDescription] = useState('');
  const [price,setPrice] = useState('');
  const [sizes,setSizes] = useState('');
  const [bestseller,setBestseller] = useState('');
  
  const onSubmitHandler = async(e)=>{
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name",name);
      formData.append("description",description);
      formData.append("category",category);
      formData.append("subCategory",subCategory);
      formData.append("price",price);
      formData.append("sizes",JSON.stringify(sizes));
      formData.append("bestseller",bestseller);

      image1 && formData.append("image1",image1);
      image2 && formData.append("image2",image2);
      image3 && formData.append("image3",image3);
      image4 && formData.append("image4",image4);
      
      const response = await axios.post(backendUrl+"/api/product/add",formData,{headers:{token}});
      
      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice('');
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }
  return (
    <form onSubmit={onSubmitHandler}>
      <div className="flex flex-col">
        <p className="mb-2 text-2xl">Upload Image</p>
        <div className="flex gap-3">
          <label htmlFor="image1">
            <img className="w-20" src={image1 ? URL.createObjectURL(image1) : assets.upload_area} alt="upload-img" />
            <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden />
          </label>

          <label htmlFor="image2">
            <img className="w-20" src={image2 ? URL.createObjectURL(image2) : assets.upload_area} alt="upload-img" />
            <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" hidden />
          </label>

          <label htmlFor="image3">
            <img className="w-20" src={image3 ? URL.createObjectURL(image3) : assets.upload_area} alt="upload-img" />
            <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id="image3" hidden />
          </label>

          <label htmlFor="image4">
            <img className="w-20" src={image4 ? URL.createObjectURL(image4) : assets.upload_area} alt="upload-img" />
            <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id="image4" hidden />
          </label>
        </div>
      </div>
      <div className="w-full">
        <p className="my-2">Product Name</p>
        <input onChange={(e)=>setName(e.target.value)} value={name} className="w-full max-w-[500px] px-3 py-2" type="text" placeholder="Type here..." required/>
      </div>
      <div className="w-full">
        <p className="my-2">Product Description</p>
        <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className="w-full max-w-[500px] px-3 py-2" type="text" placeholder="Type here..." />
      </div>
     <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div className="sm:w-40">
          <p className="my-2">Category</p>
          <select onChange={(e)=>setCategory(e.target.value)} className="w-full px-3 py-2" name="" id="">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>
        <div className="sm:w-40">
          <p className="my-2">Sub Category</p>
          <select onChange={(e)=>setSubCategory(e.target.value)} className="w-full px-3 py-2" name="" id="">
            <option value="Men">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>
        <div className="w-full sm:w-30">
          <p className="my-2">Product Price</p>
          <input onChange={(e)=>setPrice(e.target.value)} value={price} className="w-full px-3 py-2 sm:w-[120px]" type="number" min={0} />
        </div>
        </div>
        <div className="my-2">

          {/* ---------------------select sizes array------------------------ */}
          <p className="my-2">Product Sizes</p>
          <div className="flex gap-4">
            <p onClick={()=>setSizes(prev=>prev.includes("S") ? prev.filter((item)=>item != "S") : [...prev,"S"])
            } value={"S"} className={` border border-gray-500 w-12 text-center px-3 py-1 cursor-pointer ${sizes.includes("S")?"bg-black text-white":"bg-slate-200"}`}>S</p>
            <p onClick={()=>setSizes(prev=>prev.includes("M") ? prev.filter((item)=>item!="M"): [...prev,"M"])} className={` border border-gray-500 w-12 text-center px-3 py-1 cursor-pointer ${sizes.includes("M")?"bg-black text-white":"bg-slate-200"}`}>M</p>
            <p onClick={()=>setSizes(prev=>prev.includes("L")?prev.filter((item)=>item!="L"):[...prev,"L"])} className={` border border-gray-500 w-12 text-center px-3 py-1 cursor-pointer ${sizes.includes("L")?"bg-black text-white":"bg-slate-200"}`}>L</p>
            <p onClick={()=>setSizes(prev=>prev.includes("XL")?prev.filter((item)=>item!="XL"):[...prev,"XL"])} className={` border border-gray-500 w-12 text-center px-3 py-1 cursor-pointer ${sizes.includes("XL")?"bg-black text-white":"bg-slate-200"}`}>XL</p>
            <p onClick={()=>setSizes(prev=>prev.includes("2XL")?prev.filter((item)=>item!="2XL"):[...prev,"2XL"])} className={` border border-gray-500 w-12 text-center px-3 py-1 cursor-pointer ${sizes.includes("2XL")?"bg-black text-white":"bg-slate-200"}`}>2XL</p>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <input onChange={()=>setBestseller(prev=>!prev)} checked={bestseller} type="checkbox" id="bestseller"/>
          <label htmlFor="bestseller">Add to bestseller</label>
        </div>
        <button className="w-full sm:w-28 bg-black mt-4 py-3 text-white rounded-md cursor-pointer" type="submit">Submit</button>
        
    </form>
  );
}

export default Add;
