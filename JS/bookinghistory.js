// Fetch booking data from the API
const userId = localStorage.getItem("user_id");
fetch(`https://natures-paradise-stlb.onrender.com/bookings/?user_id=${userId}`)
  .then((response) => response.json())
  .then((bookings) => {
    const tableBody = document.getElementById("booking-history-table");
    bookings.forEach((booking) => {
      const row = document.createElement("tr");

      // Room image
      const roomImageCell = document.createElement("td");
      const roomImage = document.createElement("img");
      roomImage.src = booking.image;
      roomImage.alt = "Room Image";
      roomImage.style.width = "100px";
      roomImageCell.appendChild(roomImage);
      row.appendChild(roomImageCell);

      // Check-in date
      const checkInCell = document.createElement("td");
      checkInCell.textContent = booking.check_in_date;
      row.appendChild(checkInCell);

      // Check-out date
      const checkOutCell = document.createElement("td");
      checkOutCell.textContent = booking.check_out_date;
      row.appendChild(checkOutCell);

      // Guest number
      const guestNumberCell = document.createElement("td");
      guestNumberCell.textContent = booking.guest_number;
      row.appendChild(guestNumberCell);

      // Status
      const statusCell = document.createElement("td");
      statusCell.textContent = booking.status;

      // Apply styles based on status
      if (booking.status === "Confirmed") {
        statusCell.classList.add("status-confirmed");
        statusCell.style.color = "green"; // Green text
        statusCell.style.fontWeight = "bold"; // Bold text
      } else if (booking.status === "Pending") {
        statusCell.classList.add("status-pending");
        statusCell.style.color = "orange"; // Orange text
      } else if (booking.status === "Cancelled") {
        statusCell.classList.add("status-cancelled");
        statusCell.style.color = "red"; // Red text
        statusCell.style.fontWeight = "bold"; // Bold text
      }
      row.appendChild(statusCell);

      // Action (Cancel button)
      const actionCell = document.createElement("td");
      const cancelButton = document.createElement("button");
      cancelButton.textContent = "Cancel";
      cancelButton.classList.add("btn", "btn-danger", "cancel-button");
      if (booking.status === "Confirmed" || booking.status === "Cancelled") {
        cancelButton.disabled = true;
      } else {
        cancelButton.onclick = () => cancelBooking(booking.id);
      }
      actionCell.appendChild(cancelButton);
      row.appendChild(actionCell);

      // Append row to table
      tableBody.appendChild(row);
    });
  })
  .catch((error) => console.error("Error fetching bookings:", error));

// Function to cancel a booking
function cancelBooking(bookingId) {
  // Fetch the current booking details first
  fetch(`https://natures-paradise-stlb.onrender.com/bookings/${bookingId}/`)
    .then((response) => response.json())
    .then((data) => {
      const updatedData = {
        status: "Cancelled",
        user: data.user,
        room: data.room,
        check_in_date: data.check_in_date,
        check_out_date: data.check_out_date,
      };

      return fetch(`https://natures-paradise-stlb.onrender.com/bookings/${bookingId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update booking status");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Booking status updated:", data);
      location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  }