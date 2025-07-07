<?php
session_start();
header("Content-Type: application/json");

include '../php-files/db_connection.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];

$query = "DELETE FROM cart WHERE user_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["status" => "success", "message" => "Cart cleared"]);
} else {
    echo json_encode(["status" => "error", "message" => "No items in cart"]);
}

$stmt->close();
$conn->close();
?>
