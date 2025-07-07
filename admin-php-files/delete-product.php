<?php
include 'config.php';

if (!isset($_GET['id'])) {
    echo "error";
    exit();
}

$product_id = intval($_GET['id']);

$sql = "DELETE FROM products WHERE product_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $product_id);

if ($stmt->execute()) {
    echo "success";
} else {
    echo "error";
}
?>
