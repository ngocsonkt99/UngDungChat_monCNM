
function imageChat(divId) {
    $(`#image-chat-${divId}`).unbind("change").on("change", function () {
        let fileData = $(this).prop("files")[0];
        let math = ["image/png", "image/jpg", "image/jpeg"];
        let limit = 10485760;// byte = 10MB

        if ($.inArray(fileData.type, math) === -1) {
            alertify.notify("Kiểu file không hợp lệ, chỉ chấp nhận jpg, jpeg, jpeg", "error", 7);
            $(this).val(null);
            return false;
        }
        if (fileData.size > limit) {
            alertify.notify("Ảnh upload tối đa cho phép là 10MB", "error", 7);
            $(this).val(null);
            return false;
        }

        let targetId = $(this).data("chat");
        let isChatGroup = false;

        let messageFormData = new FormData();
        messageFormData.append("my-image-chat", fileData);
        messageFormData.append("uid", targetId);

        if ($(this).hasClass("chat-in-group")) {
            messageFormData.append("isChatGroup", true);
            isChatGroup = true;

        }
        $.ajax({
            url: "/message/add-new-image",
            type: "post",
            cache: false,
            contentType: false,
            processData: false,
            data: messageFormData,
            success: function (data) {

                let dataToEmit = {
                    message: data.message,
                };

                let messageOfMe = $(`<div class="bubble me bubble-image-file" data-mess-id="${data.message._id}"></div>`);

                let imageChat = ` <img src="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)} " class="show-image-chat">`;

                if (isChatGroup) {
                    let senderAvatar = (`<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}"/>`);

                    messageOfMe.html(`${senderAvatar} ${imageChat}`);

                    dataToEmit.groupId = targetId;
                } else {
                    let senderAvatar = (`<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}"/>`);

                    messageOfMe.html(`${senderAvatar} ${imageChat}`);
                    // messageOfMe.html(imageChat);

                    dataToEmit.contactId = targetId;
                }

                //append message data to screen
                $(`.right .chat[data-chat = ${divId}]`).append(messageOfMe);
                nineScrollRight(divId);

                //change data preview & time leftSide 
                $(`.person[data-chat = ${divId}]`).find("span.time").removeClass("message-time-real-time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());

                $(`.person[data-chat = ${divId}]`).find("span.preview").html("Hình ảnh...");

                //move conversation to the top
                $(`.person[data-chat = ${divId}]`).on("click.moveConversationToTheTop", function () {
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("click.moveConversationToTheTop");
                });
                $(`.person[data-chat = ${divId}]`).click();

                //realtime
                socket.emit("chat-image", dataToEmit);

                //add to modal image
                let imageChatToAddModal = `<img src="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" >`;

                $(`#imagesModal_${divId}`).find("div.all-images").append(imageChatToAddModal);
            },
            error: function (error) {
                alertify.notify(error.responseText, "error", 7);
            }
        });
    });
}

$(document).ready(function () {
    socket.on("response-chat-image", function (response) {
        let divId = "";
        //handle message data to before show
        let messageOfYou = $(`<div class="bubble you bubble-image-file" data-mess-id="${response.message._id}"></div>`);
        messageOfYou.text(response.message.text);

        let imageChat = ` <img src="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)} " class="show-image-chat">`;

        if (response.currentGroupId) {
            let senderAvatar = (`<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}"/>`);

            messageOfYou.html(`${senderAvatar} ${imageChat}`);

            divId = response.currentGroupId;

        } else {
            let senderAvatar = (`<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}"/>`);

            messageOfYou.html(`${senderAvatar} ${imageChat}`);
            //  messageOfYou.html(imageChat);
            divId = response.currentUserId;
        }

        if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
            $(`.right .chat[data-chat = ${divId}]`).append(messageOfYou);
            nineScrollRight(divId);
            $(`.person[data-chat = ${divId}]`).find("span.time").addClass("message-time-real-time");
        }

        $(`.person[data-chat = ${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());

        $(`.person[data-chat = ${divId}]`).find("span.preview").html("Hình ảnh ...");

        $(`.person[data-chat = ${divId}]`).on("click.moveConversationToTheTop", function () {
            let dataToMove = $(this).parent();
            $(this).closest("ul").prepend(dataToMove);
            $(this).off("click.moveConversationToTheTop");
        });
        $(`.person[data-chat = ${divId}]`).click();

        if (response.currentGroupId !== $("#dropdown-navbar-user").data("uid")) {

            let imageChatToAddModal = `<img src="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}">`;

            $(`#imagesModal_${divId}`).find("div.all-images").append(imageChatToAddModal);
        }

    });
});