
// Global variable to store the current product once loaded
var currentProduct = null;

// Function to get query parameters from the URL
function getQueryParam(param) {
  let params = new URLSearchParams(window.location.search);
  return params.get(param);
}

$(document).ready(function () {
  let productId = getQueryParam("id");

  // ✅ Debugging: Log extracted product ID
  console.log("Extracted Product ID from URL:", productId);

  // ✅ If no product ID is found, show an error and stop execution
  if (!productId) {
    console.error("Product ID is missing in the URL!");
    $("#productDetail").html("<p class='text-danger'>No product selected.</p>");
    return;
  }

  // ✅ Debugging: Log full request URL before making the AJAX request
  let requestURL = "http://localhost/DSC115-Project/php-files/fetch-product-details.php?id=" + encodeURIComponent(productId);
  console.log("Fetching product details from:", requestURL);

  // AJAX request to fetch product details
  $.ajax({
    url: requestURL,
    type: "GET",
    dataType: "json",
    success: function (product) {
      console.log("AJAX response received:", product);

      // ✅ Fix: Check if the response contains valid product data
      if (!product || Object.keys(product).length === 0 || product.error) {
        console.error("Product not found or invalid response:", product);
        $("#productDetail").html("<p class='text-danger'>Product not found.</p>");
        return;
      }

      // Store the product for later use
      currentProduct = product;

      let productHTML = `
        <div class="col-md-6">
          <img src="${product.image}" class="img-fluid" alt="${product.product_name}">
        </div>
        <div class="col-md-6">
          <h2>${product.product_name}</h2>
          <p>${product.description || "No description available."}</p>
          <p class="fw-bold">Price: RM ${parseFloat(product.price).toFixed(2)}</p>
          <p>Category: ${product.category}</p>
          
          <!-- Quantity Selection -->
          <div class="input-group mb-3" style="max-width:120px;">
            <button class="btn btn-outline-secondary qty-decrease" type="button">-</button>
            <input type="number" class="form-control text-center qty-input" value="1" min="1">
            <button class="btn btn-outline-secondary qty-increase" type="button">+</button>
          </div>

          <button class="btn btn-primary" id="addToCart">Add to Cart</button>
        </div>
      `;

      $("#productDetail").html(productHTML);
      console.log("Product loaded successfully:", product);
    },
    error: function (xhr, status, error) {
      $("#productDetail").html("<p class='text-danger'>Error loading product details.</p>");
      console.error("AJAX error:", error);
      console.error("Full Response:", xhr.responseText);
    }
  });
});


// ✅ Delegated event binding for Add to Cart button
$(document).on("click", "#addToCart", function () {
  console.log("Add to Cart button clicked.");

  if (!currentProduct) {
    console.error("currentProduct is not set.");
    return;
  }

  // ✅ Get the quantity from the input field
  let quantity = parseInt($(".qty-input").val());
  if (isNaN(quantity) || quantity < 1) {
    quantity = 1;
  }

  // ✅ Debugging: Log what is being sent to the backend
  console.log("Adding to cart - Product ID:", currentProduct.product_id, "Quantity:", quantity);

  // ✅ Send an AJAX POST request to add-to-cart.php with the selected quantity
  $.ajax({
    url: "http://localhost/DSC115-Project/php-files/add-to-cart.php",
    type: "POST",
    dataType: "json",
    data: {
      productId: currentProduct.product_id,
      quantity: quantity
    },
    success: function (response) {
      if (response.error) {
        alert("Error: " + response.error);
      } else {
        alert("Product added to cart!");
      }
    },
    error: function (xhr, status, error) {
      console.error("AJAX error:", error);
      console.error("Full Response:", xhr.responseText);
      alert("An error occurred while adding to cart.");
    }
  });
});

// ✅ Delegated event binding for quantity decrease button
$(document).on("click", ".qty-decrease", function () {
  let $input = $(this).siblings(".qty-input");
  let currentVal = parseInt($input.val());
  if (currentVal > 1) {
    $input.val(currentVal - 1);
  }
});

// ✅ Delegated event binding for quantity increase button
$(document).on("click", ".qty-increase", function () {
  let $input = $(this).siblings(".qty-input");
  let currentVal = parseInt($input.val());
  $input.val(currentVal + 1);
});
