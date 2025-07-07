<?php
include 'config.php';

if (!isset($_GET['id'])) {
    echo "error: Missing appointment ID";
    exit();
}

$appointment_id = $_GET['id'];

$sql = "DELETE FROM appointments WHERE appointment_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $appointment_id);

if ($stmt->execute()) {
    echo "success";
} else {
    echo "error: " . $stmt->error;
}
?>
