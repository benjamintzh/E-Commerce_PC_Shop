$(document).ready(function () {
    loadTopSales();
});

// ✅ Function to Fetch and Display Top Sales Products
function loadTopSales() {
    $.ajax({
        url: "http://localhost/DSC115-Project/php-files/get-top-sales.php",
        type: "GET",
        dataType: "json",
        success: function (response) {
            console.log("Top Sales Data:", response); // Debugging Log

            if (response.success) {
                let products = response.topSales;
                let productHtml = "";

                if (products.length > 0) {
                    products.forEach(product => {
                        productHtml += `
                            <div class="col-sm-6 col-md-4 col-lg-3">
                                <div class="card">
                                    <img src="../images/product/${product.product_img}" class="card-img-top" alt="${product.product_name}">
                                    <div class="card-body text-center">
                                        <h6 class="fw-bold">${product.product_name}</h6>
                                        <p class="text-danger fw-bold">RM ${parseFloat(product.price).toFixed(2)}</p>
                                        <a href="product-details.html?id=${product.product_id}" class="btn btn-primary">View Deal</a>
                                    </div>
                                </div>
                            </div>`;
                    });
                } else {
                    productHtml = `<p class="text-muted text-center">No hot deals available at the moment.</p>`;
                }

                $("#hotDealsContainer").html(productHtml);
            } else {
                $("#hotDealsContainer").html("<p class='text-danger'>Failed to load hot deals.</p>");
            }
        },
        error: function (xhr) {
            console.error("Error fetching hot deals:", xhr.responseText);
            $("#hotDealsContainer").html("<p class='text-danger'>Error loading hot deals.</p>");
        }
    });
}
