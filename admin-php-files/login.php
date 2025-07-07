<?php
session_start();
header("Content-Type: application/json");

include '../php-files/db_connection.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $stmt = $conn->prepare("SELECT admin_id, username, password FROM admin_users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $admin = $result->fetch_assoc();
        
        // Verify Password
        if (password_verify($password, $admin['password'])) {
            $_SESSION['admin_id'] = $admin['admin_id']; // Store in PHP Session
            $_SESSION['admin_username'] = $admin['username'];

            echo json_encode(["success" => true, "admin_id" => $admin['admin_id'], "username" => $admin['username']]);
        } else {
            echo json_encode(["success" => false, "message" => "Invalid password."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Admin not found."]);
    }
    
    $stmt->close();
    $conn->close();
}
?>
