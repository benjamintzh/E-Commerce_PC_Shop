$(document).ready(function () {
    const placeholderMessage = $("#placeholderMessage");
    const addressFormContainer = $("#addressFormContainer");
    const shopInfoContainer = $("#shopInfoContainer");
    const timeSlotsContainer = $("#timeSlots");
    const shopTimeSlotsContainer = $("#shopTimeSlots");

    // Load user details and auto-fill the form
    function loadUserDetails() {
        $.ajax({
            url: "../php-files/fetch-user.php",
            type: "GET",
            dataType: "json",
            success: function (response) {
                console.log("User Details Response:", response);
                if (response.status === "success") {
                    let user = response.data;
                    $("#contactName").val(user.username);
                    $("#phoneNumber").val(user.phone_number);
                    $("#email").val(user.email);
                    $("#address1").val(user.address_line1 || "");
                    $("#address2").val(user.address_line2 || "");
                    $("#postalCode").val(user.postal_code || "");
                    $("#country").val(user.country || "");
                    $("#state").val(user.state || "");
                    $("#city").val(user.city || "");
                } else {
                    console.warn("User data not available.");
                }
            },
            error: function (xhr, status, error) {
                console.error("Error fetching user data:", status, error);
            }
        });
    }

    // Handle Service Type Selection
    $(".serviceType").change(function () {
        if ($("#onSite").is(":checked")) {
            placeholderMessage.hide();
            shopInfoContainer.hide();
            addressFormContainer.show();
            loadUserDetails(); // Auto-fill user details for On-Site
        } else if ($("#inHouse").is(":checked")) {
            placeholderMessage.hide();
            addressFormContainer.hide();
            shopInfoContainer.show();
        }
    });

    // Generate Time Slots (9AM - 5PM in 1-hour intervals)
    function generateTimeSlots(container) {
        container.empty();
        for (let hour = 9; hour < 18; hour++) {
            let timeText = `${hour}:00`;
            let button = $("<button>")
                .addClass("btn btn-outline-primary time-btn m-2")
                .text(timeText)
                .attr("data-time", timeText)
                .click(function (e) {
                    e.preventDefault();
                    $(".time-btn").removeClass("active");
                    $(this).addClass("active");
                });
            container.append(button);
        }
    }

    // Load Time Slots for both sections
    generateTimeSlots(timeSlotsContainer);
    generateTimeSlots(shopTimeSlotsContainer);

    // Handle On-Site Appointment Submission
    $("#appointmentForm").submit(function (e) {
        e.preventDefault();
        if (!$("#onSite").is(":checked")) return;

        let appointmentTime = $(".time-btn.active").attr("data-time");
        if (!appointmentTime) {
            alert("Please select a time slot.");
            return;
        }

        let formData = {
            user_id: 1, // Replace with dynamic user ID
            service_type: "On-site",
            contact_name: $("#contactName").val(),
            phone: $("#phoneNumber").val(),
            email: $("#email").val(),
            address1: $("#address1").val(),
            address2: $("#address2").val(),
            postal_code: $("#postalCode").val(),
            country: $("#country").val(),
            city: $("#city").val(),
            state: $("#state").val(),
            appointment_date: $("#appointmentDate").val(),
            appointment_time: appointmentTime
        };

        $.ajax({
            url: "../php-files/save-appointment.php",
            type: "POST",
            data: JSON.stringify(formData),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    alert(response.message);
                    window.location.href = "../html-files/profile.html?tab=appointment";
                } else {
                    alert("Error: " + response.message);
                }
            },
            error: function (xhr) {
                console.error("Error saving appointment:", xhr.responseText);
                alert("An error occurred while saving the appointment.");
            }
        });
    });

    // Handle In-House Appointment Submission (Without Address Fields)
    $("#bookShopAppointment").click(function () {
        let appointmentTime = $(".time-btn.active").attr("data-time");
        if (!appointmentTime) {
            alert("Please select a time slot.");
            return;
        }

        let formData = {
            user_id: 1, // Replace with dynamic user ID
            service_type: "In-house",
            contact_name: $("#contactName").val(),
            phone: $("#phoneNumber").val(),
            email: $("#email").val(),
            appointment_date: $("#shopAppointmentDate").val(),
            appointment_time: appointmentTime
        };

        $.ajax({
            url: "../php-files/save-appointment.php",
            type: "POST",
            data: JSON.stringify(formData),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    alert(response.message);
                    window.location.href = "../html-files/profile.html?tab=appointment";
                } else {
                    alert("Error: " + response.message);
                }
            },
            error: function (xhr) {
                console.error("Error saving appointment:", xhr.responseText);
                alert("An error occurred while saving the appointment.");
            }
        });
    });

    // Auto-Fill User Details on Page Load
    loadUserDetails();
});
