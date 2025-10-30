# 📚 Book Notes
Book Notes is a Node.js web application designed to help you keep track of your reading. It allows you to add books, record chapter-based notes, monitor your reading progress, and rate each title, with all data stored in a PostgreSQL database.
The app automatically retrieves book covers via the Open Library Covers API, and enables you to mark books as completed or still in progress.

# 🚀 Features
* 📖 Add books 
* 🖼️ Fetch book covers
* View your books 
* 📝 Add/view/delete notes attacahed to books
* ⭐ Rate books and edit readint status
* 🔍 Filter books;
* 🌓 Dark Mode Support;
* 🧠 Single-Page App (SPA)-like behavior: only re-renders when filtering books.
* 🗄️ Uses PostgreSQL for persistent data storage.


## 🧩 Tech Stack
* Backend-Node.js, Express.js
* Database-PostgreSQL
* Templating-EJS
* Frontend-HTML, CSS, JavaScript
* Environment-dotenv
* API-Open Library Covers API
* Version Control-Git



### 🧠 How It Works
* Users can add a new book by entering the title, author, and identifier. They may also provide a rating at this stage if they wish, though this can be done later instead.
* The app fetches the cover image from the Open Library Covers API. If successful, the image is downloaded and saved to a designated path; otherwise, the image URL is stored in the database.
* The home page lists all books.
Each book:
* Shows its Reading status (completed/not completed) and ratings
* Allows users to add a rating if one has not already been given, and to update the Reading status
* Lets users add and view chapter-based notes per book.
* Dark mode toggles automatically if your system prefers dark theme or manually via a button.

# 🧑‍💻 Contributing
* Fork the repository
* Create your feature branch 
(git checkout -b feature/awesome-feature)
* Commit your changes
(git commit -m "Add awesome feature")
* Push to the branch
(git push origin feature/awesome-feature)
* Open a Pull Request

### 🪪 License
* This project is licensed under the MIT License

# installation and setup
1. Clone the Repository (git clone https://github.com/toriola5/Book_app.git cd Book_app)
2. Install Dependencies (npm install)

3. Configure Environment Variables 
* Create a .env file in the project root: 
DB_USER=your_db_user. DB_PASSWORD=your_db_password. DB_NAME=booknotes. DB_HOST=localhost. DB_PORT=5432.  PORT=3000

4. 🗄️ Database Setup
Prerequisites
* You need PostgreSQL installed locally.
If you don’t have it, visit the PostgreSQL Downloads page.

### Database Schema (SQL)
  Run this codes on psql
* Crete a new database of your choice.
    CREATE DATABASE bookapp
* Create books table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    id_type VARCHAR(50), // The book identification type
    Id_number TEXT,  // The book identificaton number
    image_path TEXT,
    rating INT,
    start_date DATE,  // The date you stared Reading the book;
    is_complited BOOLEAN DEFAULT FALSE, //The reading status is set to false by default and it chages when you mark as completed
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

### Relationship
📘 One-to-Many:
Each book can have many notes.
Each note belongs to one book (notes.book_id → books.id).

5. Run the application 
* npm start  (Ensure you have nodemon installed)
* Open in browser (htpp://localhost:3000)

