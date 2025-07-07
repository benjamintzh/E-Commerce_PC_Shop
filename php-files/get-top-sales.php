<?php
header("Content-Type: application/json");
include '../php-files/db_connection.php';

// SQL query to get top 4 best-selling products based on total quantity sold
$sql = "
    SELECT p.product_id, p.product_name, p.price, p.product_img, 
           SUM(oi.quantity) AS total_sold
    FROM order_item oi
    JOIN products p ON oi.product_id = p.product_id
    GROUP BY oi.product_id
    ORDER BY total_sold DESC
    LIMIT 4
";

$result = $conn->query($sql);
$topSales = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $topSales[] = $row;
    }
}

$conn->close();
echo json_encode(["success" => true, "topSales" => $topSales]);
?>
