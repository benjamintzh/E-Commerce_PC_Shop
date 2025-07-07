<?php
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "error: Invalid request method";
    exit();
}

// ✅ Allow empty fields with default values
$product_name = isset($_POST['product_name']) && trim($_POST['product_name']) !== "" ? $_POST['product_name'] : "Unnamed Product";
$description = isset($_POST['description']) ? $_POST['description'] : "";
$price = isset($_POST['price']) && is_numeric($_POST['price']) ? number_format((float)$_POST['price'], 2, '.', '') : "0.00";
$category = isset($_POST['category']) && trim($_POST['category']) !== "" ? $_POST['category'] : "Uncategorized";
$brand = isset($_POST['brand']) && trim($_POST['brand']) !== "" ? $_POST['brand'] : "Unknown";
$stock_quantity = isset($_POST['stock_quantity']) && is_numeric($_POST['stock_quantity']) ? intval($_POST['stock_quantity']) : 0;

// ✅ Handle Product Image Upload (Optional)
$product_img = "default.png"; // Default image if no file uploaded
if (!empty($_FILES['product_img']['name'])) {
    $uploadDir = "../images/product/";

    // ✅ Clean File Name (Remove spaces and special characters)
    $originalFileName = $_FILES['product_img']['name'];
    $cleanFileName = preg_replace("/[^a-zA-Z0-9\.\-_]/", "_", $originalFileName);
    $product_img = time() . "_" . $cleanFileName;
    $uploadFile = $uploadDir . $product_img;

    if (!move_uploaded_file($_FILES['product_img']['tmp_name'], $uploadFile)) {
        echo "error: Image upload failed";
        exit();
    }
}

// ✅ Insert into database
$sql = "INSERT INTO products (product_name, description, price, category, brand, stock_quantity, product_img)
        VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssdssis", $product_name, $description, $price, $category, $brand, $stock_quantity, $product_img);

if ($stmt->execute()) {
    echo "success";
} else {
    echo "error: " . $stmt->error;
}
?>
