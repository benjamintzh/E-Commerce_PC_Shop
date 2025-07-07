$(document).ready(function () {
    console.log("checkout.js loaded - Checkout page loaded.");

    let formSubmitted = false; // Prevent double submission

    function loadUserDetails() {
        $.ajax({
            url: "http://localhost/DSC115-Project/php-files/fetch-user.php",
            type: "GET",
            dataType: "json",
            xhrFields: { withCredentials: true },
            success: function (response) {
                console.log("User data:", response);

                if (response.status === "success") {
                    let user = response.data;

                    // ✅ Autofill user details in the checkout form
                    $("#username").val(user.username || "");
                    $("#phoneNumber").val(user.phone_number || "");
                    $("#email").val(user.email || "");
                    $("#address1").val(user.address_line1 || "");
                    $("#address2").val(user.address_line2 || "");
                    $("#postalCode").val(user.postal_code || "");
                    $("#city").val(user.city || "");
                    $("#state").val(user.state || "");

                    // ✅ Store user data for later use
                    sessionStorage.setItem("checkoutUser", JSON.stringify(user));
                } else {
                    console.warn("User data not found:", response.message);
                    alert("Error: " + response.message);
                }
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", error);
                alert("Failed to load user details.");
            }
        });
    }

    function loadCartTotal() {
        $.ajax({
            url: "http://localhost/DSC115-Project/php-files/view-cart.php",
            type: "GET",
            dataType: "json",
            success: function (response) {
                console.log("Cart response:", response);

                if (response.error) {
                    alert("Error: " + response.error);
                    return;
                }

                let cartItems = response.cart || [];
                let totalAmount = 0;

                if (cartItems.length === 0) {
                    alert("Your cart is empty. Redirecting to cart...");
                    window.location.href = "cart.html"; // Redirect to cart page
                    return;
                }

                cartItems.forEach(function (item) {
                    totalAmount += parseFloat(item.price) * item.quantity;
                });

                console.log("Cart Total:", totalAmount);

                // ✅ Update the total price on checkout page
                $("#cartTotal").text("RM " + totalAmount.toFixed(2));
                $("#totalAmount").text("RM " + totalAmount.toFixed(2));

                // ✅ Store total for payment page
                sessionStorage.setItem("totalAmount", totalAmount.toFixed(2));
            },
            error: function (xhr, status, error) {
                console.error("Error fetching cart data:", error);
            }
        });
    }

    loadUserDetails();
    loadCartTotal();

    // ✅ Prevent double submission and redirect to payment page
    $("#checkoutForm").submit(function (event) {
        event.preventDefault();

        if (formSubmitted) {
            console.warn("Form already submitted, preventing duplicate entry.");
            return;
        }

        formSubmitted = true; // Prevent multiple submissions

        let totalAmount = sessionStorage.getItem("totalAmount");
        if (!totalAmount || parseFloat(totalAmount) <= 0) {
            alert("Error: Total amount is invalid.");
            formSubmitted = false; // Allow form resubmission if error occurs
            return;
        }

        console.log("Proceeding to payment with total amount:", totalAmount);
        window.location.href = "payment.html"; // Redirect to payment page
    });
});
