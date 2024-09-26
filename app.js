document.addEventListener("DOMContentLoaded", () => {
  const roomsList = document.getElementById("rooms-list");

  // Fetch rooms from the API
  fetch("http://127.0.0.1:8000/rooms/")
    .then((response) => response.json())
    .then((rooms) => {
      // Clear any existing rooms (if needed)
      roomsList.innerHTML = "";

      // Loop through the rooms and create HTML elements for each
      rooms.forEach((room) => {
        const roomCard = `
             <div class="col-md-4">
              <div class="card room__card">
                <img src="${room.image}" class="card-img-top" alt="${room.name}" />
                <div class="card-body">
                  <h5 class="card-title">${room.room_type}</h5>
                  <h6>Starting from <span>$${room.price_per_night}/night</span></h6>
                  <div class="d-flex justify-content-between mt-2">
                    <a href="../HTML/roomDetails.html?room_id=${room.id}" class="btn btn-secondary w-50">Details</a>
                  </div>
                </div>
              </div>
            </div>
          `;

        // Append the room card to the rooms list
        roomsList.innerHTML += roomCard;
      });
    })
    .catch((error) => {
      console.error("Error fetching rooms:", error);
    });
});

// for handaling nav for logged in user
document.addEventListener("DOMContentLoaded", () => {
  const profileDropdown = document.getElementById("profileDropdown");
  const loginItem = document.getElementById("loginItem");

  // Check if the user is logged in
  const token = localStorage.getItem("token");

  if (token) {
    // User is logged in
    profileDropdown.style.display = "block"; // Show profile dropdown
    loginItem.style.display = "none"; // Hide login button
  } else {
    // User is not logged in
    profileDropdown.style.display = "none"; // Hide profile dropdown
    loginItem.style.display = "block"; // Show login button
  }

  // Logout functionality
  document.getElementById("logout").addEventListener("click", () => {
    // Clear local storage and redirect to login
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    window.location.href = "/index.html";
  });
});
// for searching available room for booking .........
const searchRoom = (event) => {
  event.preventDefault();
  
  // Get the check-in and check-out dates from the form
  const check_in_date = document.getElementById("check-in").value;
  const check_out_date = document.getElementById("check-out").value;
  
  // Log the dates (for debugging purposes)
  console.log(check_in_date, check_out_date);
  
  // Create the payload for the POST request
  const info = {
    check_in_date: check_in_date,
    check_out_date: check_out_date,
  };

  // Ensure both dates are provided
  if (!check_in_date || !check_out_date) {
    alert("Please provide both check-in and check-out dates.");
    return;
  }

  // Send the POST request to the check availability API
  fetch("http://127.0.0.1:8000/rooms/check_availability/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
  })
    .then((response) => response.json())
    .then((data) => {
      const roomsList = document.getElementById("rooms-list");

      // Handle any errors from the API
      if (data.error) {
        alert(data.error);
        return;
      }

      // Clear any previous room listings
      roomsList.innerHTML = "";

      // Check if any rooms are available
      if (data.length > 0) {
        // Loop through available rooms and display them
        data.forEach((room) => {
          const roomCard = `
            <div class="col-md-4">
              <div class="card room__card">
                <img src="${room.image}" class="card-img-top" alt="${room.room_type}" />
                <div class="card-body">
                  <h5 class="card-title">${room.room_type}</h5>
                  <h6>Starting from <span>$${room.price_per_night}/night</span></h6>
                  <div class="d-flex justify-content-between mt-2">
                    <a href="../HTML/roomDetails.html?room_id=${room.id}" class="btn btn-secondary w-50">Details</a>
                  </div>
                </div>
              </div>
            </div>
          `;

          // Append the room card to the room list
          roomsList.innerHTML += roomCard;
        });
      } else {
        // Display a message if no rooms are available
        roomsList.innerHTML = "<p class='text-center'>No rooms available for the selected dates.</p>";
      }
    })
    .catch((error) => {
      console.error("Error checking room availability:", error);
      alert("There was an error checking room availability. Please try again.");
    });
    const roomContainer = document.getElementById('rooms-section');
    if (roomContainer) {
        roomContainer.scrollIntoView({ behavior: 'smooth' });  // Smooth scroll
    } else {
        console.error('Element with ID "rooms-section" not found.');
    }
};

// for reviews
document.addEventListener("DOMContentLoaded", function() {
  const reviewsContainer = document.getElementById("reviews-container");

  // Assuming the token is stored in localStorage after login
  const token = localStorage.getItem("token"); // Adjust based on how you store the token

  // Fetch reviews from the API with authentication
  fetch("http://127.0.0.1:8000/reviews/", {
    headers: {
      "Authorization": `Token ${token}` // Send the token in the Authorization header
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((reviews) => {
      let reviewsMarkup = "";
      let chunkSize = 5; // Display 5 reviews per slide

      // Split the reviews into chunks of 5
      for (let i = 0; i < reviews.length; i += chunkSize) {
        let reviewsChunk = reviews.slice(i, i + chunkSize);
        let isActive = i === 0 ? "active" : ""; // Make the first slide active

        reviewsMarkup += `
          <div class="carousel-item ${isActive}">
            <div class="row justify-content-center">
              ${reviewsChunk
                .map(
                  (review) => `
                <div class="col-md-2 mx-2">
                  <div class="card review__card">
                    <div class="card-body">
                      <h5 class="card-title">${review.user_name}</h5>
                      <p class="card-text">${review.comment}</p>
                      <p class="text-warning">${review.rating}</p>
                    </div>
                  </div>
                </div>`
                )
                .join("")}
            </div>
          </div>`;
      }

      // Insert reviews into the carousel container
      reviewsContainer.innerHTML = reviewsMarkup;
    })
    .catch((error) => {
      console.error("Error fetching reviews:", error);
    });
});


