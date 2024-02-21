 // Function to handle user deletion
 function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        fetch(`/admin/delete-user/${userId}`, {
            method: 'POST'
        })
        .then(response => {
            if (response.ok) {
                location.reload(); // Reload the page after successful deletion
            } else {
                throw new Error('Failed to delete user');
            }
        })
        .catch(error => {
            console.error('Error deleting user:', error.message);
            const deleteMessage = document.querySelector('.delete-message');
            deleteMessage.textContent = 'Failed to delete user. Please try again.';
            setTimeout(() => {
                deleteMessage.textContent = '';
            }, 3000);
        });
    }
}

// Function to handle user editing
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        const userId = formData.get('userId');
        const newName = formData.get('newName');

        fetch('/edit-user', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                const editMessage = form.querySelector('.edit-message');
                editMessage.textContent = 'User edited successfully.';
                setTimeout(() => {
                    editMessage.textContent = '';
                }, 3000);
            } else {
                throw new Error('Failed to edit user');
            }
        })
        .catch(error => {
            console.error('Error editing user:', error.message);
            const editMessage = form.querySelector('.edit-message');
            editMessage.textContent = 'Failed to edit user. Please try again.';
            setTimeout(() => {
                editMessage.textContent = '';
            }, 3000);
        });
    });
});