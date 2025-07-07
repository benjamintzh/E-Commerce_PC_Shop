<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");
session_start();

include '../php-files/db_connection.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "No user logged in"]);
    exit;
}

$userId = $_SESSION['user_id'];
$sql = "SELECT username, email, phone_number, profile_image FROM users WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();
$stmt->bind_result($username, $email, $phone, $profile_image);
$stmt->fetch();
$stmt->close();
$conn->close();

echo json_encode([
    "success" => true,
    "user" => [
         "username"      => $username,
         "email"         => $email,
         "phone_number"  => $phone,
         "profile_image" => $profile_image  // May be empty if none uploaded
    ]
]);
exit;
?>
