
function authUser(req, res, next){
    if(req.session.user == null){
        res.status(403)
        return res.redirect("../user/log-in")
    }
    next()
}

function authRole(type){
    return (req, res, next) => {
        if(req.session.user.profilePic !== type){
            res.status(401)
            return res.redirect(`..${req.session.user.profilePic}`)
        }
        next()
    }

}
function checkDirection(req, res, next){
    if(req.session.user.profilePic !== "/clerk/list-mealkits"){
        res.status(401)
        return res.send("You are not authorized to add meal kits")
    }
    next()
}

module.exports = {
    authUser,
    authRole,
    checkDirection,
}