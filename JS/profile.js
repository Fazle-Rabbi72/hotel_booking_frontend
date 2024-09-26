const fetchUserData = async () => {
  const userId = localStorage.getItem("user_id");
  try {
    const response = await fetch(`http://127.0.0.1:8000/users/${userId}/`);
    const data = await response.json();
    console.log("email",data.email);

    // Displaying the user data on the page
    document.getElementById("username").innerText = data.username;
    document.getElementById("full-name").innerText =
      data.first_name + " " + data.last_name;
    document.getElementById("user-email").innerText = data.email; // Display email
    document.getElementById("balance").innerText = parseFloat(
      data.balance
    ).toFixed(2);

    // Populating the form fields with user data
    document.getElementById("edit-username").value = data.username;
    document.getElementById("edit-first-name").value = data.first_name;
    document.getElementById("edit-last-name").value = data.last_name;
    document.getElementById("edit-email").value = data.email; // Populate email field
  } catch (error) {
    console.error("Failed to fetch user data", error);
  }
};


// Handle deposit form submission
document.getElementById("deposit-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const amount = document.getElementById("deposit-amount").value;
  const token = localStorage.getItem("token"); // Fetch token from localStorage

  if (!token) {
      alert("You need to log in first.");
      return;
  }

  try {
      const response = await fetch("http://127.0.0.1:8000/deposit/", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Token ${token}`,  // Use the correct format for token
          },
          body: JSON.stringify({ 
              amount: amount 
          }),
      });

      if (response.ok) {
          const data = await response.json();
          alert(`Deposit successful! New balance: ${data.new_balance}`);
          // Optionally update UI with new balance
      } else {
          const errorData = await response.json();
          alert(`Failed to deposit money: ${errorData.error || 'Unknown error'}`);
      }
  } catch (error) {
      console.error("Error during deposit:", error);
      alert("An error occurred while processing the deposit.");
  }
});



document
  .getElementById("edit-profile-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("edit-username").value;
    const firstName = document.getElementById("edit-first-name").value;
    const lastName = document.getElementById("edit-last-name").value;
    const email = document.getElementById("edit-email").value;
    const userId = localStorage.getItem("user_id");
    const token = localStorage.getItem("token"); // Fetch token from localStorage

    console.log({ username, firstName, lastName, email });
    try {
      const response = await fetch(`http://127.0.0.1:8000/users/${userId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,  // Use the correct format for token
        },
        body: JSON.stringify({
          username: username,
          first_name: firstName,
          last_name: lastName,
          email:email
        }),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        fetchUserData(); 
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile", error);
    }
  });
document.addEventListener("DOMContentLoaded", fetchUserData);
