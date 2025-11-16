# 📚 Book Notes Web Application

Book Notes is a comprehensive Node.js web application designed to help you manage your personal reading library. It allows you to add books, record chapter-based notes, monitor your reading progress, rate books, and maintain a personal account with secure authentication. All data is stored in a PostgreSQL database with session management for a seamless user experience.

## 🚀 Features

### 📖 Book Management
* Add books with title, author, and ISBN/LCCN/OCLC/OL identifiers
* Automatically fetch and download book covers via Open Library Covers API
* View your personal book collection
* Filter books by rating and completion status

### 📝 Note Taking & Progress Tracking
* Add, view, and delete chapter-based notes for each book
* Mark books as completed or in-progress
* Rate books with a 5-star system
* Track reading start dates

### 👤 User Authentication
* User registration with email verification
* Secure login/logout functionality
* Email verification system with re-verification options
* Session-based authentication using Passport.js

### 🎨 User Experience
* 🌓 Dark mode support (auto-detects system preference)
* 📱 Responsive design for all devices
* ⚡ SPA-like behavior with dynamic filtering
* 🔔 Flash message notifications

## 🧩 Tech Stack

### Backend
* **Node.js** - Runtime environment
* **Express.js** - Web framework
* **PostgreSQL** - Database with connection pooling
* **Passport.js** - Authentication middleware
* **express-session** - Session management with PostgreSQL store

### Frontend
* **EJS** - Server-side templating
* **HTML/CSS** - Responsive UI with dark mode
* **Vanilla JavaScript** - Client-side interactions

### Services & APIs
* **Nodemailer** - Email service integration
* **Open Library Covers API** - Book cover fetching
* **Multer** - File upload handling
* **dotenv** - Environment configuration

### Development
* **Git** - Version control
* **nodemon** - Development server

## 🏗️ Architecture

### Database Schema
The application uses three main tables:

1. **users** - User accounts and authentication
2. **books** - Book information and metadata
3. **notes** - Chapter-based notes linked to books
4. **session** - Session storage (auto-created)

### Project Structure
```
Book_app/
├── db/                     # Database configuration
├── routes/                 # Express route handlers
│   ├── book.js            # Book CRUD operations
│   ├── bookAction.js      # Book interactions (rating, status)
│   └── registration-login.js # Authentication routes
├── views/                  # EJS templates
│   ├── partials/          # Reusable components
│   └── *.ejs             # Page templates
├── public/                # Static assets
│   ├── styles/           # CSS files
│   ├── js/              # Client-side JavaScript
│   └── uploads/         # Downloaded book covers
├── services/             # External API services
└── index.js             # Main application entry point
```

## 🛠️ Installation and Setup

### Prerequisites
* **Node.js** (v14 or higher)
* **PostgreSQL** (v12 or higher)
* **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/toriola5/Book_app.git
cd Book_app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:

```env
# Database Configuration
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=booknotes
DB_HOST=localhost
DB_PORT=5432

# Server Configuration
PORT=3000

# Session Security
SESSION_SECRET=your_very_secure_session_secret

# Email Configuration (for verification)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 4. Database Setup

#### Create Database
```sql
CREATE DATABASE booknotes;
```

#### Create Tables
```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_code VARCHAR(6),
    verification_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    id_type VARCHAR(50),
    id_number TEXT,
    image_path TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    start_date DATE DEFAULT CURRENT_DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);

-- Notes table
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
```

### 5. Run the Application
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

### 6. Access the Application
Open your browser and navigate to `http://localhost:3000`

## 🧠 How It Works

### User Journey
1. **Registration**: Create account with email verification
2. **Login**: Secure authentication with session management
3. **Add Books**: Enter book details, app fetches cover automatically
4. **Track Reading**: Mark progress, add ratings, take notes
5. **Organize**: Filter and view your personal library

### Key Features
* **Automatic Cover Fetching**: Uses Open Library API to download book covers
* **Session Management**: PostgreSQL-backed sessions for security
* **Email Verification**: Ensures valid user accounts
* **Responsive Design**: Works on desktop, tablet, and mobile
* **Dark Mode**: Automatic detection with manual toggle

## 🧑‍💻 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes (`git commit -m 'Add awesome feature'`)
4. Push to the branch (`git push origin feature/awesome-feature`)
5. Open a Pull Request

### Development Guidelines
* Follow existing code style and structure
* Add comments for complex functionality
* Test new features thoroughly
* Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 Troubleshooting

### Common Issues

**Database Connection Error**
* Ensure PostgreSQL is running
* Verify database credentials in `.env`
* Check if database and tables exist

**Email Verification Not Working**
* Configure email settings in `.env`
* For Gmail, use app-specific passwords
* Check spam folder for verification emails

**Book Covers Not Loading**
* Verify internet connection for Open Library API
* Check `public/uploads` directory permissions
* Ensure proper book identifier format

## 🚀 Future Enhancements

* 📊 Reading statistics and analytics
* 📚 Book recommendations
* 👥 Social features and book sharing
* 📱 Mobile app development
* 🔍 Advanced search and categorization