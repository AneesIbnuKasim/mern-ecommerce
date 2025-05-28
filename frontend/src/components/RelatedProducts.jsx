import React, { useContext, useEffect, useRef, useState } from "react";
import { ShopContext } from "../contexts/ShopContext";
import ProductItem from "./ProductItem";
import { ChevronLeft, ChevronRight } from "lucide-react";

function RelatedProducts({ category, subCategory, id }) {
  const { products } = useContext(ShopContext);
  const [relatedProduct, setRelatedProduct] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (products.length > 0) {
      const copyProducts = [...products];
      let relProd = copyProducts.filter(
        (item) =>
          item.category === category &&
          item._id !== id &&
          item.subCategory === subCategory
      );
      relProd = relProd.slice(0, 10);
      setRelatedProduct(relProd);
    }
  }, [products, category, subCategory, id]);

  // Scroll functions
  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -250, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 250, behavior: "smooth" });
  };

  return (
    <div className="relative w-full">
      {/* Left Arrow */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hidden md:flex"
      >
        <ChevronLeft />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide space-x-4 px-2 scroll-smooth"
      >
        {relatedProduct.map((item, index) => (
          <div key={index} className="max-w-[200px] flex-shrink-0">
            <ProductItem {...item} />
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-2 rounded-full hidden md:flex"
      >
        <ChevronRight />
      </button>
    </div>
  );
}

export default RelatedProducts;
