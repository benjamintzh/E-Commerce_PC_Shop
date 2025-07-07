<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit;
}

if (!isset($_POST['cartId']) || !isset($_POST['quantity'])) {
    echo json_encode(["error" => "Missing parameters"]);
    exit;
}

$cartId = intval($_POST['cartId']);
$newQuantity = intval($_POST['quantity']);
$userId = $_SESSION['user_id'];

if ($newQuantity < 1) {
    echo json_encode(["error" => "Invalid quantity"]);
    exit;
}

include '../php-files/db_connection.php';

$stmt = $conn->prepare("UPDATE cart SET quantity = ? WHERE cart_id = ? AND user_id = ?");
$stmt->bind_param("iii", $newQuantity, $cartId, $userId);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["success" => true, "newQuantity" => $newQuantity]);
} else {
    echo json_encode(["error" => "Unable to update quantity"]);
}

$stmt->close();
$conn->close();
?>
