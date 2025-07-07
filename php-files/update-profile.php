<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Credentials: true");
session_start();

include '../php-files/db_connection.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "No user logged in"]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve POST data
    $username = isset($_POST['username']) ? $_POST['username'] : '';
    $email = isset($_POST['email']) ? $_POST['email'] : '';
    $phone = isset($_POST['phone_number']) ? $_POST['phone_number'] : '';


    // Prepare an UPDATE statement (adjust table/column names as necessary)
    $stmt = $conn->prepare("UPDATE users SET username = ?, email = ?, phone_number = ? WHERE user_id = ?");
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
        exit;
    }
    
    $userId = $_SESSION['user_id'];
    $stmt->bind_param("sssi", $username, $email, $phone, $userId);

    if ($stmt->execute()) {
        // Optionally update session variables
        $_SESSION['username'] = $username;
        $_SESSION['email'] = $email;
        $_SESSION['phone_number'] = $phone;
        
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Database update failed"]);
    }
    
    $stmt->close();
    $conn->close();
}
?>
