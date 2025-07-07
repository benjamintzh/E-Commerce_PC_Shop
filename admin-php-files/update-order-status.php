<?php
session_start();
header("Content-Type: application/json");

include '../php-files/db_connection.php';

// ✅ Check if Admin (Modify as needed for authentication)
if (!isset($_SESSION['admin_id'])) {
    echo json_encode(["status" => "error", "message" => "Unauthorized access."]);
    exit;
}

$order_id = isset($_POST['order_id']) ? intval($_POST['order_id']) : 0;
$new_status = isset($_POST['status']) ? $_POST['status'] : '';

$valid_statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

if ($order_id == 0 || !in_array($new_status, $valid_statuses)) {
    echo json_encode(["status" => "error", "message" => "Invalid order ID or status."]);
    exit;
}

// ✅ Update Order Status in `order_history`
$update_query = $conn->prepare("UPDATE order_history SET order_status = ? WHERE order_id = ?");
$update_query->bind_param("si", $new_status, $order_id);
$update_query->execute();

if ($update_query->affected_rows > 0) {
    echo json_encode(["status" => "success", "message" => "Order status updated successfully."]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update order status."]);
}

$update_query->close();
$conn->close();
?>
