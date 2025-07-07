$(document).ready(function () {
    let urlParams = new URLSearchParams(window.location.search);
    let email = urlParams.get("email");
    $("#email").val(email); // Store email for password update

    $("#resetPasswordForm").submit(function (e) {
        e.preventDefault();

        let newPassword = $("#newPassword").val().trim();
        if (!newPassword) {
            alert("Please enter your new password.");
            return;
        }

        $.ajax({
            url: "../php-files/update-password.php",
            type: "POST",
            data: { email: email, newPassword: newPassword },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    alert(response.message);
                    // ✅ Redirect to login page after successful reset
                    window.location.href = "login.html";
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                alert("Error updating password. Please try again.");
            }
        });
    });
});
