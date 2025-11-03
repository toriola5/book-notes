import express from "express";
import bcrypt from "bcrypt";
import db from '../db/index.js';
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy } from "passport-local";
dotenv.config();

const router = express.Router();
const saltRounds = 10;

// Configure Passport Local Strategy
passport.use("local", new Strategy({
    usernameField: 'email', // This will be the email field from your form
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        // Find user by email
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        
        if (result.rows.length === 0) {
            return done(null, false, { message: "Incorrect Email" });
        }
        
        const user = result.rows[0];
        
        // Check if user is verified
        if (!user.status) {
            return done(null, false, { message: "Email Not verified, Please verify your email before logging in" });
        }
        
        // Compare password with hashed password
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (isValidPassword) {
            return done(null, user);
        } else {
            return done(null, false, { message: "Incorrect password" });
        }
        
    } catch (error) {
        console.error("Authentication error:", error);
        return done(error);
    }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
        if (result.rows.length > 0) {
            done(null, result.rows[0]);
        } else {
            done(null, false);
        }
    } catch (error) {
        done(error);
    }
});

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false, // TLS
  auth: {
    user: "apikey", // must be literally 'apikey'
    pass: process.env.SENDGRID_API_KEY, // your SendGrid API key
  },
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    
    try {
        // Check if user already exists
        const existingUser = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        let status = false;
        
        if (existingUser.rows.length > 0) {
            return res.redirect("/login"); //Redirect to login when user exist
        }
        
        // Generate 6-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Insert new user with verification code and return the ID
        const newUser = await db.query(
            "INSERT INTO users (firstname, lastname, email, password, status) VALUES ($1, $2, $3, $4, $5) RETURNING id",
            [firstname, lastname, email, hashedPassword, status]
        );
        
        // Save the user ID and verification code in session
        req.session.userId = newUser.rows[0].id;
        req.session.verificationCode = {
                                value: verificationCode,
                                expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes from now
                                    };
        
        // Send verification email
        const mailOptions = {
            from: process.env.SENDER_EMAIL, // Your verified sender email
            to: email,
            subject: "Verify Your Account",
            html: `
                <h2>Welcome ${firstname}!</h2>
                <p>Thank you for registering. Please use the following verification code to verify your account:</p>
                <h1 style="color: #007bff; text-align: center; letter-spacing: 3px;">${verificationCode}</h1>
                <p>This code will expire in 5 minutes.</p>
                <p>If you didn't create this account, please ignore this email.</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`Verification code ${verificationCode} sent to ${email}`);
        
        res.render("verify"); // Redirect to verify after successful registration
        
    } catch (error) {
        console.error("Registration error:", error);
        res.redirect("/register");
    }
});

router.get("/verify", (req, res) => {
    // You can access the user ID from session here
    const userId = req.session.userId;
    res.render("reverify");
});



router.post("/verify", async (req, res) => {
    const { verificationCode } = req.body;
    const userId = req.session.userId;
    const sessionCodeData = req.session.verificationCode;
    
    // Check if user session exists
    if (!userId || !sessionCodeData) {
        return res.render("verify", { error: "Session expired. Please register again." });
    }
    
    // Check if code has expired
    if (Date.now() > sessionCodeData.expiresAt) {
        return res.render("verify", { error: "Verification code has expired. Ask for a new code." });
    }
    
    try {
        // Compare the submitted code with the session-stored code
        if (verificationCode === sessionCodeData.value) {
            // Code is correct, update user status to verified (true)
            await db.query("UPDATE users SET status = $1 WHERE id = $2", [true, userId]);
            
            // Clear verification code from session
            delete req.session.verificationCode;
            req.session.verified = true;
            
            console.log(`User ${userId} successfully verified`);
            
            // Redirect to login page
            res.redirect("/login");
        } else {
            // Code is incorrect
            res.render("verify", { error: "Invalid verification code. Please try again." });
        }
        
    } catch (error) {
        console.error("Verification error:", error);
        res.render("verify", { error: "An error occurred during verification. Please try again." });
    }
});

router.get("/login", (req, res) => {
    res.render("login", { errorMessage: req.flash('error') });
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/", // Redirect on successful login
    failureRedirect: "/login",     // Redirect on failed login
    failureFlash: true             // Enable flash messages for errors
}));

// Logout route
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
        }
        req.session.destroy((err) => {
            if (err) {
                console.error("Session destroy error:", err);
            }
            res.redirect("/login");
        });
    });
});


router.post("/reverify", async (req, res) => {
    const { email } = req.body;
    
    try {
        // Check if user exists
        const userResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        
        if (userResult.rows.length === 0) {
            return res.render("reverify", { error: "Not a registerd User. Please register first." });
        }
        
        const user = userResult.rows[0];
        
        // Check if user is already verified
        if (user.status === true) {
            return res.render("reverify", { error: "Your account is already verified. Please login." });
        }
        
        // Generate new 6-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Save the user ID and verification code in session
        req.session.userId = user.id;
        req.session.verificationCode = {
            value: verificationCode,
            expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes from now
        };
        
        // Send verification email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Resend Verification Code",
            html: `
                <h2>Hello ${user.firstname}!</h2>
                <p>You requested a new verification code. Please use the following code to verify your account:</p>
                <h1 style="color: #007bff; text-align: center; letter-spacing: 3px;">${verificationCode}</h1>
                <p>This code will expire in 5 minutes.</p>
                <p>If you didn't request this code, please ignore this email.</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`New verification code ${verificationCode} sent to ${email}`);
        
        // Render verify page
        res.render("verify", { success: "A new verification code has been sent to your email." });
        
    } catch (error) {
        console.error("Reverify error:", error);
        res.render("reverify", { error: "An error occurred. Please try again." });
    }
});

export default router;