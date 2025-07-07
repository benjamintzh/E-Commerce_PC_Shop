$(document).ready(function () {
  $("#loginForm").submit(function (event) {
    event.preventDefault();

    let formData = {
      email: $("input[name='email']").val(),
      password: $("input[name='password']").val()
    };

    $.ajax({
      url: "http://localhost/DSC115-Project/php-files/login.php",
      type: "POST",
      data: formData,
      dataType: "json",
      success: function (response) {
        if (response.success) {
          // Store the user_id and username in sessionStorage
          sessionStorage.setItem("userId", response.user_id);
          sessionStorage.setItem("username", response.username);
          alert("Login Successful!");
          window.location.href = "index.html"; // Redirect after login
        } else {
          alert("Invalid email or password!");
        }
      },
      error: function () {
        alert("Error logging in. Please try again.");
      }
    });
  });
});
