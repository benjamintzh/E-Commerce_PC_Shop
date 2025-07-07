<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set the response content type to JSON
header('Content-Type: application/json');

include '../php-files/db_connection.php';
// Read raw POST data
$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

// Debugging: Log received JSON data
error_log("Raw JSON Data: " . $rawData);
error_log("Decoded Data: " . print_r($data, true));

// Validate if `appointment_date` is received
if (!isset($data['appointment_date']) || empty($data['appointment_date'])) {
    echo json_encode(["status" => "error", "message" => "Missing appointment_date", "debug_received" => $data]);
    exit;
}

$appointment_date = $data['appointment_date'];

// Fetch already booked slots
$query = "SELECT appointment_time FROM appointments WHERE appointment_date = ?";
$stmt = $conn->prepare($query);
if ($stmt === false) {
    echo json_encode(["status" => "error", "message" => "Database query preparation failed: " . $conn->error]);
    exit;
}
$stmt->bind_param("s", $appointment_date);
$stmt->execute();
$result = $stmt->get_result();

$disabledSlots = [];
while ($row = $result->fetch_assoc()) {
    $disabledSlots[] = $row['appointment_time'];
}

// Debugging: Log fetched slots
error_log("Booked slots: " . json_encode($disabledSlots));

// Return the disabled slots as a JSON response
echo json_encode($disabledSlots);

$stmt->close();
$conn->close();
?>
