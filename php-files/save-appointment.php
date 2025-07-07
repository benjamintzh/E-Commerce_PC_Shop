<?php
header("Content-Type: application/json");
session_start();
include '../php-files/db_connection.php';
include '../php-files/smtp-config.php'; // ✅ Include SMTP Configuration

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];

// Read and decode JSON input
$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

// Validate required fields
$required_fields = ['user_id', 'service_type', 'contact_name', 'phone', 'email', 'appointment_date', 'appointment_time'];
foreach ($required_fields as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        echo json_encode(["status" => "error", "message" => "Missing or empty field: $field"]);
        exit;
    }
}

// Extract appointment data
$service_type = $data['service_type'];
$contact_name = $data['contact_name'];
$phone = $data['phone'];
$email = $data['email'];
$appointment_date = $data['appointment_date'];
$appointment_time = $data['appointment_time'];

if ($service_type === "On-site") {
    $address1 = isset($data['address1']) ? $data['address1'] : '';
    $address2 = isset($data['address2']) ? $data['address2'] : '';
    $postal_code = isset($data['postal_code']) ? $data['postal_code'] : '';
    $city = isset($data['city']) ? $data['city'] : '';
    $state = isset($data['state']) ? $data['state'] : '';
    $country = isset($data['country']) ? $data['country'] : '';
} else {
    // In-House Service (Use shop's address)
    $address1 = "7, Gat Lebuh China, Taman Dhoby Ghaut";
    $address2 = "";
    $postal_code = "10300";
    $city = "George Town";
    $state = "Pulau Pinang";
    $country = "Malaysia";
}

// Insert appointment into database
$query = "INSERT INTO appointments (user_id, service_type, contact_name, phone, email, address1, address2, postal_code, city, state, country, appointment_date, appointment_time) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($query);
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Database query failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("issssssssssss", $user_id, $service_type, $contact_name, $phone, $email, $address1, $address2, $postal_code, $city, $state, $country, $appointment_date, $appointment_time);
if ($stmt->execute()) {
    
    $appointment_time_formatted = date("g:i A", strtotime($appointment_time));

    // ✅ Prepare the email content
    $emailSubject = "Appointment Confirmation - WOU Tech";
    $emailMessage = "
        <h3>Dear $contact_name,</h3>
        <p>Your appointment has been successfully booked. Below are the details:</p>
        <table border='1' cellpadding='8' cellspacing='0' style='border-collapse: collapse;'>
            <tr><td><strong>Appointment Date:</strong></td><td>$appointment_date</td></tr>
            <tr><td><strong>Appointment Time:</strong></td><td>{$appointment_time_formatted}</td></tr> <!-- ✅ Updated Here -->
            <tr><td><strong>Service Type:</strong></td><td>$service_type</td></tr>
            <tr><td><strong>Address:</strong></td><td>$address1 $address2, $postal_code, $city, $state, $country</td></tr>
        </table>
        <br>
        <p>If you have any questions, feel free to contact us.</p>
        <p>Best Regards,<br><strong>WOU Tech Sdn Bhd</strong></p>
    ";

    // ✅ Send Email
    $emailStatus = sendEmail($email, $emailSubject, $emailMessage);

    echo json_encode(["status" => "success", "message" => "Appointment booked successfully. $emailStatus"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to save appointment"]);
}

$stmt->close();
$conn->close();
exit;
?>
