import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../contexts/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import Title from "../components/Title";

function Product() {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [review,setReview] = useState(false);

  const fetchProductData = async () => {
    await products.find((item) => {
      if (productId === item._id) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products, size]);

  return productData ? (
    // main-container
    <div className="border-t-2 sm:pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* product-all-data-container */}
      <div className="mt-10 flex flex-col sm:flex-row ">
        {/* product-images-container */}
        <div className="flex flex-col sm:flex-row flex-col-reverse">
          {/* thumbnail-container */}
          <div className="width-full flex flex-row sm:flex-col overflow-y-auto">
            <div className="flex flex-row sm:flex-col gap-2 p-1">
              {productData.image.map((item, index) => (
                <img
                  key={index}
                  src={item}
                  alt=""
                  onClick={() => setImage(item)}
                  className="w-24 sm:w-20 sm:h-24 object-contain cursor-pointer"
                />
              ))}
            </div>
          </div>

          {/* main-image-container */}
          <div>
            <img
              src={image}
              alt="preview-image"
              className="w-full w-[500px] object-contain"
            />
          </div>
        </div>
        {/* ----------------product-details------------------- */}
        <div className="flex-1 w-full sm:ml-10">
          <p className="font-medium text-lg md:text-lg lg:text-2xl">
            {productData.name}
          </p>
          <div className="flex gap-1 items-center">
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="font-medium text-xl md:text-3xl mt-3">
            {currency}
            {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-5 lg:my-8 ">
            <p className="text-xl">select size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => (item !== size ? setSize(item) : setSize(""))}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item === size ? "border-orange-500" : ""
                  }`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button onClick={()=>addToCart(productData._id,size)} className="border bg-black text-white py-2 px-3 rounded-xl active:bg-gray-700">
            Add To Cart
          </button>
          <hr className="my-4 lg:my-8 bg-gray-300 h-0.5" />
          <div className="text-sm text-gray-500 flex flex-col lg:gap-2 ">
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>
      {/*---------------- description and reviews section --------------*/}
      <div className="flex flex-col">
        <div className="flex flex-row mt-10 gap-4">
          <p onClick={()=>setReview(false)} className={`border px-5 py-3 text-sm cursor-pointer ${!review?'border-orange-500':''}`}>Description</p>
          <p onClick={()=>setReview(true)} className={`border px-5 py-3 text-sm cursor-pointer ${review?'border-orange-500':''} `}>
            Reviews (122)
          </p>
        </div>
        <div className="flex flex-col gap-3 mt-3 border p-3">
          
            { !review ?
            ( <>
            <p className="text-md text-gray-700">
            An e-commerce website is an online platform that facilitates the
            buying and selling of products or services over the internet. It
            serves as a virtual marketplace where businesses and individuals can
            showcase their products, interact with customers, and conduct
            transactions without the need for a physical presence. E-commerce
            websites have gained immense popularity due to their convenience,
            accessibility, and the global reach they offer.
          </p>
          <p className="text-md text-gray-700">
            E-commerce websites typically display products or services along
            with detailed descriptions, images, prices, and any available
            variations (e.g., sizes, colors). Each product usually has its own
            dedicated page with relevant information.
          </p> </>): ('reviews displays here')}
        </div>
      </div>
      {/* -------------Title-for-relatedProducts-------------- */}
      <div className="pt-2 ">
          <Title text1={'SIMILAR'} text2={'PRODUCTS'} />
        </div>
      {/* display-related-products */}
              <div>
                <RelatedProducts category={productData.category} subCategory={productData.subCategory} id={productData._id} />
              </div>
    </div>
  ) : null;
}

export default Product;
