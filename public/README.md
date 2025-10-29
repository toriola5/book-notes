📚 Book Notes
Book Notes is a Node.js web application for tracking books, managing notes, and organizing your reading progress.
It lets users add books with cover images, mark them as completed/not completed, rate them, and create chapter-based notes — all stored in a PostgreSQL database.
The app also integrates with the Open Library Covers API to fetch book cover images automatically.

🚀 Features
📖 Add and view books with details (title, author, identifiers like ISBN, LCCN, OCLC, or OLID).
🖼️ Automatically fetches book covers from the Open Library API — saves locally or via URL.
📝 Add, view, and delete notes linked to individual books.
⭐ Rate books and mark them as completed/not completed.
🔍 Filter books by rating or completion status.
🌓 Dark Mode Support — toggle manually or auto-switch based on system theme.
🧠 Single-Page App (SPA)-like behavior: only re-renders when filtering books.
🗄️ Uses PostgreSQL for persistent data storage.

🧩 Tech Stack
Layer	Technology
Backend	Node.js, Express.js
Database	PostgreSQL
Templating	EJS
Frontend	HTML, CSS, JavaScript
Environment	dotenv
API	Open Library Covers API
Version Control	Git

🗄️ Database Setup
Prerequisites
You need PostgreSQL installed locally.
If you don’t have it, visit the PostgreSQL Downloads page.

Database Schema (SQL)
Save this as database_schema.sql (you can import it in pgAdmin or run it from psql):
-- Create books table
CREATE TABLE books (
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

-- Create notes table
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    book_id INT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_book
        FOREIGN KEY (book_id)
        REFERENCES books (id)
        ON DELETE CASCADE
);

Relationship
📘 One-to-Many:
Each book can have many notes.
Each note belongs to one book (notes.book_id → books.id).

⚙️ Installation and Setup
1. Clone the Repository
git clone https://github.com/toriola5/book-notes.git
cd book-notes

2. Install Dependencies
npm install

3. Configure Environment Variables
Create a .env file in the project root:
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=booknotes
DB_HOST=localhost
DB_PORT=5432
PORT=3000

4. Set Up the Database
Start PostgreSQL and create a new database:
CREATE DATABASE booknotes;

5. Run the schema file:
psql -U your_db_user -d booknotes -f database_schema.sql

6. Run the Application
npm start
or, if you have nodemon installed:
nodemon index.js

7. Open in Browser
http://localhost:3000

🧠 How It Works
The user adds a new book by entering title, author, and identifier.
The app fetches the cover image from the Open Library Covers API.
If successful, the image is downloaded and saved to public/uploads/; otherwise, the image URL is saved in the database.
The home page lists all books.
Each book:
Shows its completion and rating status.
Allows users to rate and mark as completed.
Lets users add and view chapter-based notes.
Dark mode toggles automatically if your system prefers dark theme or manually via button.

🧑‍💻 Contributing
Fork the repository
Create your feature branch (git checkout -b feature/awesome-feature)
Commit your changes (git commit -m "Add awesome feature")
Push to the branch (git push origin feature/awesome-feature)
Open a Pull Request