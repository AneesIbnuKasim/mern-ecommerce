import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

//function for add product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;
    const image1 = req.files.image1 ? req.files.image1[0] : null;
    const image2 = req.files.image2 ? req.files.image2[0] : null;
    const image3 = req.files.image3 ? req.files.image3[0] : null;
    const image4 = req.files.image4 ? req.files.image4[0] : null;
    const images = [image1, image2, image3, image4].filter(
      (item) => item != undefined
    );

    // generating cloudinary image URL to store in db
    const imageURL = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    //set productData to create new product
    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      image: imageURL,
      date: Date.now(),
      bestseller: "true" ? true : false,
    };
    const newProduct = new productModel(productData);
    const product = await newProduct.save();
    res.json({ success: true, message: "new product added", product });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

//function for list products
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

//function for remove products
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "product removed" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

//function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};
export { addProduct, listProducts, removeProduct, singleProduct };
