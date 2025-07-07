$(document).ready(function () {
    $("#registerForm").on("submit", function (e) {
        e.preventDefault();

        // Check if passwords match
        let password = $("#password").val();
        let confirmPassword = $("#confirm_password").val();
        if (password !== confirmPassword) {
            $("#passwordMismatch").show();
            return;
        } else {
            $("#passwordMismatch").hide();
        }

        // Send data to backend
        $.ajax({
            url: "http://localhost/DSC115-Project/php-files/register.php",
            type: "POST",
            data: $(this).serialize(),
            dataType: "json", // Expect JSON response
            success: function (response) {
                if (response.success) {
                    $("#successModal").modal("show"); // Show modal
                    setTimeout(function () {
                        $("#successModal").modal("hide");
                        window.location.href = "login.html";
                    }, 10000); // Auto close after 10s
                } else {
                    alert(response.error);
                }
            },
            error: function () {
                alert("Error processing request.");
            }
        });
    });

    // Redirect to login page after closing the modal
    $("#successModal").on("hidden.bs.modal", function () {
        window.location.href = "login.html";
    });
});
