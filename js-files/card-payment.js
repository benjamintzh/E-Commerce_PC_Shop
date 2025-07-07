$(document).ready(function () {
    console.log("Credit/Debit Card Payment page loaded.");

    // Retrieve total price from localStorage (to ensure price consistency)
    let totalAmount = localStorage.getItem("totalAmount") || "0.00";
    $("#balanceAmount, #totalAmount").text("RM " + totalAmount);

    // Handle form submission
    $("#cardPaymentForm").submit(function (event) {
        event.preventDefault();

        let cardholderName = $("#cardholderName").val().trim();
        let cardNumber = $("#cardNumber").val().trim();
        let expDate = $("#expDate").val().trim();
        let ccv = $("#ccv").val().trim();

        if (!cardholderName || !cardNumber || !expDate || !ccv) {
            alert("Please fill in all fields.");
            return;
        }

        alert("Payment Successful! Redirecting...");
    });
});
