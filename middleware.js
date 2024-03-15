module.exports.isloggedIn = (req, res , next)=>{
    if(!req.isAuthenticated()){
 req.flash("error" ,"you must logged in to do this!");
  return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl= (req, res , next )=>{
        if(req.session.redirectUrl){
     res.local.redirectUrl = req.session.redirectUrl;
        }
        next();
}