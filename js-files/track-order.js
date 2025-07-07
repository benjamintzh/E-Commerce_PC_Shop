$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get("order_id");

    if (!orderId) {
        alert("Error: No order selected.");
        window.location.href = "order-history.html";
        return;
    }

    $.ajax({
        url: `../php-files/track-order.php?order_id=${orderId}`,
        type: "GET",
        dataType: "json",
        success: function (response) {
            if (response.status === "success") {
                displayTracking(response.data);
            } else {
                $("#trackingSteps").html(`<li class="list-group-item text-danger">${response.message}</li>`);
            }
        },
        error: function (xhr) {
            console.error("Error fetching tracking info:", xhr.responseText);
            $("#trackingSteps").html("<li class='list-group-item text-danger'>Failed to load tracking data.</li>");
        }
    });

    function displayTracking(trackingData) {
        let stepsHTML = "";
        let progressPercent = 0;
        const statusSteps = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
        const currentStatusIndex = statusSteps.indexOf(trackingData.status);

        if (currentStatusIndex !== -1) {
            progressPercent = ((currentStatusIndex + 1) / statusSteps.length) * 100;
        }

        // ✅ Update UI with `order_number`
        $("#orderNumber").text(trackingData.order_number);
        $("#orderStatus").text(trackingData.status);
        $("#progressBar").css("width", `${progressPercent}%`);

        trackingData.steps.forEach(step => {
            stepsHTML += `<li class="list-group-item">${step.status} - <small>${step.status_date}</small></li>`;
        });

        $("#trackingSteps").html(stepsHTML);
    }
});
