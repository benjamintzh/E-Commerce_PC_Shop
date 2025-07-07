$(document).ready(function () {
    console.log("Payment success page loaded.");

    // ✅ Prevent duplicate execution
    if (sessionStorage.getItem("paymentProcessed") === "true") {
        console.warn("Payment already processed, preventing duplicate.");
        return;
    }

    // ✅ Retrieve stored totalAmount & payment method
    let paymentMethod = sessionStorage.getItem("selectedPayment");
    let totalAmount = sessionStorage.getItem("totalAmount");

    console.log("Retrieved totalAmount:", totalAmount);

    // ✅ Validate total amount
    if (!totalAmount || isNaN(parseFloat(totalAmount)) || parseFloat(totalAmount) <= 0) {
        console.warn("Warning: Invalid total amount detected. Using previous total.");

        // ✅ Fallback: Retrieve from localStorage if available
        totalAmount = localStorage.getItem("lastTotalAmount");

        if (!totalAmount || isNaN(parseFloat(totalAmount))) {
            console.error("Error: No valid total amount found.");
            totalAmount = "0.00"; // Default fallback
        }
    }

    // ✅ Display total amount on page
    $("#totalAmount").text(`RM ${parseFloat(totalAmount).toFixed(2)}`);

    // ✅ Store totalAmount in localStorage for backup
    localStorage.setItem("lastTotalAmount", totalAmount);

    // ✅ Mark Payment as Processed
    sessionStorage.setItem("paymentProcessed", "true");

    // ✅ Send Payment Data to Server
    $.ajax({
        url: "../php-files/process-payment.php",
        type: "POST",
        data: {
            payment_method: paymentMethod,
            total_amount: parseFloat(totalAmount)
        },
        dataType: "json",
        success: function (response) {
            console.log("Payment response:", response);

            if (response.status === "success") {
                alert("Payment recorded successfully!");

                // ✅ Store Order Number & Order ID in sessionStorage
                if (response.order_number) {
                    sessionStorage.setItem("order_number", response.order_number);
                    console.log("Stored order_number:", response.order_number);
                } else {
                    console.error("Error: Order Number is missing in response.");
                }

                if (response.order_id) {
                    sessionStorage.setItem("order_id", response.order_id);
                    console.log("Stored order_id:", response.order_id);
                }

                // ✅ Clear sessionStorage except order_number
                sessionStorage.removeItem("selectedPayment");
                sessionStorage.removeItem("totalAmount");
                sessionStorage.removeItem("cartItems");
                sessionStorage.removeItem("paymentProcessed");

                // ✅ Redirect to order summary after 5 seconds
                setTimeout(function () {
                    window.location.href = "order-summary.html";
                }, 5000);
            } else {
                console.error("Error:", response.message);
                alert("Payment failed: " + response.message);
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error:", xhr.responseText);
            alert("Error recording payment.");
        }
    });
});
