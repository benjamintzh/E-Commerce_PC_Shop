<?php
include 'config.php';

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["error" => "Invalid request method"]);
    exit();
}

// 🔹 Debugging: Log received POST data
error_log("Received Data: " . json_encode($_POST));

$appointment_id = $_POST['appointment_id'] ?? null;
$service_type = $_POST['service_type'] ?? null;
$contact_name = $_POST['contact_name'] ?? null;
$phone = $_POST['phone'] ?? null;
$email = $_POST['email'] ?? null;
$address1 = $_POST['address1'] ?? null;
$address2 = $_POST['address2'] ?? null;
$postal_code = $_POST['postal_code'] ?? null;
$city = $_POST['city'] ?? null;
$state = $_POST['state'] ?? null;
$country = $_POST['country'] ?? null;
$appointment_date = $_POST['appointment_date'] ?? null;
$appointment_time = $_POST['appointment_time'] ?? null;
$status = $_POST['status'] ?? "Pending"; // ✅ Default to Pending if empty

// 🔹 Ensure required fields exist
if (!$appointment_id || !$appointment_date || !$appointment_time) {
    echo json_encode(["error" => "Missing required fields"]);
    exit();
}

// 🔹 Convert Time to 24-Hour Format if Needed
if (strpos($appointment_time, "AM") !== false || strpos($appointment_time, "PM") !== false) {
    $appointment_time = date("H:i:s", strtotime($appointment_time));
}

// 🔹 Debugging: Ensure correct format
error_log("Formatted Time: " . $appointment_time);

// 🔹 Update Appointment
$sql = "UPDATE appointments 
        SET service_type = ?, contact_name = ?, phone = ?, email = ?, address1 = ?, address2 = ?, postal_code = ?, city = ?, state = ?, country = ?, appointment_date = ?, appointment_time = ?, status = ?
        WHERE appointment_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssssssssssi", $service_type, $contact_name, $phone, $email, $address1, $address2, $postal_code, $city, $state, $country, $appointment_date, $appointment_time, $status, $appointment_id);

if ($stmt->execute()) {
    echo json_encode(["success" => "Appointment updated successfully"]);
} else {
    echo json_encode(["error" => "Database error: " . $stmt->error]);
}
?>
