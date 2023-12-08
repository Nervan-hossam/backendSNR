const router = require("express").Router();
const User = require("../models/User")
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
//register
router.post("/register", async (req , res )=>{
const newUser = new User ({
  username : req.body.username,
  email : req.body.email,
 password : req.body.password,
});
 try{
  const savedUser = await newUser.save();
res.status(201).json(savedUser)
  console.log(savedUser);} 
  catch(err){
    res.status(500).json(err)
  }

});
//login
router.post("/login" , async(req,res)=>{
try{
  const user = await User.findOne({username : req.body.username});
  !user && res.status(401).json("wrong credentials! ")
  const hashedPassword = CrptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
  const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
  originalPassword !== req.body.password && 
   res.status(401).json("wrong credentials! ");

    const accessToken = jwt.sign({
      id:user._id , isAdmin: user.isAdmin,
    }, process.env.JWT_sec,
    {expiresIn:"3d"}
    );

  const { password, ...others }= user._doc ;


  res.status(200).json({...others, accessToken});
} catch(err){
  res.status(500).json(err); 
}

});


module.exports = router ; 
