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

// ✅ Fetch Order History
$order_query = $conn->prepare("
    SELECT oh.order_id, oh.order_number, oh.total_amount, oh.order_status, oh.order_date,
           oi.product_id, p.product_name, oi.price, oi.quantity
    FROM order_history oh
    JOIN order_item oi ON oh.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    WHERE oh.user_id = ?
    ORDER BY oh.order_date DESC
");
$order_query->bind_param("i", $user_id);
$order_query->execute();
$result = $order_query->get_result();

$orders = [];
while ($row = $result->fetch_assoc()) {
    $order_id = $row['order_id'];

    if (!isset($orders[$order_id])) {
        $orders[$order_id] = [
            "order_id" => $order_id,
            "order_number" => $row['order_number'],
            "total_amount" => $row['total_amount'],
            "order_status" => $row['order_status'],
            "order_date" => $row['order_date'],
            "products" => []
        ];
    }

    $orders[$order_id]["products"][] = [
        "product_id" => $row['product_id'],
        "product_name" => $row['product_name'],
        "price" => $row['price'],
        "quantity" => $row['quantity']
    ];
}

$order_query->close();
$conn->close();

// ✅ Return JSON Response
if (empty($orders)) {
    echo json_encode(["status" => "error", "message" => "No orders found."]);
} else {
    echo json_encode(["status" => "success", "orders" => array_values($orders)]);
}
?>
