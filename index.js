import express from "express";
import booksRouter from './routes/book.js';
import bookUpdate from './routes/bookAction.js';
import registerLogin from './routes/registration-login.js';
import session from 'express-session';
import passport from 'passport';
import flash from 'connect-flash';
import connectPgSimple from 'connect-pg-simple';
import db from './db/index.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

// Create PostgreSQL session store
const pgSession = connectPgSimple(session);


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Session middleware with PostgreSQL store.
app.use(session({
    store: new pgSession({
        pool: db, // Use the dedicated session pool
        tableName: 'session',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Flash messages
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use("/", booksRouter);
app.use("/books", bookUpdate);
app.use("/", registerLogin);

app.listen(port, async() => {
    console.log(`Server started on port ${port}`);  
});