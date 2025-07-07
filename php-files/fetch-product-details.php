<?php
header("Content-Type: application/json");
include '../php-files/db_connection.php';

// ✅ Enable debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// ✅ Ensure `$_GET['id']` exists BEFORE defining `$product_id`
if (!isset($_GET['id']) || empty($_GET['id'])) {
    echo json_encode(["error" => "Product ID not provided"]);
    exit;
}

// ✅ Now, safely define `$product_id`
$product_id = intval($_GET['id']); // Ensures ID is a number

// ✅ Debugging: Log received ID
error_log("Received ID from GET: " . json_encode($_GET));
error_log("Parsed Product ID: " . $product_id);

$sql = "SELECT * FROM products WHERE product_id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die(json_encode(["error" => "Query preparation failed: " . $conn->error]));
}

$stmt->bind_param("i", $product_id);
$stmt->execute();
$result = $stmt->get_result();

// ✅ Debugging: Check if any rows were returned
error_log("Rows found: " . $result->num_rows);

if ($result->num_rows > 0) {
    $product = $result->fetch_assoc();
    $product['price'] = floatval($product['price']);
    $product['image'] = "http://localhost/DSC115-Project/images/product/" . $product['product_img'];

    echo json_encode($product);
} else {
    echo json_encode(["error" => "Product not found"]);
}

$conn->close();
?>
