<?php
session_start();
header("Content-Type: application/json");

include '../php-files/db_connection.php';

// ✅ Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];

// ✅ Fetch user and address data, including city
$query = "SELECT 
            u.username, 
            u.phone_number, 
            u.email, 
            a.address_line1, 
            a.address_line2, 
            a.country, 
            a.state, 
            a.city, 
            a.postal_code 
          FROM users u
          LEFT JOIN user_addresses a ON u.user_id = a.user_id
          WHERE u.user_id = ?";

$stmt = $conn->prepare($query);

if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Database query failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

// ✅ Check if user data exists
if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    echo json_encode(["status" => "success", "data" => $user]);
} else {
    echo json_encode(["status" => "error", "message" => "User data not found"]);
}

$stmt->close();
$conn->close();
?>
