<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit;
}

$userId = $_SESSION['user_id'];

if (!isset($_POST['productId']) || !isset($_POST['quantity'])) {
    echo json_encode(["error" => "Missing product data"]);
    exit;
}

$productId = intval($_POST['productId']);
$quantity = intval($_POST['quantity']);

if ($productId <= 0 || $quantity <= 0) {
    echo json_encode(["error" => "Invalid product or quantity"]);
    exit;
}

include '../php-files/db_connection.php';

// Check if this product is already in the user's cart
$stmt = $conn->prepare("SELECT cart_id, quantity FROM cart WHERE user_id = ? AND product_id = ?");
$stmt->bind_param("ii", $userId, $productId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Update the quantity
    $row = $result->fetch_assoc();
    $newQuantity = $row['quantity'] + $quantity;
    $updateStmt = $conn->prepare("UPDATE cart SET quantity = ? WHERE cart_id = ?");
    $updateStmt->bind_param("ii", $newQuantity, $row['cart_id']);
    $updateStmt->execute();
} else {
    // ✅ Insert into cart without product_name
    $insertStmt = $conn->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)");
    $insertStmt->bind_param("iii", $userId, $productId, $quantity);
    $insertStmt->execute();
}

echo json_encode(["success" => true]);
$conn->close();
?>
