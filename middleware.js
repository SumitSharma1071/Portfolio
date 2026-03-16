const admin = require('./models/admin.js');

module.exports.isLoggedin = async (req, res, next)=> {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/admin');
}