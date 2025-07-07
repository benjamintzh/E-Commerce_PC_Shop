<?php
session_start();
header("Content-Type: application/json");
include '../php-files/db_connection.php';

$email = $_POST['email'] ?? '';
$reset_code = $_POST['reset_code'] ?? '';

// ✅ Check if code is valid
$stmt = $conn->prepare("SELECT * FROM password_resets WHERE email=? AND reset_code=? AND expires_at > NOW()");
$stmt->bind_param("ss", $email, $reset_code);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $_SESSION['verified_email'] = $email;
    echo json_encode(["status" => "success", "message" => "Code verified."]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid or expired code."]);
}
?>
