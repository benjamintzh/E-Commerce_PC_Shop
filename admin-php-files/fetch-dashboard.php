<?php
include 'config.php';

// Fetch Total Counts
$totalOrders = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) AS total FROM order_history"))["total"];
$totalAppointments = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) AS total FROM appointments"))["total"];
$totalProducts = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) AS total FROM products"))["total"];
$outOfStock = mysqli_fetch_assoc(mysqli_query($conn, "SELECT COUNT(*) AS total FROM products WHERE stock_quantity <= 0 OR stock_quantity IS NULL"))["total"];

// Fetch Recent Orders (Last 5)
$recentOrdersQuery = mysqli_query($conn, "SELECT * FROM order_history ORDER BY order_date DESC LIMIT 5");
$recentOrders = [];
while ($row = mysqli_fetch_assoc($recentOrdersQuery)) {
    $recentOrders[] = $row;
}

// Fetch Low Stock Products (Stock < 10)
$lowStockQuery = mysqli_query($conn, "SELECT * FROM products WHERE stock_quantity < 10 ORDER BY stock_quantity ASC");
$lowStockProducts = [];
while ($row = mysqli_fetch_assoc($lowStockQuery)) {
    $lowStockProducts[] = $row;
}

// Return Data as JSON
echo json_encode([
    "totalOrders" => $totalOrders,
    "totalAppointments" => $totalAppointments,
    "totalProducts" => $totalProducts,
    "outOfStock" => $outOfStock,
    "recentOrders" => $recentOrders,
    "lowStockProducts" => $lowStockProducts
]);
?>
