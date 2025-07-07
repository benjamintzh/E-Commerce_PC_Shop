document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("admin-appointment.html")) {
        fetchAppointments();
        setupSearchFunctionality();
    }
});

// Fetch and Display Appointments with Statistics
function fetchAppointments() {
    fetch("http://localhost/DSC115-Project/admin-php-files/fetch-appointment.php")
        .then(response => response.json())
        .then(appointments => {
            let table = document.getElementById("appointmentTable");
            let totalAppointments = document.getElementById("totalAppointments");
            let confirmedAppointments = document.getElementById("confirmedAppointments");
            let cancelledAppointments = document.getElementById("cancelledAppointments");

            if (!table) return;

            // Clear Table
            table.innerHTML = "";
            if (appointments.length === 0) {
                table.innerHTML = `<tr><td colspan="7" class="text-center">No active appointments found.</td></tr>`;
            }

            // Initialize Counters
            let total = 0;
            let confirmed = 0;
            let cancelled = 0;

            appointments.forEach((appointment, index) => {
                total++;
                if (appointment.status === "Confirmed") confirmed++;
                if (appointment.status === "Cancelled") cancelled++;

                let statusClass = "status-pending";
                if (appointment.status === "Confirmed") statusClass = "status-confirmed";
                if (appointment.status === "Cancelled") statusClass = "status-cancelled";
                if (appointment.status === "Completed") statusClass = "status-completed";

                table.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${appointment.contact_name || "N/A"}</td>
                        <td>${appointment.service_type || "N/A"}</td>
                        <td>${appointment.appointment_date || "N/A"}</td>
                        <td>${appointment.appointment_time || "N/A"}</td>
                        <td><span class="status-badge ${statusClass}">${appointment.status || "Pending"}</span></td>
                        <td>
                            <select class="status-dropdown" data-id="${appointment.appointment_id}">
                                <option value="Pending" ${appointment.status === "Pending" ? "selected" : ""}>Pending</option>
                                <option value="Completed" ${appointment.status === "Completed" ? "selected" : ""}>Completed</option>
                                <option value="Cancelled" ${appointment.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
                            </select>
                        </td>
                    </tr>
                `;
            });

            // Update Statistics
            totalAppointments.innerText = total;
            confirmedAppointments.innerText = confirmed;
            cancelledAppointments.innerText = cancelled;

            // Attach event listeners to status dropdowns
            document.querySelectorAll(".status-dropdown").forEach(dropdown => {
                dropdown.addEventListener("change", function () {
                    let appointmentId = this.getAttribute("data-id");
                    let newStatus = this.value;
                    updateAppointmentStatus(appointmentId, newStatus);
                });
            });
        })
        .catch(error => console.error("❌ Error fetching appointments:", error));
}

// Update Appointment Status Function
function updateAppointmentStatus(appointmentId, newStatus) {
    fetch("http://localhost/DSC115-Project/admin-php-files/update-appointment-status.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `appointment_id=${appointmentId}&status=${newStatus}`,
    })
    .then(response => response.text())
    .then(data => {
        if (data.includes("success")) {
            alert("✅ Appointment status updated successfully!");
            fetchAppointments(); // Refresh table to reflect changes
        } else {
            alert("❌ Error updating status: " + data);
        }
    })
    .catch(error => console.error("❌ Error:", error));
}

// Search Functionality
function setupSearchFunctionality() {
    const searchInput = document.getElementById("searchAppointment");

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            let searchTerm = searchInput.value.toLowerCase();
            let rows = document.querySelectorAll("#appointmentTable tr");

            rows.forEach(row => {
                let contactName = row.cells[1]?.textContent.toLowerCase() || "";
                if (contactName.includes(searchTerm)) {
                    row.style.display = "";
                } else {
                    row.style.display = "none";
                }
            });
        });
    }
}
