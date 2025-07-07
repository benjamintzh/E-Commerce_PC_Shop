$(document).ready(function () {
    console.log("TNG Payment Page Loaded");

    let totalAmount = localStorage.getItem("totalAmount") || "0.00";
    $("#totalAmount, #totalSummary").text(totalAmount);

    function generateTransactionId() {
        return "TNG" + Math.floor(1000000000 + Math.random() * 9000000000);
    }
    $("#transactionId").text(generateTransactionId());

    setTimeout(function () {
        alert("Payment processed successfully! Redirecting...");
        window.location.href = "payment-success.html"; // Redirect to success page
    }, 10000);
});
