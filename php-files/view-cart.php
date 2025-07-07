<?php
session_start();

// ✅ Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit;
}

include '../php-files/db_connection.php';

// ✅ Get the user ID from session
$userId = $_SESSION['user_id'];

// ✅ Retrieve cart items along with product details
$sql = "SELECT c.cart_id, c.quantity, p.product_id, p.product_name, p.price, p.product_img
        FROM cart c
        JOIN products p ON c.product_id = p.product_id
        WHERE c.user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$cartItems = [];
while ($row = $result->fetch_assoc()) {
    // ✅ Append full image path
    $row['image'] = "http://localhost/DSC115-Project/images/product/" . $row['product_img'];
    $cartItems[] = $row;
}

// ✅ Return JSON response
echo json_encode(["cart" => $cartItems]);

// ✅ Close database connection
$conn->close();
?>
