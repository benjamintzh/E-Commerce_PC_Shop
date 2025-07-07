<?php
session_start();
header("Content-Type: application/json");
include '../php-files/db_connection.php';
include '../php-files/smtp-config.php'; // Include email function

$email = $_SESSION['verified_email'] ?? '';
$newPassword = password_hash($_POST['newPassword'], PASSWORD_BCRYPT);

if (!$email) {
    echo json_encode(["status" => "error", "message" => "Session expired."]);
    exit;
}

// ✅ Update password in the database
$stmt = $conn->prepare("UPDATE users SET password=? WHERE email=?");
$stmt->bind_param("ss", $newPassword, $email);
$stmt->execute();
$stmt->close();

// ✅ Send Confirmation Email
$subject = "Password Changed Successfully - WOU TECH";
$message = "
    <h3>Dear User,</h3>
    <p>Your password has been successfully updated.</p>
    <p>If you did not request this change, please contact our support team immediately.</p>
    <p>Best Regards,<br><strong>WOU Tech Sdn Bhd</strong></p>
";

sendEmail($email, $subject, $message); // ✅ Send email using SMTP function

// ✅ Clear session (prevents reusing reset session)
unset($_SESSION['verified_email']);

echo json_encode(["status" => "success", "message" => "Password updated successfully. An email confirmation has been sent."]);
?>
