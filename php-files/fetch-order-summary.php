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
$order_number = isset($_GET['order_number']) ? trim($_GET['order_number']) : "";

// ✅ Debugging Log
error_log("Received order_number: " . json_encode($order_number));

if (empty($order_number)) {
    echo json_encode(["status" => "error", "message" => "No order number provided"]);
    exit;
}

// ✅ Fetch Order Details Using `order_number`
$order_query = $conn->prepare("
    SELECT oh.order_id, oh.order_number, oh.total_amount, oh.order_status, 
           COALESCE(p.payment_method, 'N/A') AS payment_method 
    FROM order_history oh
    LEFT JOIN payments p ON oh.order_id = p.order_id  -- Ensure correct join on primary key
    WHERE oh.user_id = ? AND oh.order_number = ?
");
$order_query->bind_param("ss", $user_id, $order_number);
$order_query->execute();
$order_result = $order_query->get_result();
$order = $order_result->fetch_assoc();
$order_query->close();

if (!$order) {
    echo json_encode(["status" => "error", "message" => "No order found in order_history"]);
    exit;
}

// ✅ Debugging - Check if order was retrieved
error_log("Fetched Order: " . json_encode($order));

// ✅ Extract Order ID for fetching items
$order_id = $order["order_id"];

// ✅ Fetch Order Items with Product Names
$items_query = $conn->prepare("
    SELECT p.product_name, oi.price, oi.quantity 
    FROM order_item oi
    JOIN products p ON oi.product_id = p.product_id
    WHERE oi.order_id = ?
");
$items_query->bind_param("s", $order_id); // ✅ Use order_id instead of order_number
$items_query->execute();
$items_result = $items_query->get_result();

$items = [];
while ($item = $items_result->fetch_assoc()) {
    $items[] = $item;
}
$items_query->close();

// ✅ Debugging - Check if items were retrieved
error_log("Fetched Items: " . json_encode($items));

// ✅ Return Response with Order Details and Items
echo json_encode([
    "status" => "success",
    "data" => [
        "order_number" => $order["order_number"],
        "total_amount" => $order["total_amount"],
        "order_status" => $order["order_status"],
        "payment_method" => $order["payment_method"],
        "items" => $items
    ]
]);

$conn->close();
?>
