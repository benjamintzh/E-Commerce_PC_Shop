document.addEventListener("DOMContentLoaded", function () {
    fetchDashboardData();
});

// Fetch and Display Dashboard Data
function fetchDashboardData() {
    fetch("http://localhost/DSC115-Project/admin-php-files/fetch-dashboard.php")
        .then(response => response.json())
        .then(data => {
            // Update Summary Cards
            document.getElementById("totalOrders").innerText = data.totalOrders || 0;
            document.getElementById("totalAppointments").innerText = data.totalAppointments || 0;
            document.getElementById("totalProducts").innerText = data.totalProducts || 0;
            document.getElementById("outOfStock").innerText = data.outOfStock || 0;

            // Update Recent Orders Table
            let ordersTable = document.getElementById("recentOrdersTable");
            ordersTable.innerHTML = "";
            data.recentOrders.forEach(order => {
                ordersTable.innerHTML += `
                    <tr>
                        <td>${order.order_id}</td>
                        <td>${order.order_number}</td>
                        <td>${order.user_id}</td>
                        <td>RM ${order.total_amount}</td>
                        <td>${order.order_status}</td>
                    </tr>
                `;
            });

            // Update Low Stock Table
            let lowStockTable = document.getElementById("lowStockTable");
            lowStockTable.innerHTML = "";
            data.lowStockProducts.forEach(product => {
                lowStockTable.innerHTML += `
                    <tr>
                        <td>${product.product_name}</td>
                        <td>${product.category}</td>
                        <td>${product.stock_quantity}</td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error("❌ Error fetching dashboard data:", error));
}
