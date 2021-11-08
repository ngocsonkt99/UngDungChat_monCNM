function attachmentChat(divId) {
    $(`#attachment-chat-${divId}`).unbind("change").on("change", function () {
        let fileData = $(this).prop("files")[0];
        let limit = 10485760;// byte = 10MB

        if (fileData.size > limit) {
            alertify.notify("Tệp tối đa cho phép là 10MB", "error", 7);
            $(this).val(null);
            return false;
        }

        let targetId = $(this).data("chat");
        let isChatGroup = false;

        let messageFormData = new FormData();
        messageFormData.append("my-attachment-chat", fileData);
        messageFormData.append("uid", targetId);

        if ($(this).hasClass("chat-in-group")) {
            messageFormData.append("isChatGroup", true);
            isChatGroup = true;

        }

        $.ajax({
            url: "/message/add-new-attachment",
            type: "post",
            cache: false,
            contentType: false,
            processData: false,
            data: messageFormData,
            success: function (data) {

                let dataToEmit = {
                    message: data.message,
                };

                let messageOfMe = $(`<div class="bubble me bubble-attachment-file" data-mess-id="${data.message._id}"></div>`);

                let attachmentChat = ` 
                    <a href="data:${data.message.file.contentType}; base64,${bufferToBase64(data.message.file.data.data)}" download="${data.message.file.fileName}">
                    ${data.message.file.fileName}
                </a>`;

                if (isChatGroup) {
                    let senderAvatar = (`<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}"/>`);

                    messageOfMe.html(`${senderAvatar} ${attachmentChat}`);

                    dataToEmit.groupId = targetId;
                } else {
                    let senderAvatar = (`<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}"/>`);

                    messageOfMe.html(`${senderAvatar} ${attachmentChat}`);
                    // messageOfMe.html(imageChat);

                    dataToEmit.contactId = targetId;
                }

                //append message data to screen
                $(`.right .chat[data-chat = ${divId}]`).append(messageOfMe);
                nineScrollRight(divId);

                //change data preview & time leftSide 
                $(`.person[data-chat = ${divId}]`).find("span.time").removeClass("message-time-real-time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());

                $(`.person[data-chat = ${divId}]`).find("span.preview").html("Tệp đính kèm...");

                //move conversation to the top
                $(`.person[data-chat = ${divId}]`).on("click.moveConversationToTheTop", function () {
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("click.moveConversationToTheTop");
                });
                $(`.person[data-chat = ${divId}]`).click();
                //realtime
                socket.emit("chat-attachment", dataToEmit);

                //add to modal attachment
                let attachmentChatToAddModal = `
                <li>
                        <a href="data:${data.message.file.contentType}; base64,${bufferToBase64(data.message.file.data.data)}" download="${data.message.file.fileName}">
                            ${data.message.file.fileName}
                        </a>
                </li>
                `;

                $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatToAddModal);
            },
            error: function (error) {
                alertify.notify(error.responseText, "error", 7);
            }
        });
    });
}

$(document).ready(function () {
    socket.on("response-chat-attachment", function (response) {
        let divId = "";
        //handle message data to before show
        let messageOfYou = $(`<div class="bubble you bubble-attachment-file" data-mess-id="${response.message._id}"></div>`);
        messageOfYou.text(response.message.text);

        let attachmentChat = ` 
                    <a href="data:${response.message.file.contentType}; base64,${bufferToBase64(response.message.file.data.data)}" download="${response.message.file.fileName}">
                    ${response.message.file.fileName}
                </a>`;

        if (response.currentGroupId) {
            let senderAvatar = (`<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}"/>`);

            messageOfYou.html(`${senderAvatar} ${attachmentChat}`);

            divId = response.currentGroupId;

        } else {
            let senderAvatar = (`<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}"/>`);

            messageOfYou.html(`${senderAvatar} ${attachmentChat}`);
            //  messageOfYou.html(imageChat);
            divId = response.currentUserId;
        }

        if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
            $(`.right .chat[data-chat = ${divId}]`).append(messageOfYou);
            nineScrollRight(divId);
            $(`.person[data-chat = ${divId}]`).find("span.time").addClass("message-time-real-time");
        }

        $(`.person[data-chat = ${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());

        $(`.person[data-chat = ${divId}]`).find("span.preview").html("Tệp đính kèm ...");

        $(`.person[data-chat = ${divId}]`).on("click.moveConversationToTheTop", function () {
            let dataToMove = $(this).parent();
            $(this).closest("ul").prepend(dataToMove);
            $(this).off("click.moveConversationToTheTop");
        });
        $(`.person[data-chat = ${divId}]`).click();

        if (response.currentGroupId !== $("#dropdown-navbar-user").data("uid")) {
            let attachmentChatToAddModal = `
        <li>
                <a href="data:${response.message.file.contentType}; base64,${bufferToBase64(response.message.file.data.data)}" download="${response.message.file.fileName}">
                    ${response.message.file.fileName}
                </a>
        </li>
        `;

            $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatToAddModal);

        }

    });
})