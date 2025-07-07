<?php
header("Content-Type: application/json");
include 'config.php';

// 🔹 Check if an ID is provided (fetch single appointment)
if (isset($_GET['id'])) {
    $appointment_id = $_GET['id'];
    $sql = "SELECT * FROM appointments WHERE appointment_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $appointment_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(["error" => "Appointment not found"]);
    }
    exit();
}

// 🔹 Fetch all appointments (except completed ones)
$sql = "SELECT * FROM appointments WHERE status != 'Completed' ORDER BY appointment_date ASC";
$result = $conn->query($sql);

$appointments = [];

while ($row = $result->fetch_assoc()) {
    $appointments[] = $row;
}

echo json_encode($appointments);
?>
