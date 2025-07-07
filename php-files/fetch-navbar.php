<?php
include '../php-files/db_connection.php';

// Fetch distinct product categories
$sql = "SELECT DISTINCT category FROM products";
$result = $conn->query($sql);

$categories = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $categories[] = [
            "name" => $row["category"],
            "link" => "product.html?category=" . urlencode($row["category"]) // ✅ Ensure correct URL format
        ];
    }
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode(["categories" => $categories]);

$conn->close();
?>
