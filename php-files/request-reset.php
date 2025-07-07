<?php
session_start();
header("Content-Type: application/json");

include '../php-files/db_connection.php';
include '../php-files/smtp-config.php';

// ✅ Ensure email is provided
if (!isset($_POST['email']) || empty($_POST['email'])) {
    echo json_encode(["status" => "error", "message" => "Email is required."]);
    exit;
}

$email = $_POST['email'];
$reset_code = rand(100000, 999999); // Generate a 6-digit code

// ✅ Set Expiration Time (15 minutes from now)
date_default_timezone_set("Asia/Kuala_Lumpur"); // ✅ Set your correct timezone
$expiry_time = new DateTime();
$expiry_time->add(new DateInterval('PT15M')); // ✅ Add 15 minutes
$expires_at = $expiry_time->format("Y-m-d H:i:s"); // ✅ Correct format

// ✅ Store Reset Code in Database
$stmt = $conn->prepare("INSERT INTO password_resets (email, reset_code, expires_at) 
                        VALUES (?, ?, ?) 
                        ON DUPLICATE KEY UPDATE reset_code = VALUES(reset_code), expires_at = VALUES(expires_at)");
$stmt->bind_param("sis", $email, $reset_code, $expires_at);
$stmt->execute();
$stmt->close();

// ✅ Send Verification Code via Email
$subject = "Password Reset Code - WOU TECH";
$message = "
    <h3>Dear User,</h3>
    <p>Your password reset verification code is: <strong>$reset_code</strong></p>
    <p>This code will expire at: <strong>$expires_at</strong></p>
    <p>If you did not request this, please ignore this email.</p>
    <p>Best Regards,<br><strong>WOU Tech Sdn Bhd</strong></p>
";

sendEmail($email, $subject, $message);

echo json_encode(["status" => "success", "message" => "A verification code has been sent to your email."]);
?>
