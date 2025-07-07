$(document).ready(function () {
    $("#forgotPasswordForm").submit(function (e) {
        e.preventDefault();

        let email = $("#email").val().trim();
        if (!email) {
            alert("Please enter your email.");
            return;
        }

        $.ajax({
            url: "../php-files/request-reset.php",
            type: "POST",
            data: { email: email },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    alert(response.message);
                    // ✅ Redirect to verification page with email as a query parameter
                    window.location.href = `verify-code.html?email=${encodeURIComponent(email)}`;
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                alert("Error processing request. Please try again.");
            }
        });
    });
});
