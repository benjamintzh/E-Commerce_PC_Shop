<?php
include '../php-files/db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $appointment_id = intval($_POST['appointment_id']);
    $status = $_POST['status'];

    if (!$appointment_id || !$status) {
        echo "❌ Invalid Request!";
        exit;
    }

    $update_query = $conn->prepare("UPDATE appointments SET status = ? WHERE appointment_id = ?");
    $update_query->bind_param("si", $status, $appointment_id);

    if ($update_query->execute()) {
        echo "✅ success";
    } else {
        echo "❌ Error updating appointment.";
    }

    $update_query->close();
    $conn->close();
} else {
    echo "❌ Invalid Method!";
}
?>
