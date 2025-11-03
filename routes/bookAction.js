import express from 'express';
import db from '../db/index.js';


const router = express.Router();

router.post('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { is_complited } = req.body;

  try {
    await db.query('UPDATE books SET is_complited = $1 WHERE id = $2', [is_complited, id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database update failed' });
  }
});

router.post("/update-rating/:id", async (req, res) => {
    const bookId = req.params.id;
    const { rating } = req.body;

    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, error: "Invalid rating value" });
    }

    try {
        // Update the rating in the database
        const result = await db.query(
            "UPDATE books SET rating = $1 WHERE id = $2",
            [rating, bookId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, error: "Book not found" });
        }

        res.json({ success: true, message: "Rating updated successfully" });
    } catch (error) {
        console.error("Error updating rating:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});

router.post('/add-notes', async (req, res) => {
  const { bookId, chapter, note } = req.body;
  console.log(req.body)

  if (!bookId || !chapter || !note) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }

  try {
    // Insert the note into the database
    await db.query(
      'INSERT INTO notes (book_id, subject, content) VALUES ($1, $2, $3)',
      [bookId, chapter, note]
    );
    res.json({ success: true, message: 'Note added successfully' });
  } catch (err) {
    console.error('Error adding note:', err);
    res.status(500).json({ success: false, error: 'Failed to add note' });
  }
});

// Route to fetch notes for a specific book
router.get('/notes/:bookId', async (req, res) => {
  const { bookId } = req.params;

  try {
    const result = await db.query('SELECT * FROM notes WHERE book_id = $1 ORDER BY created_at ASC', [bookId]);
    res.json({ success: true, notes: result.rows });
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch notes' });
  }
});

router.delete('/notes/:noteId', async (req, res) => {
  const { noteId } = req.params;

  try {
    await db.query('DELETE FROM notes WHERE id = $1', [noteId]);
    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (err) {
    console.error('Error deleting note:', err);
    res.status(500).json({ success: false, error: 'Failed to delete note' });
  }
});



export default router;