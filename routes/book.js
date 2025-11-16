import express from "express";
import { fetchImage } from "../services/apiService.js";
import db from "../db/index.js";

// Middleware to check if user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

async function insertData(data) {
  await db.query(
    "insert into books (title , author , image_path , rating , start_date , idtype , idnumber, user_id)values($1,$2,$3,$4,$5,$6,$7,$8)",
    data
  );
}

async function getData(userId) {
  let result = await db.query(
    "select id , title , author , image_path , rating , start_date, is_complited from books where user_id = $1 order by id asc",
    [userId]
  );
  if (result.rowCount > 0) {
    return result.rows;
  } else {
    return [];
  }
}

const router = express.Router();

let identifiers = ["ISBN", "LCCN", "OCLC", "OLID"];
const url = "https://covers.openlibrary.org/b/";

// Apply authentication middleware to the home route
router.get("/", ensureAuthenticated, async (req, res) => {
  let data = await getData(req.user.id);
  console.log(data);
  res.render("index", {
    identifiers: identifiers,
    data: data,
    userName: req.user.firstname,
  });
  console.log(req.user);
});

// Apply authentication middleware to other protected routes
router.post("/add", ensureAuthenticated, async (req, res) => {
  const { title, author, rating, startdate, idnumber, identifier } = req.body;
  const sanitizedAuthor = author.replace(/\s+/g, "_");
  const imagePath = `./public/uploads/${sanitizedAuthor}${idnumber}.jpg`;
  const imageUrl = `${url}${identifier.toLowerCase()}/${idnumber}-M.jpg?default=false`;
  var actualRating = rating;
  if (rating === "") {
    actualRating = null;
  }
  let path;

  try {
    // Attempt to fetch and save the image locally
    await fetchImage(imageUrl, imagePath);
    path = `/uploads/${sanitizedAuthor}${idnumber}.jpg`;
  } catch (error) {
    // Fallback to using the external image URL if fetching fails
    path = `${url}${identifier.toLowerCase()}/${idnumber}-M.jpg`;
  }

  // Insert the book data into the database
  await insertData([
    title,
    author,
    path,
    actualRating,
    startdate,
    identifier,
    idnumber,
    req.user.id,
  ]);

  console.log(`Image path: ${path}`);
  res.redirect("/");
});

router.get("/filter-books", ensureAuthenticated, async (req, res) => {
  const { rating, completed } = req.query;
  let query = "SELECT * FROM books WHERE user_id = $1"; // Always filter by user_id first
  const params = [req.user.id]; // Start with user_id as first parameter
  const conditions = [];

  if (rating) {
    params.push(rating);
    conditions.push(`rating = $${params.length}`);
  }
  if (completed === "true" || completed === "false") {
    params.push(completed === "true");
    conditions.push(`is_complited = $${params.length}`);
  }

  if (conditions.length > 0) {
    query += " AND " + conditions.join(" AND "); // Use AND since WHERE already exists
  }

  query += " ORDER BY id DESC";

  try {
    const result = await db.query(query, params);
    // Fetch identifiers for the add book form
    res.render("index", {
      data: result.rows,
      identifiers: identifiers,
    });
  } catch (err) {
    console.error("Error filtering books:", err);
    res.status(500).send("Server Error");
  }
});

export default router;
