import express from "express";
import booksRouter from './routes/book.js';
import bookUpdate from './routes/bookAction.js';


const app = express();
const port = 3000;

app.use(express.static("public"));
app.set("view engine" , "ejs");
app.use(express.urlencoded({extended : true}));
app.use(express.json());

app.use ("/" , booksRouter);
app.use("/books", bookUpdate);
app.listen(port , async()=>{
    console.log(`server started on port ${port}`);  
})