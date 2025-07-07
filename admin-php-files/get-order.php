<?php
header("Content-Type: application/json");
session_start();

include '../php-files/db_connection.php';

// ✅ Check if Admin is Logged In
if (!isset($_SESSION['admin_id'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized access"]);
    exit;
}

$sql = "SELECT order_id, user_id, total_amount, order_status, order_number FROM order_history ORDER BY order_date DESC";
$result = $conn->query($sql);

$orders = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
}

$conn->close();
echo json_encode(["success" => true, "orders" => $orders]);
?>
