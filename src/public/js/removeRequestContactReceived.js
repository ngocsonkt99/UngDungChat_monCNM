function removeRequestContactReceived(){
    $(".user-remove-request-contact-received").unbind("click").on("click", function(){
        let targetId = $(this).data("uid");
        $.ajax({
            url: "/contact/remove-request-contact-received",
            type:"delete",
            data:{uid: targetId},
            success: function(data){
                if(data.success){
                    // $(".noti_content").find(`div[data-uid = ${user.id}]`).remove();
                    // $("ul.list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove();              
                    //decreaseNumberNotification("noti_counter", 1);
                    decreaseNumberNotification("noti_contact_counter", 1);

                    decreaseNumberNotifContact("count-request-contact-received");  
                    
                    $("#request-contact-received").find(`li[data-uid = ${targetId}]`).remove();

                    socket.emit("remove-request-contact-received", {contactId: targetId});
                }
                
            }
        });
    });
}

socket.on("response-remove-request-contact-received", function (user) {
    $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${user.id}]`).hide();
    $("#find-user").find(`div.user-add-new-contact[data-uid = ${user.id}]`).css("display", "inline-block"); 
    
    // xoa o modal yeu cau ket ban
    $("#request-contact-sent").find(`li[data-uid = ${user.id}]`).remove();

    decreaseNumberNotifContact("count-request-contact-sent");
    
    decreaseNumberNotification("noti_contact_counter", 1);

});

$(document).ready(function() {
    removeRequestContactReceived();
})