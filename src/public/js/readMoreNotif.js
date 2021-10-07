$(document).ready(function() {
    $("#link-read-more-notif").bind("click", function() {
        let skipNumber = $("ul.list-notifications").find("li").length;
        
        $("#link-read-more-notif").css("display", "none");
         $.get(`/notification/read-more?skipNumber = ${skipNumber}`, function(notifications) {
            if (!notifications.length) {
                alertify.notify("Bạn không còn thông báo nào để xem tiếp", "error", 7);
                return false;
            }
            notifications.forEach(function(notification) {
                $("ul.list-notifications").append(`<li>${notification}</li>`);
            })
        });
    });
});