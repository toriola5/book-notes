import express from "express";
import booksRouter from './routes/book.js';
import bookUpdate from './routes/bookAction.js';
import registerLogin from './routes/registration-login.js';
import session from 'express-session';
import passport from 'passport';
import flash from 'connect-flash';


const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine" , "ejs");
app.use(express.urlencoded({extended : true}));
app.use(express.json());


// Session middleware (must come before passport)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Flash messages
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use ("/" , booksRouter);
app.use("/books", bookUpdate);
app.use("/", registerLogin)
app.listen(port , async()=>{
    console.log(`server started on port ${port}`);  
});