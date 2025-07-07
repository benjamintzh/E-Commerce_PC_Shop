<?php
include 'config.php';
$admin_id = $_POST['admin_id'];
$can_add = $_POST['can_add_product'] ? 1 : 0;
$can_edit = $_POST['can_edit_product'] ? 1 : 0;
$can_delete = $_POST['can_delete_product'] ? 1 : 0;
$can_update_appointment = $_POST['can_update_appointment_status'] ? 1 : 0;
$allowed_appointment_statuses = $_POST['allowed_appointment_statuses'];
$can_update_order = $_POST['can_update_order_status'] ? 1 : 0;
$allowed_order_statuses = $_POST['allowed_order_statuses'];

$conn->query("UPDATE admin_permissions SET 
    can_add_product=$can_add, 
    can_edit_product=$can_edit, 
    can_delete_product=$can_delete, 
    can_update_appointment_status=$can_update_appointment,
    allowed_appointment_statuses='$allowed_appointment_statuses',
    can_update_order_status=$can_update_order,
    allowed_order_statuses='$allowed_order_statuses'
    WHERE admin_id=$admin_id");

echo "Permissions Updated";
?>
