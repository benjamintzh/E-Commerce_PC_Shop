$(document).ready(function () {
    let productsData = [];
    let allBrands = {}; // Store brands categorized by product category
    let selectedCategory = new URLSearchParams(window.location.search).get("category") || "all";
    let currentSortOrder = "default"; // Store the selected sort order

    function loadProducts() {
        $.ajax({
            url: "http://localhost/DSC115-Project/php-files/fetch-product.php?category=" + encodeURIComponent(selectedCategory),
            type: "GET",
            dataType: "json",
            success: function (response) {
                if (response.products) {
                    productsData = response.products.map(product => ({
                        ...product,
                        price: parseFloat(product.price)
                    }));

                    displayProducts(productsData);
                    populateFilters(response.categories, response.brands);
                    mapBrandsToCategories(response.products);
                } else {
                    console.error("Invalid response format:", response);
                    $("#productContainer").html("<p class='text-center text-danger'>No products found.</p>");
                }
            },
            error: function (xhr, status, error) {
                console.error("Error fetching products:", error);
                $("#productContainer").html("<p class='text-center text-danger'>Failed to load products.</p>");
            }
        });
    }

    function displayProducts(products) {
        let productHTML = "";
        products.forEach(product => {
            productHTML += `
                <div class="col-sm-6 col-md-4 col-lg-3 product-card-container" 
                     data-price="${product.price}" 
                     data-category="${product.category}" 
                     data-brand="${product.brand}">
                    <div class="product-card bg-white shadow-sm p-3 text-center">
                        <img src="${product.image}" class="img-fluid" alt="${product.product_name}">
                        <h6 class="fw-bold mt-2">${product.product_name}</h6>
                        <p class="text-muted">${product.category}</p>
                        <p class="text-danger fw-bold">RM ${product.price.toFixed(2)}</p>
                        <a href="product-details.html?id=${product.product_id}" class="btn btn-primary">View Details</a>
                    </div>
                </div>
            `;
        });
        $("#productContainer").html(productHTML);
    }

    function populateFilters(categories, brands) {
        $(".category-filters").html(""); // Clear existing categories
        $(".brand-filters").html(""); // Clear existing brands

        // Populate categories (Desktop - No "All Categories")
        categories.forEach(category => {
            $(".category-filters").append(`
                <div>
                    <input type="checkbox" class="filter-category" value="${category}"> ${category}
                </div>
            `);
            $("#mobileCategoryFilter").append(`<option value="${category}">${category}</option>`);
        });

        // Populate brands (Desktop - No "All Brands")
        brands.forEach(brand => {
            $(".brand-filters").append(`
                <div class="col">
                    <input type="checkbox" class="filter-brand" value="${brand}"> ${brand}
                </div>
            `);
            $("#mobileBrandFilter").append(`<option value="${brand}">${brand}</option>`);
        });

        $(".filter-category").on("change", function () {
            let selectedCategories = $(".filter-category:checked").map(function () { return this.value; }).get();
            updateBrandsByCategory(selectedCategories);
            applyFilters();
        });

        $("#mobileCategoryFilter").on("change", function () {
            let selectedCategory = $(this).val();
            updateBrandsByCategory([selectedCategory]);
            applyFilters();
        });

        $(".filter-brand").on("change", applyFilters);
        $("#mobileBrandFilter").on("change", applyFilters);
    }

    function mapBrandsToCategories(products) {
        allBrands = {};
        products.forEach(product => {
            if (!allBrands[product.category]) {
                allBrands[product.category] = new Set();
            }
            allBrands[product.category].add(product.brand);
        });
    }

    function updateBrandsByCategory(selectedCategories) {
        let brandContainer = $(".brand-filters");
        let mobileBrandContainer = $("#mobileBrandFilter");

        brandContainer.html(""); // Clear existing brands (Desktop)
        mobileBrandContainer.html('<option value="all">All Brands</option>'); // Reset (Mobile)

        let selectedBrands = new Set(); // Store unique brands

        if (selectedCategories.length === 0 || selectedCategories.includes("all")) {
            // Show all brands if no category is selected
            Object.values(allBrands).forEach(brandSet => {
                brandSet.forEach(brand => selectedBrands.add(brand));
            });
        } else {
            // Show brands only for selected categories
            selectedCategories.forEach(category => {
                if (allBrands[category]) {
                    allBrands[category].forEach(brand => selectedBrands.add(brand));
                }
            });
        }

        // Update brand filter in both Desktop & Mobile
        selectedBrands.forEach(brand => {
            brandContainer.append(`
                <div class="col">
                    <input type="checkbox" class="filter-brand" value="${brand}"> ${brand}
                </div>
            `);
            mobileBrandContainer.append(`<option value="${brand}">${brand}</option>`);
        });

        $(".filter-brand").on("change", applyFilters); // Re-bind event after updating brands
    }

    function applyFilters() {
        let selectedCategories = $(".filter-category:checked").map(function () { return this.value; }).get();
        let selectedBrands = $(".filter-brand:checked").map(function () { return this.value; }).get();
        let mobileCategory = $("#mobileCategoryFilter").val();
        let mobileBrand = $("#mobileBrandFilter").val();

        if (mobileCategory !== "all") {
            selectedCategories = [mobileCategory];
        }
        if (mobileBrand !== "all") {
            selectedBrands = [mobileBrand];
        }

        let filteredProducts = productsData.filter(product => {
            let matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
            let matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
            return matchesCategory && matchesBrand;
        });

        // Apply sorting before displaying
        sortProducts(filteredProducts);
    }

    function sortProducts(filteredProducts = productsData) {
        let sortValue = $("#mobileSortPrice, #sortPrice").val();
        currentSortOrder = sortValue; // Save the selected sort order

        let sortedProducts = [...filteredProducts];

        if (sortValue === "low-high") {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (sortValue === "high-low") {
            sortedProducts.sort((a, b) => b.price - a.price);
        }

        displayProducts(sortedProducts);
    }

    $("#sortPrice, #mobileSortPrice").on("change", function () {
        let value = $(this).val();
        $("#sortPrice, #mobileSortPrice").val(value);
        currentSortOrder = value; // Save the sort selection
        sortProducts();
    });

    $("#mobileCategoryFilter, #mobileBrandFilter").on("change", function () {
        applyFilters();
    });

    loadProducts();
});
