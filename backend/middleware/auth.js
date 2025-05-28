import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: "User not authorized" });
  }
  try {
    const token_decode = jwt.verify(token, process.env.jwt_secret);
    req.body.userId = token_decode.user_id; //user_id were attached to jwt while creating
    next();
  } catch (error) {
    console.log(error);
    res.json({success:false,message:error.message});
    
  }
};

export default userAuth;
