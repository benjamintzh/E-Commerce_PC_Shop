$(document).ready(function () {
    console.log("PayPal Payment page loaded.");

    // Retrieve total price from localStorage (ensures correct amount)
    let totalAmount = localStorage.getItem("totalAmount") || "0.00";
    $("#totalAmount").text(totalAmount);

    // Handle PayPal login & redirect to success page
    $("#paypalForm").submit(function (event) {
        event.preventDefault();

        let email = $("#paypalEmail").val().trim();
        let password = $("#paypalPassword").val().trim();

        if (!email || !password) {
            alert("Please enter your PayPal credentials.");
            return;
        }

        alert("Logging into PayPal...");
        
        // Redirect to payment success page after 2s
        setTimeout(function () {
            window.location.href = "payment-success.html";
        }, 2000);
    });
});
