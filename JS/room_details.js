const roomDetails = () => {
  const param = new URLSearchParams(window.location.search).get("room_id");
  console.log("param", param);
  console.log(param);
  if (param) {
    // Fetch room details from the API
    fetch(`http://127.0.0.1:8000/rooms/${param}/`)
      .then((response) => response.json())
      .then((room) => {
        // Create HTML to display room details
        const roomDetails = `
                       <div class="card room-detail-card shadow-lg border-0">
                    <div class="row g-0">
                        <!-- Image Column -->
                        <div class="col-md-6">
                        <img src="${room.image}" class="img-fluid rounded-start" alt="${room.room_type}" style="height: 100%; object-fit: cover;">
                        </div>
                        
                        <!-- Details Column -->
                        <div class="col-md-6">
                        <div class="card-body p-4 d-flex flex-column justify-content-center">
                            <h5 class="card-title fw-bold">${room.room_type}</h5>
                            <p class="card-text text-muted mb-1">
                            <strong>Price per night:</strong> $${room.price_per_night}
                            </p>
                            
                            </p>
                            <p class="card-text">${room.descirption}</p>
                            <button class="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#bookingModal">Book Now</button>

                        </div>
                        </div>
                    </div>
                    </div>


            `;

        // Insert the details into the DOM
        document.getElementById("room-details").innerHTML = roomDetails;
      })
      .catch((error) => {
        console.error("Error fetching room details:", error);
        document.getElementById("room-details").innerText =
          "Failed to load room details.";
      });
  } else {
    document.getElementById("room-details").innerText = "Room ID not found.";
  }
};
// room booking

const roomBooking = (event) => {
  event.preventDefault();

  // Fetch the token and user_id from localStorage

  const user = localStorage.getItem("user_id");

  const param = new URLSearchParams(window.location.search).get("room_id");

  fetch(`http://127.0.0.1:8000/rooms/${param}/`)
    .then((res) => res.json())
    .then((data) => {
      const price_per_night = data.price_per_night;
      const token = localStorage.getItem("token");
      console.log(token, user, param);
      console.log("Authorization", `Bearer ${token}`);
      const check_in = document.getElementById("check-in").value;
      const check_out = document.getElementById("check-out").value;
      const guest = document.getElementById("guest-number").value;

      // Calculate nights and total price
      const nights =
        (new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24);
      const totalPrice = price_per_night * nights;

      const bookingData = {
        user: user,
        room: param,
        check_in_date: check_in,
        check_out_date: check_out,
        guest_number: guest,
        total_price: totalPrice.toFixed(2), // Ensure price has 2 decimal places
        status: "Pending",
      };

      // Make the booking API request
      fetch("http://127.0.0.1:8000/bookings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`, // Correctly pass the token here
        },
        body: JSON.stringify(bookingData),
      })
        .then((response) => {
          console.log("response", response);
          if (!response.ok) {
            return response.json().then((errorData) => {
              // Show the error message in an alert
              alert(errorData.error || "An error occurred while booking.");
              throw new Error("Failed to create booking");
            });
          }
          return response.json();
        })
        .then((data) => {
          console.log("Booking successful:", data);
          alert("Booking successful!");
          location.reload();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
};

roomDetails();

// reviews

document.addEventListener("DOMContentLoaded", function () {
  const roomId = new URLSearchParams(window.location.search).get("room_id");
  const reviewsApiUrl = `http://127.0.0.1:8000/reviews/?room_id=${roomId}`;
  const token = localStorage.getItem("token");
  // Fetch and display reviews
  fetch(reviewsApiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`, // Correctly pass the token here
    },
  })
    .then((response) => response.json())
    .then((data) => loadReviews(data))
    .catch((error) => console.error("Error fetching reviews:", error));

  function loadReviews(reviews) {
    const reviewContainer = document.getElementById("review-container");
    let activeClass = "active";

    reviews.forEach((review, index) => {
      if (index % 4 === 0) {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("carousel-item");
        if (index === 0) itemDiv.classList.add(activeClass);
        itemDiv.innerHTML = `
          <div class="row">
            ${reviews
              .slice(index, index + 4)
              .map(createReviewCard)
              .join("")}
          </div>
        `;
        reviewContainer.appendChild(itemDiv);
      }
    });
  }

  function createReviewCard(review) {
    return `
      <div class="col-md-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${review.user_name}</h5>
            <p class="card-text">${review.comment}</p>
            <p class="card-text"><small class="text-muted">Rating: ${review.rating}/5</small></p>
          </div>
        </div>
      </div>
    `;
  }
});

// Fetch user booking confirmation status
const reviewSubmit = (event) => {
  event.preventDefault();

  const userHasConfirmedBooking = true;
  const submitReviewEndpoint = `http://127.0.0.1:8000/reviews/`;
  // Extract room_id from the URL
  const roomId = new URLSearchParams(window.location.search).get("room_id");
  const reviewsEndpoint = `http://127.0.0.1:8000/reviews/?room_id=${roomId}`;
  console.log("Extracted room_id:", roomId);
  const token = localStorage.getItem("token");
  function fetchReviews() {
    fetch(reviewsEndpoint)
        .then(response => response.json())
        .then(data => {
            createReviewCard(data);
        })
        .catch(error => {
            console.error('Error fetching reviews:', error);
        });
}
  // Ensure roomId is valid before proceeding
  if (!roomId) {
    alert("Room ID is missing from the URL. Cannot submit review.")
    return;
  }
  if(!token){
    alert("You are not allowed to submit a review as you haven't confirmed a booking.")
  }

  const formData = new FormData(reviewForm);
  const rating = formData.get("rating");
  const comment = formData.get("comment");

  // Check if the user is allowed to submit a review
  if (!userHasConfirmedBooking) {
    
      alert("You are not allowed to submit a review as you haven't confirmed a booking.",)
    
    return;
  }

  // Prepare the review data
  const reviewData = {
    room: roomId,
    rating: rating,
    comment: comment,
  };

  // Post the review to the server
  fetch(submitReviewEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`, // Corrected the header
    },
    body: JSON.stringify(reviewData),
  })
    .then((response) => response.json())

    .then((data) => {
      console.log("data", data);
      if (data.id) {
        alert("Review submitted successfully!");
        fetchReviews(); // Refresh the reviews list
        reviewForm.reset(); // Reset the form
      }
      else
      {
        alert(data[0]);
      }
    })
    
};
