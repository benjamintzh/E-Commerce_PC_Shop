$(document).ready(function () {
    loadOrderHistory();

    function loadOrderHistory() {
        $.ajax({
            url: "../php-files/fetch-order-history.php",
            type: "GET",
            dataType: "json",
            success: function (response) {
                if (response.status === "success") {
                    displayOrders(response.orders);
                } else {
                    $("#orderHistoryContainer").html(`<p class='text-danger'>${response.message}</p>`);
                }
            },
            error: function (xhr, status, error) {
                console.error("Error fetching order history:", error);
                $("#orderHistoryContainer").html("<p class='text-danger'>Failed to load order history.</p>");
            }
        });
    }

    function displayOrders(orders) {
        if (orders.length === 0) {
            $("#orderHistoryContainer").html("<p class='text-muted'>No orders found.</p>");
            return;
        }

        let orderHTML = "";
        orders.forEach(order => {
            let productsHTML = "";
            order.products.forEach(product => {
                productsHTML += `
                    <li class="list-group-item">
                        <strong>${product.product_name}</strong> - RM ${parseFloat(product.price).toFixed(2)} x ${product.quantity}
                    </li>`;
            });

            orderHTML += `
                <div class="card mb-4">
                    <div class="card-header">
                        <strong>Order Number:</strong> ${order.order_number} <br>
                        <strong>Total Amount:</strong> RM ${parseFloat(order.total_amount).toFixed(2)} <br>
                        <strong>Order Status:</strong> <span class="badge bg-info">${order.order_status}</span> <br>
                        <strong>Order Date:</strong> ${order.order_date}
                    </div>
                    <div class="card-body">
                        <h5 class="fw-bold">Order Items</h5>
                        <ul class="list-group mb-3">${productsHTML}</ul>
                        <button class="btn btn-primary btn-sm track-order-btn" data-order-id="${order.order_id}">
                            Track Order
                        </button>
                    </div>
                </div>`;
        });

        $("#orderHistoryContainer").html(orderHTML);

        // Add event listener to Track Order buttons
        $(".track-order-btn").click(function () {
            let orderId = $(this).data("order-id");
            window.location.href = `track-order.html?order_id=${orderId}`;
        });
    }
});
