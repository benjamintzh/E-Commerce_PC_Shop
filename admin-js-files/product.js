document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM Loaded! Checking which page is loaded...");

    if (window.location.pathname.includes("admin-product.html")) {
        console.log("✅ Running fetchProducts() for Product List...");
        fetchProducts();
    } else if (window.location.pathname.includes("edit-product.html")) {
        console.log("✅ Running loadProductData() for Edit Product...");
        loadProductData();
        setupProductForm(true);
    } else if (window.location.pathname.includes("add-product.html")) {
        console.log("✅ Running setupProductForm() for Add Product...");
        setupProductForm(false);
    }
});

// 🔹 Fetch & Display All Products (Product List Page)
function fetchProducts() {
    fetch("http://localhost/DSC115-Project/admin-php-files/fetch-product.php")
        .then(response => response.json())
        .then(products => {
            let table = document.getElementById("productTable");
            if (!table) return;

            table.innerHTML = "";
            let index = 1;

            products.forEach(product => {
                let stockBadge = product.stock_quantity > 0 
                    ? `<span class="stock-status in-stock">In Stock</span>` 
                    : `<span class="stock-status out-of-stock">Out of Stock</span>`;

                table.innerHTML += `
                    <tr>
                        <td>${index++}</td>
                        <td class="product-name">
                            <img src="../images/product/${product.product_img}" alt="Image">
                            <span>${product.product_name}</span>
                        </td>
                        <td><span class="category-badge">${product.category}</span></td>
                        <td>${stockBadge}</td>
                        <td>RM ${parseFloat(product.price).toFixed(2)}</td>
                        <td class="actions">
                            <a href="edit-product.html?id=${product.product_id}" class="btn btn-warning">Edit</a>
                            <button class="btn btn-danger" onclick="deleteProduct(${product.product_id})">Delete</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error("Error fetching products:", error));
}

// 🔹 Search Functionality
document.getElementById("searchProduct").addEventListener("input", function () {
    let searchQuery = this.value.toLowerCase();
    let rows = document.querySelectorAll("#productTable tr");

    rows.forEach(row => {
        let productName = row.querySelector(".product-name span").innerText.toLowerCase();
        let category = row.querySelector(".category-badge").innerText.toLowerCase();

        if (productName.includes(searchQuery) || category.includes(searchQuery)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});

// 🔹 Delete Product Function
function deleteProduct(productId) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    fetch(`http://localhost/DSC115-Project/admin-php-files/delete-product.php?id=${productId}`, {
        method: "GET",
    })
    .then(response => response.text())
    .then(data => {
        if (data === "success") {
            alert("Product deleted successfully!");
            fetchProducts();
        } else {
            alert("Error: " + data);
        }
    })
    .catch(error => console.error("Error:", error));
}

// 🔹 Load Product Data for Editing
function loadProductData() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        alert("No product ID found!");
        window.location.href = "admin-product.html"; // Redirect back
        return;
    }

    fetch(`http://localhost/DSC115-Project/admin-php-files/fetch-product.php?id=${productId}`)
        .then(response => response.json())
        .then(product => {
            if (!product) {
                alert("Product not found!");
                window.location.href = "admin-product.html";
                return;
            }

            document.getElementById("product_id").value = product.product_id;
            document.getElementById("product_name").value = product.product_name;
            document.getElementById("category").value = product.category;
            document.getElementById("brand").value = product.brand;
            document.getElementById("price").value = parseFloat(product.price).toFixed(2);
            document.getElementById("stock_quantity").value = product.stock_quantity;
            document.getElementById("description").value = product.description || "";

            if (product.product_img) {
                const previewImage = document.getElementById("previewImage");
                previewImage.src = `../images/product/${product.product_img}`;
                previewImage.style.display = "block";
            }
        })
        .catch(error => console.error("Error loading product data:", error));
}

// 🔹 Handle Add & Edit Product Form Submission
function setupProductForm(isEdit) {
    const form = document.getElementById("productForm");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const productId = isEdit ? document.getElementById("product_id").value : null;
        const formData = new FormData(form);

        const url = isEdit
            ? `http://localhost/DSC115-Project/admin-php-files/edit-product.php?id=${productId}`
            : "http://localhost/DSC115-Project/admin-php-files/add-product.php";

        fetch(url, {
            method: "POST",
            body: formData,
        })
        .then(response => response.text())
        .then(data => {
            if (data === "success") {
                alert(isEdit ? "Product updated successfully!" : "Product added successfully!");
                window.location.href = "admin-product.html";
            } else {
                alert("Error: " + data);
            }
        })
        .catch(error => console.error("Error:", error));
    });
}

// 🔹 Live Image Preview for Add/Edit Product
document.addEventListener("DOMContentLoaded", function () {
    const productImageInput = document.getElementById("product_img");
    if (productImageInput) {
        productImageInput.addEventListener("change", function (event) {
            const file = event.target.files[0];
            const previewImage = document.getElementById("previewImage");
            if (file) {
                const reader = new FileReader();
                reader.onload = function () {
                    previewImage.src = reader.result;
                    previewImage.style.display = "block";
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// 🔹 Load Product Summary Data
function loadProductSummary() {
    fetch("http://localhost/DSC115-Project/admin-php-files/fetch-product.php")
        .then(response => response.json())
        .then(products => {
            if (!products || products.length === 0) {
                console.warn("⚠️ No products found.");
                return;
            }

            let totalProducts = products.length;
            let inStock = products.filter(product => product.stock_quantity > 5).length;
            let outOfStock = totalProducts - inStock;

            // Update dashboard summary cards
            document.getElementById("totalProducts").innerText = totalProducts;
            document.getElementById("inStock").innerText = inStock;
            document.getElementById("outOfStock").innerText = outOfStock;
        })
        .catch(error => console.error("❌ Error loading product summary:", error));
}

// 🔹 Call the function when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.includes("admin-product.html")) {
        loadProductSummary();
    }
});
