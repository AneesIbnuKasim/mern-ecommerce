import userModel from "../models/userModel.js";

//add products to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;
    const userData = await userModel.findById(userId);
    

    let cartData = userData.cartData || {};
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "product added to cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//update user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData;
    if (quantity > 0) {
      cartData[itemId][size] = quantity;
    } else {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    }
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "product updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message:error.message });
  }
};

//get user cart
const getUserCart = async (req, res) => {
    try {
        const {userId} = req.body;
    const userData = await userModel.findById(userId);
    const cartData = userData.cartData;
    res.json({success:true,cartData});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
        
    }
};

export { addToCart, updateCart, getUserCart };
