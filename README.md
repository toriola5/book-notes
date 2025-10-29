# 📚 Book Notes
Book Notes is a Node.js web application for tracking books, managing notes, and organizing your reading progress.
It lets users add books with cover images, mark them as completed/not completed, rate them, and create chapter-based notes — all stored in a PostgreSQL database.
The app also integrates with the Open Library Covers API to fetch book cover images automatically.

# 🚀 Features
* 📖 Add and view books with details (title, author, identifiers like ISBN, LCCN, OCLC, or OLID).
* 🖼️ Automatically fetches book covers from the Open Library API — saves locally or via URL.
* 📝 Add, view, and delete notes linked to individual books.
* ⭐ Rate books and mark them as completed/not completed.
* 🔍 Filter books by rating or completion status.
* 🌓 Dark Mode Support — toggle manually or auto-switch based on system theme.
* 🧠 Single-Page App (SPA)-like behavior: only re-renders when filtering books.
* 🗄️ Uses PostgreSQL for persistent data storage.


## 🧩 Tech Stack
* Layer	Technology
* Backend	Node.js, Express.js
* Database	PostgreSQL
* Templating	EJS
* Frontend	HTML, CSS, JavaScript
* Environment	dotenv
* API	Open Library Covers API
* Version Control	Git

## 🗄️ Database Setup
Prerequisites
You need PostgreSQL installed locally.
If you don’t have it, visit the PostgreSQL Downloads page.

### Database Schema (SQL)
Save this as database_schema.sql (you can import it in pgAdmin or run it from psql):
-- Create books table
* CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    identifier VARCHAR(100),
    id_type VARCHAR(50),
    image_path TEXT,
    rating INT,
    start_date DATE,
    created_by VARCHAR(100),
    is_complited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

* Create notes table
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    book_id INT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_book
        FOREIGN KEY (book_id)
        REFERENCES books (id)
        ON DELETE CASCADE.
);

## Relationship
📘 One-to-Many:
Each book can have many notes.
Each note belongs to one book (notes.book_id → books.id).
