document.addEventListener('DOMContentLoaded', function () {
    // Function to fetch users and render them
    function fetchUsers() {
        fetch('/admin')
        .then(response => response.json())
        .then(data => {
            const usersList = document.getElementById('usersList');
            usersList.innerHTML = '';
            data.users.forEach(user => {
                const userItem = document.createElement('div');
                userItem.innerHTML = `
                    <p>${user.username} <a href="/admin/edit/${user._id}">Edit</a> <button onclick="deleteUser('${user._id}')">Delete</button></p>
                `;
                usersList.appendChild(userItem);
            });
        })
        .catch(error => console.error('Error fetching users:', error));
    }

    // Function to add a new user
    document.getElementById('addUserForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        fetch('/admin/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (response.ok) {
                fetchUsers();
            } else {
                throw new Error('Failed to add user');
            }
        })
        .catch(error => console.error('Error adding user:', error));
    });

    // Function to delete a user
    window.deleteUser = function (userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            fetch(`/admin/delete/${userId}`, {
                method: 'POST'
            })
            .then(response => {
                if (response.ok) {
                    fetchUsers();
                } else {
                    throw new Error('Failed to delete user');
                }
            })
            .catch(error => console.error('Error deleting user:', error));
        }
    };

    // Fetch users when the page loads
    fetchUsers();
});