$(document).ready(function () {
  console.log("cart.js loaded - Cart page loaded.");

  // Function to load cart data from the server
  function loadCart() {
      $.ajax({
          url: "http://localhost/DSC115-Project/php-files/view-cart.php",
          type: "GET",
          dataType: "json",
          success: function (response) {
              console.log("Cart response:", response);

              if (response.error) {
                  $("#cartContainer").html("<p class='text-danger'>" + response.error + "</p>");
                  $("#totalPrice").text("Total: RM 0.00");
              } else {
                  let cartItems = response.cart || [];

                  if (cartItems.length === 0) {
                      $("#cartContainer").html("<p>Your cart is empty.</p>");
                      $("#totalPrice").text("Total: RM 0.00");
                  } else {
                      let html = "";
                      cartItems.forEach(function (item) {
                          let imageUrl = item.image;
                          if (!/^https?:\/\//.test(imageUrl)) {
                              imageUrl = "http://localhost/DSC115-Project/" + imageUrl;
                          }

                          html += `
                              <div class="row cart-item mb-3" data-cart-id="${item.cart_id}">
                                  <div class="col-md-2">
                                      <img src="${imageUrl}" alt="${item.product_name}" class="img-fluid">
                                  </div>
                                  <div class="col-md-4">
                                      <h5>${item.product_name}</h5>
                                      <p>Price: RM ${parseFloat(item.price).toFixed(2)}</p>
                                  </div>
                                  <div class="col-md-2">
                                      <div class="input-group">
                                          <button class="btn btn-outline-secondary qty-decrease" data-cart-id="${item.cart_id}">-</button>
                                          <input type="text" class="form-control text-center qty-input" style="max-width: 50px;" value="${item.quantity}" data-cart-id="${item.cart_id}">
                                          <button class="btn btn-outline-secondary qty-increase" data-cart-id="${item.cart_id}">+</button>
                                      </div>
                                  </div>
                                  <div class="col-md-2 text-end">
                                      <p>Total: RM ${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                                  </div>
                                  <div class="col-md-2 text-end">
                                      <button class="btn btn-danger remove-btn" data-cart-id="${item.cart_id}">Remove</button>
                                  </div>
                              </div>
                          `;
                      });

                      $("#cartContainer").html(html);

                      // ✅ Calculate overall total price
                      let totalPrice = cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
                      $("#totalPrice").text("Total: RM " + totalPrice.toFixed(2));

                      // ✅ Store total price in localStorage before checkout
                      localStorage.setItem("totalAmount", totalPrice.toFixed(2));
                  }
              }
          },
          error: function (xhr, status, error) {
              console.error("Error fetching cart data:", error);
              $("#cartContainer").html("<p class='text-danger'>Failed to load cart.</p>");
          }
      });
  }

  loadCart(); // Load the cart when the page is ready

  // ✅ Add event listener for "Proceed to Checkout" button
  $(document).on("click", "#checkoutBtn", function () {
      let totalAmount = localStorage.getItem("totalAmount") || "0.00";
      if (totalAmount === "0.00") {
          alert("Your cart is empty. Add items before proceeding to checkout.");
      } else {
          window.location.href = "../html-files/checkout.html"; // Redirect to checkout page
      }
  });

  // Delegate click event for remove buttons
  $(document).on("click", ".remove-btn", function () {
      let cartId = $(this).data("cart-id");
      console.log("Removing cart item with id:", cartId);

      $.ajax({
          url: "http://localhost/DSC115-Project/php-files/remove-from-cart.php",
          type: "POST",
          dataType: "json",
          data: { cartId: cartId },
          success: function (response) {
              if (response.error) {
                  alert("Error: " + response.error);
              } else {
                  alert("Item removed from cart.");
                  loadCart(); // Reload the cart after removal
              }
          },
          error: function (xhr, status, error) {
              console.error("Error removing item from cart:", error);
              alert("Failed to remove item from cart.");
          }
      });
  });

  // Delegate click event for quantity increase
  $(document).on("click", ".qty-increase", function () {
      let cartId = $(this).data("cart-id");
      let $input = $(`.qty-input[data-cart-id='${cartId}']`);
      let currentQty = parseInt($input.val());
      let newQty = currentQty + 1;
      updateCartQuantity(cartId, newQty);
  });

  // Delegate click event for quantity decrease
  $(document).on("click", ".qty-decrease", function () {
      let cartId = $(this).data("cart-id");
      let $input = $(`.qty-input[data-cart-id='${cartId}']`);
      let currentQty = parseInt($input.val());
      if (currentQty > 1) {
          let newQty = currentQty - 1;
          updateCartQuantity(cartId, newQty);
      }
  });

  // Delegate event for manual quantity input change (optional)
  $(document).on("change", ".qty-input", function () {
      let cartId = $(this).data("cart-id");
      let newQty = parseInt($(this).val());
      if (isNaN(newQty) || newQty < 1) {
          newQty = 1;
      }
      updateCartQuantity(cartId, newQty);
  });

  // Function to update quantity via AJAX
  function updateCartQuantity(cartId, newQty) {
      $.ajax({
          url: "http://localhost/DSC115-Project/php-files/update-cart-qty.php",
          type: "POST",
          dataType: "json",
          data: { cartId: cartId, quantity: newQty },
          success: function (response) {
              if (response.error) {
                  alert("Error updating quantity: " + response.error);
              } else {
                  loadCart(); // Reload cart data after successful update
              }
          },
          error: function (xhr, status, error) {
              console.error("Error updating cart quantity:", error);
              alert("Failed to update quantity.");
          }
      });
  }
});
