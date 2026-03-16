require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Admin = require('./models/admin.js');

// Routers
const IndexRouter = require('./routes/indexRoute.js');
const ProjectRoute = require('./routes/ProjectRoutes.js');


// Mongoose Connection

async function main() {
    await mongoose.connect("mongodb+srv://Sumit9092:AvpqNBozDmY3cPtD@cluster0.grsjgsj.mongodb.net/?appName=Cluster0");
    console.log("Connected to MongoDB Atlas");
}
main().catch(err => console.log("MongoDB connection error:", err));


// Middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Session + MongoStore

const store = MongoStore.create({
    mongoUrl: "mongodb+srv://Sumit9092:AvpqNBozDmY3cPtD@cluster0.grsjgsj.mongodb.net/?appName=Cluster0",
    crypto: {
        secret : process.env.MY_SECRET,
    },
    touchAfter : 24 * 3600
});

app.use(session({
    store,
    secret: process.env.MY_SECRET || "mysecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));


// Passport Configuration

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const admin = await Admin.findOne({ email });
            if (!admin) return done(null, false);
            if (admin.password !== password) return done(null, false);
            return done(null, admin);
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((admin, done) => {
    done(null, admin.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const admin = await Admin.findById(id);
        done(null, admin);
    } catch (err) {
        done(err);
    }
});


// Local Variables for EJS

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    next();
});


// Routes

app.use('/', IndexRouter);
app.use('/main/project', ProjectRoute);



// Server

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});