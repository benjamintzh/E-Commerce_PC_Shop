$(document).ready(function () {
    console.log("GrabPay Payment page loaded.");

    // Retrieve total price from localStorage (to maintain consistency)
    let totalAmount = localStorage.getItem("totalAmount") || "0.00";
    $("#totalAmount, #summaryTotal").text(totalAmount);

    // Generate a random transaction number
    function generateTransactionNumber() {
        return Math.floor(100000000000 + Math.random() * 900000000000);
    }

    $("#transactionNo").text(generateTransactionNumber());

    // Auto redirect after 10 seconds
    setTimeout(function () {
        window.location.href = "payment-success.html";
    }, 10000);
});
