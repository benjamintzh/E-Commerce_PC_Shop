$(document).ready(function () {
    // Fetch products
    function loadProducts() {
        $.ajax({
            url: "fetch-products.php",
            method: "GET",
            dataType: "json",
            success: function (response) {
                let tableRows = "";
                response.forEach(product => {
                    tableRows += `
                        <tr>
                            <td>${product.product_id}</td>
                            <td><img src="../images/product/${product.product_img}" width="50"></td>
                            <td>${product.product_name}</td>
                            <td>${product.category}</td>
                            <td>${product.brand}</td>
                            <td>RM ${product.price}</td>
                            <td>${product.stock_quantity}</td>
                            <td>
                                <button class="btn btn-danger btn-sm deleteProduct" data-id="${product.product_id}">Delete</button>
                            </td>
                        </tr>
                    `;
                });
                $("#productTable").html(tableRows);
            }
        });
    }

    // Add product
    $("#addProductForm").submit(function (e) {
        e.preventDefault();
        let formData = new FormData(this);
        $.ajax({
            url: "add-product.php",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function () {
                loadProducts();
                $("#addProductModal").modal("hide");
            }
        });
    });

    // Delete product
    $(document).on("click", ".deleteProduct", function () {
        let product_id = $(this).data("id");
        $.post("delete-product.php", { product_id }, function () {
            loadProducts();
        });
    });

    loadProducts();
});
