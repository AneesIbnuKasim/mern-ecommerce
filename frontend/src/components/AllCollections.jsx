import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../contexts/ShopContext";
import ProductItem from "./ProductItem";
import Title from "./Title";
import { assets } from "../assets/assets";

function AllCollections() {
  const { products,search,showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  //   category inputs
  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => e.target.value !== item));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };
  //sub-category-inputs
  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => e.target.value !== item));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };
  // filter logic,search and sorting products
  const applyFilterAndSort = () => {
    let productsCopy = [...products];
    // search-products
    if(showSearch && search) {
        productsCopy = productsCopy.filter((item)=>item.name.toLowerCase().includes(search.toLowerCase()))        
    }
    // filter-products-category
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }
    
    // filter-products-subCategory
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    // sort-products
    switch (sortType) {
      case "low-high":
        productsCopy.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        productsCopy.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    setFilterProducts(productsCopy); 
  };
//use-effect for all changes
  useEffect(() => {
    applyFilterAndSort();
  }, [category, subCategory, sortType, products, search, showSearch]);

  return (
    <div>
      <hr className="border-gray-500 w-full mb-10" />
      <div className="flex flex-col sm:flex-row">
        {/* Filter - left component */}
        <div className="sm:mt-[60px] sm:mr-[60px]  ">
          <p
            onClick={() => setShowFilter(!showFilter)}
            className="pb-3 gap-2 flex items-center"
          >
            FILTERS
            <img
              className={`h-3 sm:hidden ${showFilter ? "" : "rotate-90"}`}
              src={assets.dropdown_icon}
              alt=""
            />
          </p>
          {/* Category filter */}
          <div
            className={`flex flex-col border p-8 sm:block ${
              showFilter ? "hidden" : ""
            }`}
          >
            <p className="mb-3">CATEGORIES</p>
            <div>
              <input
                onChange={toggleCategory}
                className="m-2"
                type="checkbox"
                value={"Men"}
                id="men"
              />
              <label htmlFor="men">Men</label>
            </div>
            <div>
              <input
                onChange={toggleCategory}
                className="m-2"
                type="checkbox"
                value={"Women"}
                id="women"
              />
              <label htmlFor="women">Women</label>
            </div>
            <div>
              <input
                onChange={toggleCategory}
                className="m-2"
                type="checkbox"
                value={"Kids"}
                id="kids"
              />
              <label htmlFor="kids">Kids</label>
            </div>
          </div>
          <div
            className={`flex flex-col border p-4 sm:block mt-3 ${
              showFilter ? "hidden" : ""
            }`}
          >
            {/* sub-category filter */}
            <p className="mb-3">TYPE</p>
            <div>
              <input
                onChange={toggleSubCategory}
                className="m-2"
                type="checkbox"
                value={"Topwear"}
                id="topwear"
              />
              <label htmlFor="topwear">Topwear</label>
            </div>
            <div>
              <input
                onChange={toggleSubCategory}
                className="m-2"
                type="checkbox"
                value={"Bottomwear"}
                id="bottomwear"
              />
              <label htmlFor="bottomwear">Bottomwear</label>
            </div>
            <div>
              <input
                onChange={toggleSubCategory}
                className="m-2"
                type="checkbox"
                value={"Winterwear"}
                id="winterwear"
              />
              <label htmlFor="winterwear">Winterwear</label>
            </div>
          </div>
        </div>
        {/* right section */}
        <div className="mb-[100px] sm:mb-[180px]">
          <div className="flex-1  ">
            <div className="flex justify-between text-base sm:text-2xl">
              <Title text1={"ALL"} text2={"COLLECTIONS"} />
              {/* sort selection */}
              <select
                onChange={(e) => setSortType(e.target.value)}
                className="border-2 text-sm px-2"
              >
                <option value="relevant">sort by relevant</option>
                <option value="low-high">sort by low to high</option>
                <option value="high-low">sort by high to low</option>
              </select>
            </div>
            {/* mapping and displaying products */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filterProducts.map((item, index) => (
                <ProductItem
                  key={index}
                  _id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllCollections;
