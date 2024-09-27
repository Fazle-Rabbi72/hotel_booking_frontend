document.addEventListener("DOMContentLoaded", () => {
  const roomsList = document.getElementById("rooms-list");
  const paginationControls = document.getElementById("pagination-controls");
  let currentPage = 1;
  const itemsPerPage = 18;

  const fetchRooms = (page) => {
    fetch(
      `https://natures-paradise-stlb.onrender.com/rooms/?page=${page}&limit=${itemsPerPage}`
    )
      .then((response) => response.json())
      .then((data) => {
        const rooms = data.results;
        const totalRooms = data.count;

        roomsList.innerHTML = "";

        rooms.forEach((room) => {
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

          roomsList.innerHTML += roomCard;
        });

        const totalPages = Math.ceil(totalRooms / itemsPerPage);
        updatePaginationControls(totalPages);
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
      });
  };

  const updatePaginationControls = (totalPages) => {
    paginationControls.innerHTML = `
      <button id="prev-btn" class="btn btn-secondary" ${
        currentPage === 1 ? "disabled" : ""
      }>Previous</button>
      <span> Page ${currentPage} of ${totalPages} </span>
      <button id="next-btn" class="btn btn-secondary" ${
        currentPage === totalPages ? "disabled" : ""
      }>Next</button>
    `;

    document.getElementById("prev-btn").addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        fetchRooms(currentPage);
      }
    });

    document.getElementById("next-btn").addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        fetchRooms(currentPage);
      }
    });
  };

  fetchRooms(currentPage);
});

document.addEventListener("DOMContentLoaded", () => {
  const profileDropdown = document.getElementById("profileDropdown");
  const loginItem = document.getElementById("loginItem");

  const token = localStorage.getItem("token");

  if (token) {
    profileDropdown.style.display = "block";
    loginItem.style.display = "none";
  } else {
    profileDropdown.style.display = "none";
    loginItem.style.display = "block";
  }

  // Logout functionality
  document.getElementById("logout").addEventListener("click", () => {
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

  const info = {
    check_in_date: check_in_date,
    check_out_date: check_out_date,
  };

  // Ensure both dates are provided
  if (!check_in_date || !check_out_date) {
    alert("Please provide both check-in and check-out dates.");
    return;
  }

  fetch(
    "https://natures-paradise-stlb.onrender.com/rooms/check_availability/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(info),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      const roomsList = document.getElementById("rooms-list");

      if (data.error) {
        alert(data.error);
        return;
      }

      roomsList.innerHTML = "";

      if (data.length > 0) {
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

          roomsList.innerHTML += roomCard;
        });
      } else {
        roomsList.innerHTML =
          "<p class='text-center'>No rooms available for the selected dates.</p>";
      }
    })
    .catch((error) => {
      console.error("Error checking room availability:", error);
      alert("There was an error checking room availability. Please try again.");
    });
  const roomContainer = document.getElementById("rooms-section");
  if (roomContainer) {
    roomContainer.scrollIntoView({ behavior: "smooth" });
  } else {
    console.error('Element with ID "rooms-section" not found.');
  }
};

// for reviews
document.addEventListener("DOMContentLoaded", function () {
  const reviewsContainer = document.getElementById("reviews-container");

  // Assuming the token is stored in localStorage after login
  const token = localStorage.getItem("token"); // Adjust based on how you store the token

  // Fetch reviews from the API with authentication
  fetch("https://natures-paradise-stlb.onrender.com/reviews/")
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

// contact us
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");
  const feedbackElement = document.getElementById("contact-feedback");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form from submitting the traditional way

    // Gather form data
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const problem = document.getElementById("problem").value;

    // Create the request body
    const formData = {
      name: name,
      phone: phone,
      problem: problem,
    };

    // Send the data to the server
    fetch("https://natures-paradise-stlb.onrender.com/contact_us/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          // Display success message
          feedbackElement.textContent =
            "Thank you for contacting us. We will get back to you soon!";
          feedbackElement.classList.add("text-success");
        } else {
          // Display error message
          feedbackElement.textContent =
            "Something went wrong. Please try again.";
          feedbackElement.classList.add("text-danger");
        }

        // Clear form fields
        contactForm.reset();
      })
      .catch((error) => {
        console.error("Error:", error);
        feedbackElement.textContent =
          "There was an error sending your message. Please try again.";
        feedbackElement.classList.add("text-danger");
      });
  });
});
