<?php
header("Content-Type: application/json");
session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "No user logged in"]);
    exit;
}

include '../php-files/db_connection.php';

$userId = $_SESSION['user_id'];
$sql = "SELECT appointment_date, appointment_time, service_type, status FROM appointments WHERE user_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$appointments = [];
while ($row = $result->fetch_assoc()) {
    $appointments[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode(["success" => true, "appointments" => $appointments]);
exit;
?>
