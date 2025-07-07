document.addEventListener("DOMContentLoaded", function () {
    // Handle login form submission
    const loginForm = document.querySelector("#loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Prevent page reload

            let formData = new FormData(loginForm);
            fetch("http://localhost/DSC115-Project/admin-php-files/login.php", {
                method: "POST",
                body: formData,
            })
            .then(response => response.json()) // Expect JSON response
            .then(data => {
                if (data.success) {
                    sessionStorage.setItem("admin_id", data.admin_id); // Store Admin ID in sessionStorage
                    sessionStorage.setItem("admin_username", data.username); // Store Username
                    window.location.href = "http://localhost/DSC115-Project/admin/admin-dashboard.html"; // Redirect on success
                } else {
                    alert("Login failed: " + data.message);
                }
            })
            .catch(error => console.error("Error:", error));
        });
    }

    // Handle logout
    const logoutBtn = document.querySelector("#logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            fetch("http://localhost/DSC115-Project/admin-php-files/logout.php")
            .then(() => {
                sessionStorage.removeItem("admin_id"); // Clear stored Admin ID
                sessionStorage.removeItem("admin_username"); // Clear stored Admin Username
                alert("Logged out successfully!");
                window.location.href = "http://localhost/DSC115-Project/admin/admin-login.html"; // Redirect to login
            })
            .catch(error => console.error("Error:", error));
        });
    }

    // Handle register form submission
    const registerForm = document.querySelector("#registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Prevent page reload

            let formData = new FormData(registerForm);
            fetch("http://localhost/DSC115-Project/admin-php-files/register.php", {
                method: "POST",
                body: formData,
            })
            .then(response => response.text())
            .then(data => {
                if (data.includes("success")) {
                    alert("Registration successful! Redirecting to login...");
                    window.location.href = "http://localhost/DSC115-Project/admin/admin-login.html"; // Redirect on success
                } else {
                    alert("Registration failed: " + data);
                }
            })
            .catch(error => console.error("Error:", error));
        });
    }
});
