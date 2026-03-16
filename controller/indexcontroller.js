const Contact = require('../models/contact.js');

module.exports.WelcomeGet = (req, res) =>{
    res.render('pages/home.ejs');
};

module.exports.adminPage = (req, res) =>{
   res.render('pages/Admin.ejs');
}

module.exports.adminlogout = (req, res, next) => {
    req.logout(function(err){
        if(err) return next(err);
        req.session.destroy(() => {
            res.clearCookie('connect.sid'); // 🚨 cookie clear karna
            res.redirect('/admin');
        });
    });
}
module.exports.IntroPage = (req, res) =>{
   res.render('pages/main.ejs');
}

module.exports.contactGet = (req, res) =>{
    let {success} = req.query;
    const message = success ? "Contact form submitted successfully!" : null;
     res.render('pages/contact.ejs', {message});
}

module.exports.contactPost = async (req, res) =>{
    try{
        const {name, email, purpose} = req.body;
        const contact = new Contact({name : name, email : email, purpose : purpose});
       let savedContact = await contact.save();
        res.redirect('/contact?success=1');
    }catch(err){
        res.status(500).send('Internal Server Error');
    }
}