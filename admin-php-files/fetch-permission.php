<?php
include 'config.php';
$admin_id = $_GET['admin_id'];
$result = $conn->query("SELECT * FROM admin_permissions WHERE admin_id = $admin_id");
echo json_encode($result->fetch_assoc());
?>
