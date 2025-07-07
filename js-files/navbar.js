$(document).ready(function () {
    let closeTimeout;
    let menuItems = {
        product: [],
        services: [
            { name: "E-waste Recycling", link: "../html-files/e-waste.html" },
            { name: "Appointment", link: "../html-files/appointment.html" }
        ]
    };

    function loadCategories() {
        $.ajax({
            url: "http://localhost/DSC115-Project/php-files/fetch-navbar.php",
            type: "GET",
            dataType: "json",
            success: function (response) {
                if (response.categories) {
                    menuItems.product = response.categories;
                }
            },
            error: function (xhr, status, error) {
                console.error("Error fetching navbar categories:", error);
            }
        });
    }

    function updateNavbar() {
        let userId = sessionStorage.getItem("userId");
        let username = sessionStorage.getItem("username") || "User";
    
        let navLinks = `
            <li class="nav-item"><a class="nav-link menu-link px-3" href="../html-files/promotion.html" data-category="none">Promotion</a></li>
            <li class="nav-item"><a class="nav-link menu-link px-3" href="../html-files/product.html" data-category="product">Product</a></li>
            <li class="nav-item"><a class="nav-link menu-link px-3" href="../html-files/services.html" data-category="services">Services</a></li>`;
    
        if (userId) {
            navLinks += `<li class="nav-item"><a class="nav-link menu-link px-3" href="../html-files/order-history.html" data-category="order">Order</a></li>`;
    
            $("#auth-links").html(`
                <li class="nav-item dropdown">
                    <a class="nav-link profile-dropdown" href="#" id="profileDropdown">
                        <i class="fas fa-user-circle"></i> Welcome, ${username}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><a class="dropdown-item" href="../html-files/profile.html">User Profile</a></li>
                        <li><a class="dropdown-item text-danger" id="logoutBtn" href="../html-files/index.html">Sign Out</a></li>
                    </ul>
                </li>
                <li class="nav-item cart-item">
                    <a class="nav-link" href="cart.html">
                        <i class="fas fa-shopping-cart"></i> <span id="cart-count">0</span> Items - <strong id="cartTotalPrice">MYR 0.00</strong>
                    </a>
                </li>
            `);
    
            $("#logoutBtn").click(function () {
                sessionStorage.removeItem("userId");
                sessionStorage.removeItem("username");
                window.location.href = "login.html";
            });
    
            // ✅ Fetch and update cart totals dynamically
            updateCartUI();
        } else {
            $("#auth-links").html(`
                <li class="nav-item"><a class="nav-link" href="login.html">Login</a></li>
                <li class="nav-item"><a class="nav-link" href="register.html">Register</a></li>
            `);
        }
    
        $("#navbarNav .navbar-nav").html(navLinks);
    }
    
    // ✅ Run on page load
    updateNavbar();    
    loadCategories();

    function updateCartUI() {
        let userId = sessionStorage.getItem("userId");
        if (!userId) return; // If user is not logged in, do nothing
    
        $.ajax({
            url: "http://localhost/DSC115-Project/php-files/view-cart.php",
            type: "GET",
            dataType: "json",
            success: function(response) {
                let cartItems = response.cart || [];
                let cartQty = 0;
                let totalPrice = 0;
    
                cartItems.forEach(item => {
                    cartQty += item.quantity;
                    totalPrice += item.price * item.quantity;
                });
    
                totalPrice = totalPrice.toFixed(2);
    
                // ✅ Update cart total in navbar **without refreshing**
                $("#cart-count").text(cartQty);
                $("#cartTotalPrice").text(`MYR ${totalPrice}`);
            },
            error: function(xhr, status, error) {
                console.error("Error updating cart UI:", error);
            }
        });
    }    

    $(".menu-link").mouseenter(function () {
        clearTimeout(closeTimeout);
        let category = $(this).data("category");
    
        if (category === "none") {
            $("#bottom-nav").html("");
            $("#bottom-header").slideUp(600);
        } else {
            let items = menuItems[category] || [];
    
            if (items.length === 0 && category === "product") {
                loadCategories();
                return;
            }
    
            let html = items.map(item =>
                `<li class="nav-item">
                    <a class="nav-link px-3" href="${item.link}">${item.name}</a>
                </li>`).join("");
    
            $("#bottom-nav").html(html);
            $("#bottom-header").slideDown(600);
        }
    });

    $(".menu-link, #bottom-header").mouseleave(function () {
        closeTimeout = setTimeout(() => {
            if (!$("#bottom-header").is(":hover") && !$(".menu-link:hover").length) {
                $("#bottom-header").slideUp(600);
            }
        }, 300);
    });

    $("#bottom-header").mouseenter(function () {
        clearTimeout(closeTimeout);
    });

    // Show profile dropdown on hover
    $(document).on("mouseenter", ".profile-dropdown", function () {
        $(this).next(".dropdown-menu").addClass("show");
    });

    $(document).on("mouseleave", ".dropdown-menu", function () {
        $(this).removeClass("show");
    });

    // Update cart dynamically when an event is triggered
    $(document).on("cartUpdated", function () {
        updateNavbar();
    });
});
