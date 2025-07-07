<?php
header('Content-Type: application/json');

include '../php-files/db_connection.php';

$category = isset($_GET['category']) ? $_GET['category'] : 'all';

if ($category === 'all') {
    $sql = "SELECT * FROM products";
    $stmt = $conn->prepare($sql);
} else {
    $sql = "SELECT * FROM products WHERE category = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $category);
}

$stmt->execute();
$result = $stmt->get_result();

$products = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $row['price'] = floatval($row['price']);
        $row['image'] = "http://localhost/DSC115-Project/images/product/" . $row['product_img'];
        $row['product_name'] = $row['product_name'] ?? '';
        $products[] = $row;
    }
}

// Fetch unique categories
$sql_categories = "SELECT DISTINCT category FROM products";
$result_categories = $conn->query($sql_categories);
$categories = [];

if ($result_categories->num_rows > 0) {
    while ($row = $result_categories->fetch_assoc()) {
        $categories[] = $row['category'];
    }
}

// Fetch unique brands based on the selected category
if ($category === 'all') {
    $sql_brands = "SELECT DISTINCT SUBSTRING_INDEX(product_name, ' ', 1) AS brand FROM products";
} else {
    $sql_brands = "SELECT DISTINCT SUBSTRING_INDEX(product_name, ' ', 1) AS brand FROM products WHERE category = ?";
}

$stmt_brands = $conn->prepare($sql_brands);

if ($category !== 'all') {
    $stmt_brands->bind_param("s", $category);
}

$stmt_brands->execute();
$result_brands = $stmt_brands->get_result();
$brands = [];

if ($result_brands->num_rows > 0) {
    while ($row = $result_brands->fetch_assoc()) {
        $brands[] = $row['brand'];
    }
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode(["products" => $products, "categories" => $categories, "brands" => $brands]);

$conn->close();
?>
