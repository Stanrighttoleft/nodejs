const User=require('../model/User');

const handleLogout=async(req,res)=>{
    //On client, also delete the accessToken

    const cookies=req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204);//no content
    const refreshToken=cookies.jwt;

    //is refreshtoken in db
    const foundUser=await User.findOne({refreshToken}).exec();
    if(!foundUser) {
        res.clearCookie('jwt',{httpOnly:true});
        return res.sendStatus(204);
    }

    //Delete refreshToken in db
    foundUser.refreshToken='';
    const result=await foundUser.save();
    console.log(result);

    res.clearCookie('jwt',{httpOnly:true, sameSite:'None',secure:true});//secure true-only service on https
    res.sendStatus(204);

}

module.exports={handleLogout};