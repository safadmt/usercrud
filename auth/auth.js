function authUser (req,res,next) {
   
    if(req.cookies['connect.sid']) {
        let connectionid = req.cookies['connect.sid'].split(":")[1]
        connectionid = connectionid.split(".")[0]
        if(req.session.id === connectionid){
            if(req.session.user.role === "User") {
                res.setHeader('Cache-Control', 'no-cache,no-store, must-revalidate');
                next()
            }else{
                res.redirect('/admin')
            }
        }else{
            res.redirect('/login')
        }
        
    }else{
        res.redirect('/login')
    }
}

function authAdmin (req,res,next) {
    if(req.cookies['connect.sid']) {
        let connectionid = req.cookies['connect.sid'].split(":")[1]
        connectionid = connectionid.split(".")[0]
        if(req.session.id === connectionid){
            if(req.session.user.role === "Admin") {
                res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                next()
            }else{
                res.redirect('/')
            }
          
        }else{  
            res.redirect('/login')
        }
        
    }else{
        res.redirect('/login')
    }
}
module.exports = {authAdmin, authUser}
