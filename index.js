require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo').default;

const ejs = require('ejs');
let path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
// Authentication and Autherization
const session = require('express-session');
const passport = require('passport');
const localStratergy  = require('passport-local').Strategy;
const Admin = require('./models/admin.js');

// Router
const IndexRouter = require('./routes/indexRoute.js');
const ProjectRoute = require('./routes/ProjectRoutes.js');

async function main(){
    await mongoose.connect(process.env.MONGO_URL);
}
main()
.then(() =>{
    console.log('Connected to MongoDB');
}).catch((err) =>{
    console.log('Error Connecting to MongoDB:', err);
});

if(process.env.NODE_ENV === 'production'){
    app.set('trust proxy', 1); // trust first proxy (Render)
}

const store = MongoStore.create({
    mongoUrl : process.env.MONGO_URL,
    crypto : {
        secret : process.env.MY_SECRET,
    },
    touchAfter : 24 * 3600
});

const sessionObject = {
    store, 
    secret : process.env.MY_SECRET,
    resave : false,
    saveUninitialized : false,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
};


app.use(session(sessionObject));


app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(methodOverride("_method"));
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.engine('ejs', ejsMate);



app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) =>{
    res.locals.currUser = req.user;
    next();
});

passport.use(new localStratergy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try{
            const admin = await Admin.findOne({ email });

            if(!admin){
                return done(null, false);
            }

            if(admin.password !== password){
                return done(null, false);
            }

            return done(null, admin);

        }catch(err){
            return done(err);
        }
    }
));

passport.serializeUser((admin, done) =>{
    done(null, admin.id);
});
passport.deserializeUser(async (id, done) =>{
    const admin = await Admin.findById(id);
    done(null, admin);
});

// Index Routes
app.use('/', IndexRouter);
app.use('/main/project', ProjectRoute);

app.listen(8080, (req, res) =>{
    console.log("Server is listening at 8080");
});