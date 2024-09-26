document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission
  
    // Get form values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    // Ensure both fields are filled
    if (!username || !password) {
      document.getElementById('error').innerText = 'Username and password are required';
      return;
    }
  
    // Prepare login data
    const loginData = {
      username: username,
      password: password,
    };
  
    try {
      // Call the login API with POST request
      const response = await fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
  
      // Parse the JSON response
      const data = await response.json();
  
      if (response.ok) {
        // If login is successful, store token and user ID
        if (data.token && data.user_id) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user_id', data.user_id);
  
          // Redirect to another page after successful login
          window.location.href = '/index.html';
        }
      } else {
        // If login failed, display "Invalid Credentials" and remove tokens
        document.getElementById('error').innerText = 'Invalid Credentials';
        localStorage.removeItem('token');  // Ensure token is not stored
        localStorage.removeItem('user_id'); // Ensure user ID is not stored
      }
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('error').innerText = 'An error occurred while trying to log in.';
    }
  });
  