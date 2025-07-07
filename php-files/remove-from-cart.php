<?php
session_start();
header("Content-Type: application/json");
error_reporting(E_ALL);
ini_set('display_errors', 1);

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit;
}

if (!isset($_POST['cartId'])) {
    echo json_encode(["error" => "Missing cart ID"]);
    exit;
}

$cartId = intval($_POST['cartId']);
$userId = $_SESSION['user_id'];

include '../php-files/db_connection.php';

// Ensure that the cart item belongs to this user before deleting
$stmt = $conn->prepare("DELETE FROM cart WHERE cart_id = ? AND user_id = ?");
$stmt->bind_param("ii", $cartId, $userId);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Item not found or could not be removed"]);
}

$stmt->close();
$conn->close();
?>
