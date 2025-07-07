<?php
session_start();
header("Content-Type: application/json");

include '../php-files/db_connection.php';
include '../php-files/smtp-config.php';

// ✅ Check if User is Logged In
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$payment_method = $_POST['payment_method'] ?? "";
$total_amount = isset($_POST['total_amount']) ? floatval($_POST['total_amount']) : 0;
$order_status = "Processing";

// ✅ Validate Payment Method
$valid_methods = ["paypal", "credit_card", "tng", "grabpay"];
if (!in_array($payment_method, $valid_methods)) {
    echo json_encode(["status" => "error", "message" => "Invalid payment method: " . $payment_method]);
    exit;
}

// ✅ Validate Total Amount
if ($total_amount <= 0 || !is_numeric($total_amount)) {
    echo json_encode(["status" => "error", "message" => "Invalid total amount received: " . $total_amount]);
    exit;
}

// ✅ Fetch Cart Items BEFORE Processing Payment
$cart_query = $conn->prepare("
    SELECT c.product_id, p.product_name, p.price, c.quantity 
    FROM cart c
    JOIN products p ON c.product_id = p.product_id
    WHERE c.user_id = ?
");
$cart_query->bind_param("i", $user_id);
$cart_query->execute();
$cart_result = $cart_query->get_result();

$cart_items = [];
while ($cart_item = $cart_result->fetch_assoc()) {
    $cart_items[] = $cart_item;
}
$cart_query->close();

// ✅ If Cart is Empty, Prevent Payment Processing
if (empty($cart_items)) {
    echo json_encode(["status" => "error", "message" => "Cart is empty. Cannot proceed with payment."]);
    exit;
}

// ✅ Generate a Unique Order Number
$order_number = "ORD" . date("Ymd") . strtoupper(substr(uniqid(), -5));

$conn->begin_transaction();

try {
    // ✅ Insert Order into `order_history` (Including order_number)
    $order_stmt = $conn->prepare("
        INSERT INTO order_history (user_id, order_number, total_amount, order_status, order_date) 
        VALUES (?, ?, ?, ?, NOW())");

    $order_stmt->bind_param("isss", $user_id, $order_number, $total_amount, $order_status);
    $order_stmt->execute();

    // ✅ Get Last Inserted Order ID
    $order_id = $conn->insert_id;
    $order_stmt->close();

    if (!$order_id) {
        throw new Exception("Failed to retrieve order ID after insertion.");
    }

    // ✅ Insert Payment into `payments`
    $payment_stmt = $conn->prepare("
        INSERT INTO payments (order_id, user_id, total_amount, payment_method, payment_status, payment_date) 
        VALUES (?, ?, ?, ?, ?, NOW())");

    $payment_stmt->bind_param("iisss", $order_id, $user_id, $total_amount, $payment_method, $order_status);
    $payment_stmt->execute();
    $payment_stmt->close();

    // ✅ Insert Purchased Products into `order_items`
    $order_item_stmt = $conn->prepare("
        INSERT INTO order_item (order_id, product_id, quantity, price) 
        VALUES (?, ?, ?, ?)");

    foreach ($cart_items as $item) {
        $order_item_stmt->bind_param("iidd", $order_id, $item['product_id'], $item['quantity'], $item['price']);
        $order_item_stmt->execute();
    }
    $order_item_stmt->close();

    // ✅ Only Clear Cart AFTER Successful Order
    $clear_cart_stmt = $conn->prepare("DELETE FROM cart WHERE user_id = ?");
    $clear_cart_stmt->bind_param("i", $user_id);
    $clear_cart_stmt->execute();
    $clear_cart_stmt->close();

    // ✅ Commit Transaction (All Operations Successful)
    $conn->commit();

    // ✅ Retrieve user email
    $user_query = $conn->prepare("SELECT email FROM users WHERE user_id = ?");
    $user_query->bind_param("i", $user_id);
    $user_query->execute();
    $result = $user_query->get_result();
    $user_data = $result->fetch_assoc();
    $user_query->close();

    if (!$user_data) {
        throw new Exception("Failed to retrieve user email.");
    }

    $user_email = $user_data['email'];

    // ✅ Generate Email Content
    $email_subject = "Your Order Confirmation - WOU Tech";
    $order_items_html = "";

    foreach ($cart_items as $item) {
        $subtotal = number_format($item['quantity'] * $item['price'], 2);
        $order_items_html .= "<tr>
                                <td>{$item['product_name']}</td>
                                <td>{$item['quantity']}</td>
                                <td>RM {$item['price']}</td>
                                <td>RM {$subtotal}</td>
                              </tr>";
    }

    $email_message = "
        <h3>Dear Customer,</h3>
        <p>Thank you for your purchase! Below are your order details:</p>
        <table border='1' cellpadding='8' cellspacing='0' style='border-collapse: collapse;'>
            <tr><td><strong>Order Number:</strong></td><td>{$order_number}</td></tr>
            <tr><td><strong>Order Date:</strong></td><td>" . date("Y-m-d H:i:s") . "</td></tr>
            <tr><td><strong>Total Amount:</strong></td><td>RM " . number_format($total_amount, 2) . "</td></tr>
            <tr><td><strong>Payment Method:</strong></td><td>{$payment_method}</td></tr>
            <tr><td><strong>Status:</strong></td><td>Processing</td></tr>
        </table>
        <br>
        <h4>Order Items</h4>
        <table border='1' cellpadding='8' cellspacing='0' style='border-collapse: collapse;'>
            <tr><th>Product</th><th>Quantity</th><th>Price</th><th>Subtotal</th></tr>
            {$order_items_html}
        </table>
        <br>
        <p>If you have any questions, feel free to contact us.</p>
        <p>Best Regards,<br><strong>WOU Tech Sdn Bhd</strong></p>
    ";

    // ✅ Send Email
    $mailResult = sendEmail($user_email, $email_subject, $email_message);

    // ✅ Log and Return Success Response
    error_log("Order created successfully: Order ID = $order_id, Order Number = $order_number");
    
    echo json_encode([
        "status" => "success",
        "message" => "Payment and order recorded successfully",
        "order_id" => $order_id,
        "order_number" => $order_number,
        "email_status" => $mailResult
    ]);

} catch (Exception $e) {
    // ❌ Rollback Transaction on Failure
    $conn->rollback();
    echo json_encode(["status" => "error", "message" => "Transaction failed: " . $e->getMessage()]);
}

$conn->close();
?>
