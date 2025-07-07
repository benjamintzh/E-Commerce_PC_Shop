<?php
session_start();
header("Content-Type: application/json");

include '../php-files/db_connection.php';

// ✅ Check if User is Logged In
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$order_id = isset($_GET['order_id']) ? intval($_GET['order_id']) : 0;

if ($order_id == 0) {
    echo json_encode(["status" => "error", "message" => "Invalid order ID"]);
    exit;
}

// ✅ Fetch `order_status` and validate ownership
$order_query = $conn->prepare("
    SELECT order_number, order_status, order_date 
    FROM order_history 
    WHERE user_id = ? AND order_id = ?
");
$order_query->bind_param("ii", $user_id, $order_id);
$order_query->execute();
$order_result = $order_query->get_result();

if ($order_result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "Order not found or does not belong to user."]);
    exit;
}

// ✅ Fetch order details
$order_row = $order_result->fetch_assoc();
$order_number = $order_row['order_number'];
$current_status = $order_row['order_status'];
$order_date = $order_row['order_date'];

$order_query->close();

// ✅ Define Order Status Steps
$status_steps = [
    "Pending" => "Order Placed",
    "Processing" => "Processing",
    "Shipped" => "Shipped",
    "Delivered" => "Delivered",
    "Cancelled" => "Cancelled"
];

// ✅ Create a tracking timeline based on current status
$tracking_steps = [];
foreach ($status_steps as $status => $label) {
    if ($status === $current_status) {
        $tracking_steps[] = ["status" => $label, "status_date" => $order_date];
        break;
    } else {
        $tracking_steps[] = ["status" => $label, "status_date" => $order_date];
    }
}

$conn->close();

// ✅ Return Response with `order_number` and current `order_status`
echo json_encode([
    "status" => "success",
    "data" => [
        "order_number" => $order_number,
        "status" => $current_status,
        "steps" => $tracking_steps
    ]
]);
?>
