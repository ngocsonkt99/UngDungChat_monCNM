function textAndEmojiChat(divId) {
    $(".emojionearea").unbind("keyup").on("keyup", function (element) {
        let currentEmojioneArea = $(this);
        if (element.which === 13) {
            let targetId = $(`#write-chat-${divId}`).data("chat");
            let messageVal = $(`#write-chat-${divId}`).val();

            if (!targetId.length || !messageVal.length) {
                return false;
            }

            let dataTextEmojiForSend = {
                uid: targetId,
                messageVal: messageVal
            };

            if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
                dataTextEmojiForSend.isChatGroup = true;
            }

            $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function (data) {
                let dataToEmit = {
                    message: data.message,
                };

                //handle message data to before show
                let messageOfMe = $(`<div class="bubble me data-mess-id="${data.message._id}"></div>`);
                messageOfMe.text(data.message.text);
                let convertEmojiMessage = emojione.toImage(messageOfMe.html());

                if (dataTextEmojiForSend.isChatGroup) {
                    let senderAvatar = (`<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}"/>`);

                    messageOfMe.html(`${senderAvatar} ${convertEmojiMessage}`);

                    dataToEmit.groupId = targetId;
                } else {
                    messageOfMe.html(convertEmojiMessage);
                    dataToEmit.contactId = targetId;
                }

                //append message data to screen
                $(`.right .chat[data-chat = ${divId}]`).append(messageOfMe);
                nineScrollRight(divId);

                //remove all data input 
                $(`write-chat-${divId}`).val("");
                currentEmojioneArea.find(".emojionearea-editor").text("");

                //change data preview & time leftSide 
                $(`.person[data-chat = ${divId}]`).find("span.time").removeClass("message-time-real-time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());

                $(`.person[data-chat = ${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));

                //move conversation to the top
                $(`.person[data-chat = ${divId}]`).on("appChat.moveConversationToTheTop", function () {
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("appChat.moveConversationToTheTop");
                });
                $(`.person[data-chat = ${divId}]`).trigger("appChat.moveConversationToThe");

                //realtime
                socket.emit("chat-text-emoji", dataToEmit);


            }).fail(function (response) {
                console.log(response)
            })
        }
    });
}

$(document).ready(function () {
    socket.on("response-chat-text-emoji", function (response) {

        let divId = "";
        //handle message data to before show
        let messageOfYou = $(`<div class="bubble you data-mess-id="${response.message._id}"></div>`);
        messageOfYou.text(response.message.text);
        let convertEmojiMessage = emojione.toImage(messageOfYou.html());

        if (response.currentGroupId) {
            let senderAvatar = (`<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}"/>`);

            messageOfYou.html(`${senderAvatar} ${convertEmojiMessage}`);

            divId = response.currentGroupId;

        } else {
            messageOfYou.html(convertEmojiMessage);
            divId = response.currentUserId;
        }

        if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
            $(`.right .chat[data-chat = ${divId}]`).append(messageOfYou);
            nineScrollRight(divId);
            $(`.person[data-chat = ${divId}]`).find("span.time").addClass("message-time-real-time")
        }

        //change data preview & time leftSide 
        $(`.person[data-chat = ${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());

        $(`.person[data-chat = ${divId}]`).find("span.preview").html(emojione.toImage(response.message.text));

        $(`.person[data-chat = ${divId}]`).on("appChat.moveConversationToTheTop", function () {
            let dataToMove = $(this).parent();
            $(this).closest("ul").prepend(dataToMove);
            $(this).off("appChat.moveConversationToTheTop");
        });
        $(`.person[data-chat = ${divId}]`).trigger("appChat.moveConversationToThe");

    })
})