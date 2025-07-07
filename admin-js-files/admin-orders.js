$(document).ready(function () {
    loadOrders();

    function loadOrders() {
        $.ajax({
            url: "http://localhost/DSC115-Project/admin-php-files/get-order.php", // Fetch orders from the backend
            type: "GET",
            dataType: "json",
            success: function (response) {
                if (response.success) {
                    let totalOrders = response.orders.length;
                    let pendingOrders = response.orders.filter(o => o.order_status === "Pending").length;
                    let deliveredOrders = response.orders.filter(o => o.order_status === "Delivered").length;
                    let canceledOrders = response.orders.filter(o => o.order_status === "Cancelled").length;

                    $("#totalOrders").text(totalOrders);
                    $("#pendingOrders").text(pendingOrders);
                    $("#deliveredOrders").text(deliveredOrders);
                    $("#canceledOrders").text(canceledOrders);

                    let ordersHtml = "";
                    response.orders.forEach(order => {
                        ordersHtml += `
                            <tr>
                                <td>${order.order_id}</td>
                                <td>${order.order_number}</td>
                                <td>${order.user_id}</td>
                                <td>RM ${parseFloat(order.total_amount).toFixed(2)}</td>
                                <td>
                                    <span class="badge bg-${getStatusColor(order.order_status)}">
                                        ${order.order_status}
                                    </span>
                                </td>
                                <td>
                                    <select class="form-select status-select" data-order-id="${order.order_id}">
                                        <option value="Pending" ${order.order_status === "Pending" ? "selected" : ""}>Pending</option>
                                        <option value="Processing" ${order.order_status === "Processing" ? "selected" : ""}>Processing</option>
                                        <option value="Shipped" ${order.order_status === "Shipped" ? "selected" : ""}>Shipped</option>
                                        <option value="Delivered" ${order.order_status === "Delivered" ? "selected" : ""}>Delivered</option>
                                        <option value="Cancelled" ${order.order_status === "Cancelled" ? "selected" : ""}>Cancelled</option>
                                    </select>
                                </td>
                            </tr>`;
                    });
                    $("#orderTableBody").html(ordersHtml);

                    // Attach event listener to status dropdowns
                    $(".status-select").change(function () {
                        let orderId = $(this).data("order-id");
                        let newStatus = $(this).val();
                        updateOrderStatus(orderId, newStatus);
                    });
                } else {
                    $("#orderTableBody").html("<tr><td colspan='6' class='text-center text-danger'>No orders found</td></tr>");
                }
            },
            error: function (xhr) {
                console.error("Error loading orders:", xhr.responseText);
                $("#orderTableBody").html("<tr><td colspan='6' class='text-center text-danger'>Error loading orders</td></tr>");
            }
        });
    }

    function updateOrderStatus(orderId, status) {
        $.ajax({
            url: "http://localhost/DSC115-Project/admin-php-files/update-order-status.php",
            type: "POST",
            data: { order_id: orderId, status: status },
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    alert("Order status updated successfully!");
                    loadOrders(); // Reload orders after update
                } else {
                    alert("Error updating order: " + response.message);
                }
            },
            error: function (xhr) {
                console.error("Error updating order:", xhr.responseText);
                alert("Error updating order status.");
            }
        });
    }

    function getStatusColor(status) {
        switch (status) {
            case "Pending": return "warning";
            case "Processing": return "info";
            case "Shipped": return "primary";
            case "Delivered": return "success";
            case "Cancelled": return "danger";
            default: return "secondary";
        }
    }
});
