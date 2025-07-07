<?php
session_start();

include '../php-files/db_connection.php';

if (!isset($_POST['email']) || !isset($_POST['password'])) {
    echo json_encode(["success" => false, "message" => "Missing email or password"]);
    exit;
}

$email = $_POST['email'];
$entered_password = $_POST['password'];

// Fetch user details
$sql = "SELECT user_id, username, email, phone_number, password FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

// Check if user exists
if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    $stored_password = $user['password']; // Retrieve stored password

    // Verify password
    if (password_verify($entered_password, $stored_password)) {
        
        session_regenerate_id(true);

        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['phone_number'] = $user['phone_number'];

        echo json_encode(["success" => true, "user_id" => $_SESSION['user_id'], "username" => $_SESSION['username']]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid password"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Email not found"]);
}

$stmt->close();
$conn->close();
?>
