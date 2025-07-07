$(document).ready(function () {
    $.get("../admin-php-files/fetch-admins.php", function (data) {
        let admins = JSON.parse(data);
        admins.forEach(admin => {
            $("#adminSelect").append(`<option value="${admin.admin_id}">${admin.username}</option>`);
        });
    });

    $("#adminSelect").on("change", function () {
        let adminId = $(this).val();
        $.get("../admin-php-files/fetch-permissions.php?admin_id=" + adminId, function (data) {
            let permissions = JSON.parse(data);
            $("#can_add_product").prop("checked", permissions.can_add_product);
            $("#can_edit_product").prop("checked", permissions.can_edit_product);
            $("#can_delete_product").prop("checked", permissions.can_delete_product);
            $("#can_update_appointment_status").prop("checked", permissions.can_update_appointment_status);
            $("#appointmentStatuses").val(permissions.allowed_appointment_statuses.split(","));
            $("#can_update_order_status").prop("checked", permissions.can_update_order_status);
            $("#orderStatuses").val(permissions.allowed_order_statuses.split(","));
        });
    });

    $("#updatePermissions").on("click", function () {
        let adminId = $("#adminSelect").val();
        let permissions = {
            admin_id: adminId,
            can_add_product: $("#can_add_product").prop("checked"),
            can_edit_product: $("#can_edit_product").prop("checked"),
            can_delete_product: $("#can_delete_product").prop("checked"),
            can_update_appointment_status: $("#can_update_appointment_status").prop("checked"),
            allowed_appointment_statuses: $("#appointmentStatuses").val().join(","),
            can_update_order_status: $("#can_update_order_status").prop("checked"),
            allowed_order_statuses: $("#orderStatuses").val().join(",")
        };
        $.post("../php-files/update-permissions.php", permissions, function (response) {
            alert(response);
        });
    });
});
