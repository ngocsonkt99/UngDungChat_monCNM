function textAndEmojiChat(divId){
    $(".emojionearea").unbind("keyup").on("keyup", function(element){
        if(element.which === 13){
            let targetId = $(`#write-chat-${divId}`).data("chat");
            let messageVal = $(`#write-chat-${divId}`).val();

            if(!targetId.length || !messageVal.length) {
                return false;
            }

            let dataTextEmojiForSend = {
                uid : targetId,
                messageVal : messageVal
            };

            if($(`#write-chat-${divId}`).hasClass("chat-in-group")){
                dataTextEmojiForSend.isChatInGroup = true;
            }
           
            $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function(data){
                //success
            }).fail(function(response){
                //err
            })
        }
    });
}