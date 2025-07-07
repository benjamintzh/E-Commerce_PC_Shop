<?php
header("Content-Type: application/json"); // Ensure JSON response

include '../php-files/db_connection.php';

// Get form data
$username = $_POST['username'];
$email = $_POST['email'];
$phone_number = $_POST['phone_number'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT); // Hash password

// Check if email already exists
$checkEmail = $conn->prepare("SELECT * FROM users WHERE email = ?");
$checkEmail->bind_param("s", $email);
$checkEmail->execute();
$result = $checkEmail->get_result();
if ($result->num_rows > 0) {
    echo json_encode(["error" => "Email already exists."]);
    exit;
}

// Insert user into database
$sql = $conn->prepare("INSERT INTO users (username, email, phone_number, password) VALUES (?, ?, ?, ?)");
$sql->bind_param("ssss", $username, $email, $phone_number, $password);

if ($sql->execute()) {
    echo json_encode(["success" => "Account created successfully!"]);
} else {
    echo json_encode(["error" => "Error: " . $conn->error]);
}

$conn->close();
?>

