$(document).ready(function () {
    console.log("Order summary page loaded.");

    // ✅ Retrieve order_number from sessionStorage
    let orderNumber = sessionStorage.getItem("order_number");

    if (!orderNumber || orderNumber.trim() === "") {
        console.warn("No order_number found in sessionStorage.");
        alert("Error: No order found.");
        window.location.href = "index.html"; 
        return;
    }

    console.log("Sending order_number:", orderNumber);

    // ✅ Fetch order details using `order_number`
    $.ajax({
        url: `../php-files/fetch-order-summary.php?order_number=${encodeURIComponent(orderNumber)}`,
        type: "GET",
        dataType: "json",
        success: function (response) {
            console.log("Order summary response:", response);

            if (response.status === "success") {
                let orderData = response.data;

                // ✅ Display order details
                $("#orderNumber").text(orderData.order_number);
                $("#paymentMethod").text(orderData.payment_method || "N/A");
                $("#totalAmount").text(`RM ${parseFloat(orderData.total_amount).toFixed(2)}`);

                let orderItems = orderData.items;
                let itemList = $("#orderItems");
                itemList.empty();

                if (orderItems.length > 0) {
                    orderItems.forEach(item => {
                        itemList.append(`
                            <li class="list-group-item">
                                <strong>${item.product_name}</strong> - RM ${parseFloat(item.price).toFixed(2)} x ${item.quantity}
                            </li>
                        `);
                    });
                } else {
                    itemList.append(`<li class="list-group-item text-muted">No products found in this order.</li>`);
                }

                // ✅ Clear sessionStorage only after successfully loading order
                sessionStorage.removeItem("order_number");
                sessionStorage.removeItem("order_id");

            } else {
                console.error("Server error:", response.message);
                alert("Error: " + response.message);
                sessionStorage.removeItem("order_number"); 
                window.location.href = "index.html"; 
            }
        },
        error: function (xhr) {
            console.error("AJAX Error:", xhr.responseText);
            alert("Failed to load order summary.");
            sessionStorage.removeItem("order_number"); 
            window.location.href = "index.html"; 
        }
    });
});
