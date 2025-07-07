<?php
session_start();
header("Content-Type: application/json");

include '../php-files/db_connection.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];

// ✅ Fetch all order numbers and their statuses
$order_query = $conn->prepare("
    SELECT order_number, order_status, order_date
    FROM order_history
    WHERE user_id = ?
    ORDER BY order_date DESC
");
$order_query->bind_param("i", $user_id);
$order_query->execute();
$result = $order_query->get_result();

$orders = [];
while ($row = $result->fetch_assoc()) {
    $orders[] = [
        "order_number" => $row['order_number'],
        "order_status" => $row['order_status'],
        "order_date" => $row['order_date']
    ];
}

$order_query->close();
$conn->close();

// ✅ Return Response
if (empty($orders)) {
    echo json_encode(["status" => "error", "message" => "No orders found."]);
} else {
    echo json_encode(["status" => "success", "orders" => $orders]);
}
?>
