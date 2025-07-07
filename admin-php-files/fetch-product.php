<?php
include 'config.php';

// Check if an ID is provided in the request
if (isset($_GET['id']) && !empty($_GET['id'])) {
    $product_id = intval($_GET['id']); // Convert ID to integer for security

    $sql = "SELECT * FROM products WHERE product_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode($result->fetch_assoc()); // Return single product
    } else {
        echo json_encode(["error" => "Product not found"]);
    }
} else {
    // If no ID is provided, return all products
    $sql = "SELECT * FROM products";
    $result = $conn->query($sql);

    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    echo json_encode($products); // Return all products
}
?>
