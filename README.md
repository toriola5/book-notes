# 📚 Book Notes
Book Notes is a Node.js web application for tracking books, managing notes, and organizing your reading progress.
It lets users add books with cover images, mark them as completed/not completed, rate them, and create chapter-based notes — all stored in a PostgreSQL database.
The app also integrates with the Open Library Covers API to fetch book cover images automatically.

# 🚀 Features
📖 Add and view books with details (title, author, identifiers like ISBN, LCCN, OCLC, or OLID).
🖼️ Automatically fetches book covers from the Open Library API — saves locally or via URL.
📝 Add, view, and delete notes linked to individual books.
⭐ Rate books and mark them as completed/not completed.
🔍 Filter books by rating or completion status.
🌓 Dark Mode Support — toggle manually or auto-switch based on system theme.
🧠 Single-Page App (SPA)-like behavior: only re-renders when filtering books.
🗄️ Uses PostgreSQL for persistent data storage.