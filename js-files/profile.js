console.log("profile.js has loaded successfully.");

$(document).ready(function () {

  loadUserProfile();
  loadOrderTracking();
  loadAppointmentDetails();
  loadAddressInfo(); // ✅ Ensure function is defined below before calling it

  // ✅ Load User Profile
  function loadUserProfile() {
    $.ajax({
      url: "http://localhost/DSC115-Project/php-files/get-user-profile.php",
      type: "GET",
      dataType: "json",
      xhrFields: { withCredentials: true },
      success: function (response) {
        console.log("User Data:", response);
        if (response.success) {
          let data = response.user;
          $("#username").val(data.username);
          $("#email").val(data.email);
          $("#phone").val(data.phone_number);
          $("#sidebarUsername").text(data.username);

          if (data.profile_image && data.profile_image.trim() !== "") {
            const imgPath = "http://localhost/DSC115-Project/images/user-img/" + data.profile_image;
            $("#sidebarProfilePic").attr("src", imgPath).show();
            $("#defaultProfileIcon").hide();
            $("#profilePic").attr("src", imgPath);
          } else {
            $("#sidebarProfilePic").hide();
            $("#defaultProfileIcon").show();
            $("#profilePic").attr("src", "http://localhost/DSC115-Project/images/default-profile.png");
          }
        } else {
          alert("Error: " + response.message);
        }
      },
      error: function (xhr) {
        console.error("AJAX Error:", xhr.responseText);
      }
    });
  }

  // Edit profile functionality
  $("#editBtn").click(function () {
    if ($(this).text() === "Edit") {
      $("input").prop("disabled", false);
      $(this).text("Done");
    } else {
      let updatedData = {
        username: $("#username").val(),
        email: $("#email").val(),
        phone_number: $("#phone").val()
      };
      $.ajax({
        url: "http://localhost/DSC115-Project/php-files/update-profile.php",
        type: "POST",
        data: updatedData,
        dataType: "json",
        xhrFields: { withCredentials: true },
        success: function (response) {
          if (response.success) {
            $("input").prop("disabled", true);
            $("#editBtn").text("Edit");
            alert("Profile updated successfully!");
            loadUserProfile(); // Refresh profile info
          } else {
            alert("Failed to update profile: " + response.message);
          }
        },
        error: function (xhr, status, error) {
          console.error("AJAX error:", xhr.responseText);
          alert("Failed to update profile.");
        }
      });
    }
  });

  // When "Select Image" button is clicked, trigger the hidden file input click
  $("#selectImageBtn").click(function () {
    console.log("Select Image button clicked");
    $("#imageUpload").click();
  });

  // File input change event for image upload
  $("#imageUpload").change(function (event) {
    console.log("Image input change event fired");
    let file = event.target.files[0];
    if (!file) {
      console.log("No file selected.");
      return;
    }
    console.log("File selected:", file);

    // Preview the image in the right section (optional)
    let reader = new FileReader();
    reader.onload = function () {
      $("#profilePic").attr("src", reader.result);
    };
    reader.readAsDataURL(file);

    // Prepare FormData and append the file
    let formData = new FormData();
    formData.append("profile_image", file);
    console.log("FormData file:", formData.get("profile_image"));

    // Send the image via AJAX to upload-image.php
    $.ajax({
      url: "http://localhost/DSC115-Project/php-files/upload-image.php",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      xhrFields: { withCredentials: true },
      dataType: "json",
      success: function (response) {
        console.log("Upload response:", response);
        if (response.success) {
          alert("Image uploaded successfully!");
          // Refresh profile info to update the displayed images
          loadUserProfile();
        } else {
          alert("Image upload failed: " + response.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("Upload error:", xhr.responseText);
        alert("Image upload error: " + error);
      }
    });
  });

  // ✅ Auto-switch tab if "?tab=appointment" exists in URL
  function checkForTabRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const activeTab = urlParams.get("tab");

    if (activeTab) {
      $(".tab-content").hide();
      $("#" + activeTab).show();
      $(".nav-link").removeClass("active");
      $(".nav-link[data-target='" + activeTab + "']").addClass("active");
    } else {
      $("#personalInfo").show(); // Default tab
    }
  }

  // ✅ Load Appointment Details with Status
function loadAppointmentDetails() {
  $.ajax({
    url: "http://localhost/DSC115-Project/php-files/get-user-appointments.php",
    type: "GET",
    dataType: "json",
    xhrFields: { withCredentials: true },
    success: function (response) {
      console.log("Appointment Data:", response);
      if (response.success) {
        let appointments = response.appointments;
        let appointmentHtml = `<h4>Appointment</h4><hr>`;

        let filteredAppointments = appointments.filter(appointment => appointment.status !== "Completed");

        if (filteredAppointments.length > 0) {
          filteredAppointments.forEach(appointment => {
            appointmentHtml += `
              <div class="appointment-card border p-3 mb-3">
                <h5><i class="fas fa-calendar-check"></i> Appointment</h5>
                <p><strong>Date:</strong> ${appointment.appointment_date}</p>
                <p><strong>Time:</strong> ${appointment.appointment_time}</p>
                <p><strong>Service Type:</strong> ${appointment.service_type}</p>
                <p><strong>Status:</strong> <span class="badge bg-${getStatusColor(appointment.status)}">${appointment.status}</span></p>
              </div>`;
          });
        } else {
          appointmentHtml += `<p>No upcoming or pending appointments.</p>`;
        }

        $("#appointment").html(appointmentHtml);
      } else {
        $("#appointment").html("<p>Error retrieving appointment details.</p>");
      }
    },
    error: function (xhr) {
      console.error("AJAX Error:", xhr.responseText);
      $("#appointment").html("<p>Error fetching appointment details.</p>");
    }
  });
}

// ✅ Function to Assign Bootstrap Colors for Status
function getStatusColor(status) {
  switch (status) {
    case "Pending": return "warning";
    case "Confirmed": return "info";
    case "In Progress": return "primary";
    case "Completed": return "success"; // Although completed is not displayed
    case "Canceled": return "danger";
    default: return "secondary";
  }
}

// ✅ Call function on page load
$(document).ready(function () {
  loadAppointmentDetails();
});


  // ✅ Update address button event binding
  $("#updateAddressBtn").click(function (e) {
    e.preventDefault();

    var addressData = {
      address_line1: $("#addressLine1").val(),
      address_line2: $("#addressLine2").val(),
      country: $("#country").val(),
      state: $("#state").val(),
      city: $("#city").val(),
      postal_code: $("#postalCode").val() // ✅ Ensure key matches PHP
    };

    console.log("Submitting Address Data:", addressData); // Debugging

    $.ajax({
      url: "http://localhost/DSC115-Project/php-files/update-address.php",
      type: "POST",
      data: JSON.stringify(addressData), // ✅ Send data as JSON
      contentType: "application/json",
      dataType: "json",
      xhrFields: { withCredentials: true },
      success: function (response) {
        console.log("Update Address Response:", response); // Debugging
        if (response.success) {
          alert("Address updated successfully!");
          loadAddressInfo(); // Reload address after update
        } else {
          alert("Failed to update address: " + response.message);
        }
      },
      error: function (xhr) {
        console.error("AJAX error:", xhr.responseText);
        alert("Error updating address.");
      }
    });
  });

  // ✅ Load Address Information (Ensure City is Displayed)
  function loadAddressInfo() {
    $.ajax({
      url: "http://localhost/DSC115-Project/php-files/get-address-info.php",
      type: "GET",
      dataType: "json",
      xhrFields: { withCredentials: true },
      success: function (response) {
        console.log("Address Data Loaded:", response); // Debugging Log

        if (response.success) {
          let address = response.address;

          $("#addressLine1").val(address.address_line1 || "").prop("disabled", false);
          $("#addressLine2").val(address.address_line2 || "").prop("disabled", false);
          $("#postalCode").val(address.postal_code || "").prop("disabled", false);

          // ✅ Set country and trigger state dropdown population
          $("#country").val(address.country).trigger("change");

          // ✅ Wait for state dropdown to be populated before setting value
          setTimeout(function () {
            $("#state").val(address.state).trigger("change");

            // ✅ Wait for city dropdown to populate before setting city
            setTimeout(function () {
              if (address.city && address.city.trim() !== "") {
                console.log("Setting City:", address.city); // Debugging Log
                $("#city").val(address.city).trigger("change");
              }
            }, 200); // Ensure dropdown has loaded
          }, 300); // Ensure dropdown is populated before setting values

        } else {
          console.warn("Address data not found or error occurred.");
        }
      },
      error: function (xhr) {
        console.error("Error loading address:", xhr.responseText);
      }
    });
  }

  // ✅ Ensure address loads on page load
  $(document).ready(function () {
    loadAddressInfo();
  });

  // ✅ Load Order Tracking
  function loadOrderTracking() {
    $.ajax({
      url: "http://localhost/DSC115-Project/php-files/get-order-tracking.php",
      type: "GET",
      dataType: "json",
      xhrFields: { withCredentials: true },
      success: function (response) {
        console.log("Order Tracking Data:", response);
        if (response.status === "success") {
          displayOrderTracking(response.orders);
        } else {
          $("#orderTrackingContainer").html(`<p class='text-danger'>${response.message}</p>`);
        }
      },
      error: function (xhr) {
        console.error("Error fetching order tracking:", xhr.responseText);
        $("#orderTrackingContainer").html("<p class='text-danger'>Failed to load order tracking.</p>");
      }
    });
  }

  function displayOrderTracking(orders) {
    if (orders.length === 0) {
      $("#orderTrackingContainer").html("<p class='text-muted'>No orders found.</p>");
      return;
    }

    let orderHTML = "";
    orders.forEach(order => {
      orderHTML += `
        <div class="card mb-3">
          <div class="card-body">
            <h5 class="card-title">Order Number: <strong>${order.order_number}</strong></h5>
            <p class="card-text"><strong>Status:</strong> <span class="badge bg-info">${order.order_status}</span></p>
            <p class="card-text"><small class="text-muted">Order Date: ${order.order_date}</small></p>
            <a href="track-order.html?order_id=${order.order_number}" class="btn btn-primary btn-sm">
              Track Order
            </a>
          </div>
        </div>`;
    });

    $("#orderTrackingContainer").html(orderHTML);
  }

  // ✅ Sidebar Navigation & Tab Switching
  $(".tab-content").hide();
  $("#personalInfo").show(); // Default tab

  // ✅ Handle My Account Click (Opens Personal Info & Removes Other Active Highlights)
  $("#myAccountToggle").click(function () {
    $("#accountSubMenu").toggleClass("open");
    $(this).toggleClass("active");

    if ($(this).hasClass("active")) {
      // ❌ Remove active class from Appointment & Order Tracking when My Account is clicked
      $("a.nav-link").removeClass("active");

      // ✅ Set Personal Info as Active
      $(".sub-link").removeClass("active");
      $(".sub-link[data-target='personalInfo']").addClass("active");

      // ✅ Show Personal Info
      $(".tab-content").hide();
      $("#personalInfo").show();
    }
  });

  // ✅ Handle Submenu Tab Clicks (Personal Info, Address, etc.)
  $(".sub-link").click(function () {
    $(".sub-link").removeClass("active");
    $(this).addClass("active");
    $(".tab-content").hide();
    $("#" + $(this).data("target")).show();
  });

  // ✅ Handle Main Navigation Clicks (Collapse Sidebar for Appointment & Order Tracking)
  $("a.nav-link").not("#myAccountToggle, .sub-link").click(function () {
    let target = $(this).data("target");

    // ✅ Remove highlight from "My Account" when clicking Appointment or Order Tracking
    $("#myAccountToggle").removeClass("active");
    $(".sub-link").removeClass("active"); // Also remove highlight from Personal Info, Address, etc.

    // ✅ Highlight the selected tab
    $("a.nav-link").removeClass("active");
    $(this).addClass("active");

    $(".tab-content").hide();
    $("#" + target).show();

    // ✅ Collapse Sidebar if "Appointment" or "Order Tracking" is Selected
    if (target === "appointment" || target === "orderTracking") {
      $("#accountSubMenu").removeClass("open"); // Collapse submenu
    }
  });

});
