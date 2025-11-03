document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.toggle-btn');

  // Adding event listener to all the buttons of read status
  buttons.forEach(button => {
    button.addEventListener('click', async (event) => {
      const btn = event.target;
      const id = btn.dataset.id;
      const currentStatus = btn.dataset.status === 'true';
      const newStatus = !currentStatus;

      try {
        // Send the update to the server API
        const response = await fetch(`/books/update/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_complited: newStatus })
        });

        const result = await response.json();

        if (result.success) {
          // Update button text and dataset on the browser side
          btn.dataset.status = newStatus;
          btn.innerText = newStatus
            ? 'Mark as Not Completed'
            : 'Mark as Completed';
        } else {
          console.error('Update failed:', result.error);
        }
      } catch (error) {
        console.error('Request error:', error);
      }
    });
  });

  const btn = document.getElementById('showFormBtn');
  const form = document.getElementById('addBookForm');

  btn.addEventListener('click', () => {
    if (form.hasAttribute('hidden')) {
      form.removeAttribute('hidden'); // Show form
      btn.innerText = 'Hide Form';
    } else {
      form.setAttribute('hidden', ''); // Hide form
      btn.innerText = 'Add New Book';
    }
  });

  // Getting ratings when it was not defined at the beginning
  document.querySelectorAll('.star-rating').forEach(ratingDiv => {
    ratingDiv.addEventListener('click', async (event) => {
      if (event.target.classList.contains('star')) {
        const bookId = ratingDiv.getAttribute('data-id');
        const rating = event.target.getAttribute('data-value');

        try {
          // Send the rating update to the server
          const response = await fetch(`/books/update-rating/${bookId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating }),
          });

          const result = await response.json();

          if (result.success) {
            console.log('Rating updated:', result);

            // Update the UI to reflect the new rating as stars
            const parentDiv = ratingDiv.parentElement;
            const ratingParagraph = parentDiv.querySelector('.rating');
            ratingParagraph.innerHTML = Array.from({ length: 5 }, (_, i) =>
              i < rating ? '<span class="star gold">★</span>' : '<span class="star">☆</span>'
            ).join('');
            ratingDiv.remove(); // Remove the star-rating div after updating
          } else {
            console.error('Failed to update rating:', result.error);
          }
        } catch (error) {
          console.error('Error updating rating:', error);
        }
      }
    });
  });

  const formStarRating = document.getElementById('form-star-rating');
  const ratingInput = document.getElementById('rating-input');

  if (formStarRating) {
    formStarRating.addEventListener('click', (event) => {
      if (event.target.classList.contains('star')) {
        const selectedRating = event.target.getAttribute('data-value');
        ratingInput.value = selectedRating;

        // Update the stars to reflect the selected rating
        Array.from(formStarRating.children).forEach((star, index) => {
          star.textContent = index < selectedRating ? '★' : '☆';
          star.classList.toggle('gold', index < selectedRating);
        });
      }
    });
  }




  // Handle form submission for adding notes
  document.querySelectorAll('.add-notes-form').forEach(form => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent default form submission

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch('books/add-notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
          alert('Note added successfully!');
          form.reset(); // Clear the form inputs
          form.setAttribute('hidden', ''); // Hide the form after submission
        } else {
          alert(`Failed to add note: ${result.error}`);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert(`An error occurred while adding the note. ${error}`);
      }
    });
  });

  // Handle "View Notes" button click
  document.querySelectorAll('.show-notes-btn').forEach(button => {
    button.addEventListener('click', async (event) => {
      const bookId = event.target.getAttribute('data-id');
      const notesDiv = document.querySelector(`.show-notes-div[data-id="${bookId}"]`);

      // Check if the notesDiv is currently hidden or visible
      if (notesDiv.hasAttribute('hidden')) {
        try {
          const response = await fetch(`books/notes/${bookId}`);
          const result = await response.json();

          if (result.success) {
            // Clear the notesDiv and populate it with the fetched notes
            notesDiv.innerHTML = '';
            if (result.notes.length === 0) {
              // If no notes are available, display a message
              notesDiv.innerHTML = '<div class="note-item"><p>You have nothing in your notes. Start writing now.</p></div>';
            } else {
              result.notes.forEach(note => {
                const noteElement = document.createElement('div');
                noteElement.classList.add('note-item');
                noteElement.innerHTML = `
                  <p><strong>Chapter:</strong> ${note.subject}</p>
                  <p>${note.content}</p>
                  <button class="edit-note-btn" data-id="${note.id}" data-book-id="${bookId}">Edit</button>
                  <button class="delete-note-btn" data-id="${note.id}" data-book-id="${bookId}">Delete</button>
                `;
                notesDiv.appendChild(noteElement);
              });
            }

            // Show the notesDiv
            notesDiv.removeAttribute('hidden');
            button.textContent = 'Collapse Notes'; // Update button text
          } else {
            alert('Failed to fetch notes.');
          }
        } catch (error) {
          console.error('Error fetching notes:', error);
          alert('An error occurred while fetching notes.');
        }
      } else {
        // Hide the notesDiv and update the button text
        notesDiv.setAttribute('hidden', '');
        button.textContent = 'Show Notes';
      }
    });
  });

  // Handle "Delete Note" button click
  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-note-btn')) {
      const noteId = event.target.getAttribute('data-id');
      const bookId = event.target.getAttribute('data-book-id');
      const notesDiv = document.querySelector(`.show-notes-div[data-id="${bookId}"]`);

      try {
        const response = await fetch(`books/notes/${noteId}`, { method: 'DELETE' });
        const result = await response.json();

        if (result.success) {
          alert('Note deleted successfully!');
          // Refresh the notes list
          document.querySelector(`.show-notes-btn[data-id="${bookId}"]`).click();
        } else {
          alert('Failed to delete note.');
        }
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('An error occurred while deleting the note.');
      }
    }
  });

    // Toggle visibility of the add-notes-form and update button text
  document.querySelectorAll('.add_notes').forEach(button => {
    button.addEventListener('click', (event) => {
      const bookId = event.target.getAttribute('data-id');
      const notesForm = document.querySelector(`.add-notes-form[data-id="${bookId}"]`);

      if (notesForm.hasAttribute('hidden')) {
        notesForm.removeAttribute('hidden'); // Show the form
        button.textContent = 'Collapse Editor'; // Update button text
      } else {
        notesForm.setAttribute('hidden', ''); // Hide the form
        button.textContent = 'Add Notes'; // Update button text
      }
    });
  });

  document.getElementById('showQueryFormBtn').addEventListener('click', function() {
    const form = document.getElementById('filterForm');
    if (form.hasAttribute('hidden')) {
        form.removeAttribute('hidden');
    } else {
        form.setAttribute('hidden', '');
    }
});

//   document.getElementById('toggleDarkMode').addEventListener('click', function() {
//     document.body.classList.toggle('dark-mode');
// });

if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
}

// Toggle dark mode and save preference
document.getElementById('toggleDarkMode').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
});
  // Enable dark mode if user prefers it
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
  }

  // Optional: Listen for changes in user preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (e.matches) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  });
});

