<?php
header('Content-Type: application/json');
session_start();

include '../php-files/db_connection.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Retrieve address details
$stmt = $conn->prepare("SELECT address_line1, address_line2, country, state, city, postal_code FROM user_addresses WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $address = $result->fetch_assoc();
} else {
    // No address found, return empty values
    $address = [
        "address_line1" => "",
        "address_line2" => "",
        "country"       => "",
        "state"         => "",
        "city"          => "", 
        "postal_code"   => ""  
    ];
}

// Return response as JSON
echo json_encode(['success' => true, 'address' => $address]);

$stmt->close();
$conn->close();
?>
