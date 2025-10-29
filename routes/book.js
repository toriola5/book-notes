import express from "express";
import {fetchImage} from "../services/apiService.js";
import db from '../db/index.js'



async function insertData(data){
   await db.query("insert into books (title , author , image_path , rating , start_date , idtype , idnumber)values($1,$2,$3,$4,$5,$6,$7)", data)
}

async function getData(){
    let result = await db.query("select id , title , author , image_path , rating , start_date, is_complited from books order by id asc");
    if(result.rowCount > 0){
        return result.rows
    }else{
        return [];
    }
}


const router = express.Router();

let identifiers = ["ISBN" , "LCCN" , "OCLC" , "OLID"];
const url = 'https://covers.openlibrary.org/b/';

router.get("/" , async (req ,res)=>{
    let data = await getData();
    console.log(data);
    res.render("index" , {identifiers : identifiers , data : data})
})

router.post("/add", async (req, res) => {
    const { title, author, rating, startdate, idnumber, identifier } = req.body;
    const sanitizedAuthor = author.replace(/\s+/g, '_');
    const imagePath = `./public/uploads/${sanitizedAuthor}${idnumber}.jpg`;
    const imageUrl = `${url}${identifier.toLowerCase()}/${idnumber}-M.jpg?default=false`;
    var actualRating = rating;
    if(rating === ""){
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
    
    await insertData([title, author, path, actualRating, startdate, identifier, idnumber]);

    console.log(`Image path: ${path}`);
    res.redirect("/");
})

router.get('/filter-books', async (req, res) => {
  const { rating, completed } = req.query;
  let query = 'SELECT * FROM books';
  const params = [];
  const conditions = [];

  if (rating) {
    params.push(rating);
    conditions.push(`rating = $${params.length}`);
  }
  if (completed === 'true' || completed === 'false') {
    params.push(completed === 'true');
    conditions.push(`is_complited = $${params.length}`);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY id DESC';

  try {
    const result = await db.query(query, params);
    // Fetch identifiers for the add book form
    res.render('index', {
      data: result.rows,
      identifiers: identifiers
    });
  } catch (err) {
    console.error('Error filtering books:', err);
    res.status(500).send('Server Error');
  }
});

// add the mark as read button
//if rating is not added add a button that allows to input rating
//add notes 
//All of this should be handled from the browser side
export default router;