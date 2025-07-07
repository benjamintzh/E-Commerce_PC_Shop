$(document).ready(function () {
    // ✅ Get email from URL
    let urlParams = new URLSearchParams(window.location.search);
    let email = urlParams.get("email");
    $("#email").val(email); // Store email for verification

    $("#verifyCodeForm").submit(function (e) {
        e.preventDefault();

        let reset_code = $("#reset_code").val().trim();
        if (!reset_code) {
            alert("Please enter the verification code.");
            return;
        }

        $.ajax({
            url: "../php-files/verify-code.php",
            type: "POST",
            data: { email: email, reset_code: reset_code },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    alert(response.message);
                    // ✅ Redirect to reset password page
                    window.location.href = `reset-password.html?email=${encodeURIComponent(email)}`;
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                alert("Error verifying code. Please try again.");
            }
        });
    });
});
