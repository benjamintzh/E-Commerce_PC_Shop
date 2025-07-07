<?php
include 'config.php';

// ✅ Ensure required fields are set before using them
$product_id = isset($_POST['product_id']) ? intval($_POST['product_id']) : null;
$product_name = isset($_POST['product_name']) ? $_POST['product_name'] : null;
$description = isset($_POST['description']) ? $_POST['description'] : null;
$price = isset($_POST['price']) ? number_format((float)$_POST['price'], 2, '.', '') : null;
$category = isset($_POST['category']) ? $_POST['category'] : null;
$brand = isset($_POST['brand']) ? $_POST['brand'] : null;
$stock_quantity = isset($_POST['stock_quantity']) ? intval($_POST['stock_quantity']) : null;

// ✅ Check if all required fields are present
if (!$product_id || !$product_name || !$price || !$category || !$brand || !$stock_quantity) {
    echo "error: Missing required fields";
    exit();
}

// ✅ Handle Product Image Upload (Only if a new file is uploaded)
if (!empty($_FILES['product_img']['name'])) {
    $product_img = $_FILES['product_img']['name'];
    move_uploaded_file($_FILES['product_img']['tmp_name'], "../images/product/".$product_img);
    $sql = "UPDATE products SET product_name=?, description=?, price=?, category=?, brand=?, stock_quantity=?, product_img=? WHERE product_id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssdssisi", $product_name, $description, $price, $category, $brand, $stock_quantity, $product_img, $product_id);
} else {
    $sql = "UPDATE products SET product_name=?, description=?, price=?, category=?, brand=?, stock_quantity=? WHERE product_id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssdssii", $product_name, $description, $price, $category, $brand, $stock_quantity, $product_id);
}

// ✅ Execute SQL Query & Return Success/Error
if ($stmt->execute()) {
    echo "success";
} else {
    echo "error: " . $stmt->error;
}
?>
