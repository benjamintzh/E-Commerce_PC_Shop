$(document).ready(function () {
    console.log("payment.js loaded - Payment page loaded.");

    // ✅ Retrieve previously selected payment method from sessionStorage (for persistence)
    let storedPayment = sessionStorage.getItem("selectedPayment");
    if (storedPayment) {
        $("input[name='payment'][value='" + storedPayment + "']").prop("checked", true).trigger("change");
        $(".payment-option").removeClass("selected");
        $("input[name='payment'][value='" + storedPayment + "']").closest(".payment-option").addClass("selected");
    }

    // ✅ Allow clicking the whole box to select the radio button
    $(".payment-option").click(function () {
        let radio = $(this).find("input[type='radio']");
        radio.prop("checked", true).trigger("change");
        $(".payment-option").removeClass("selected");
        $(this).addClass("selected");

        // ✅ Store selected payment method in sessionStorage
        sessionStorage.setItem("selectedPayment", radio.val());
    });

    // ✅ Handle form submission and redirect to the respective payment page
    $("#paymentForm").submit(function (event) {
        event.preventDefault();

        let selectedPayment = $("input[name='payment']:checked").val();
        console.log("Selected Payment Method:", selectedPayment);
        alert("Debug: Selected Payment = " + selectedPayment);

        if (!selectedPayment) {
            alert("Please select a payment method.");
            return;
        }

        // ✅ Store total amount for the next page
        let totalAmount = sessionStorage.getItem("totalAmount") || "0";

        // ✅ Redirect to the correct payment page based on selection
        switch (selectedPayment) {
            case "paypal":
                window.location.href = "../html-files/paypal.html?amount=" + totalAmount;
                break;
            case "credit_card":
                window.location.href = "../html-files/card.html?amount=" + totalAmount;
                break;
            case "tng":
                window.location.href = "../html-files/tng.html?amount=" + totalAmount;
                break;
            case "grabpay":
                window.location.href = "../html-files/grabpay.html?amount=" + totalAmount;
                break;
            default:
                alert("Invalid payment method selected.");
        }
    });
});
