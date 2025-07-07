<?php
ini_set('display_errors', 1); // Show errors for debugging
error_reporting(E_ALL);
header('Content-Type: application/json');
session_start();

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

include '../php-files/db_connection.php';

// Decode JSON input (Fix for FormData issue)
$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit;
}

// Retrieve fields
$address_line1 = isset($data['address_line1']) ? $data['address_line1'] : '';
$address_line2 = isset($data['address_line2']) ? $data['address_line2'] : '';
$country       = isset($data['country']) ? $data['country'] : '';
$state         = isset($data['state']) ? $data['state'] : '';
$city          = isset($data['city']) ? $data['city'] : '';
$postal_code   = isset($data['postal_code']) ? $data['postal_code'] : ''; // ✅ Ensure correct key name

// Debugging: Check values received
error_log("Updating Address for user_id: $user_id | Postal Code: $postal_code");

// Check if an address record exists for this user
$stmt = $conn->prepare("SELECT address_id FROM user_addresses WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    // Update existing address
    $stmt->close();
    $stmt = $conn->prepare("UPDATE user_addresses 
                            SET address_line1 = ?, address_line2 = ?, country = ?, state = ?, city = ?, postal_code = ? 
                            WHERE user_id = ?");
    $stmt->bind_param("ssssssi", $address_line1, $address_line2, $country, $state, $city, $postal_code, $user_id);
    $result = $stmt->execute();
    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Address updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update address']);
    }
} else {
    // Insert new address
    $stmt->close();
    $stmt = $conn->prepare("INSERT INTO user_addresses (user_id, address_line1, address_line2, country, state, city, postal_code) 
                            VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("issssss", $user_id, $address_line1, $address_line2, $country, $state, $city, $postal_code);
    $result = $stmt->execute();
    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Address added successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add address']);
    }
}

$stmt->close();
$conn->close();
?>
