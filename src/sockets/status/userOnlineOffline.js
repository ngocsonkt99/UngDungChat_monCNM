import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from "../../helpers/socketHelper";

let userOnlineOffline = (io) => {
    let clients = {};
    io.on("connection", (socket) => {

        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

        socket.request.user.chatGroupIds.forEach(group => {
            clients = pushSocketIdToArray(clients, group._id, socket.id);
        });

        socket.on("new-group-created", (data) => {
            clients = pushSocketIdToArray(clients,data.groupChatId, socket.id);
        });
        socket.on("member-received-group-chat", (data) =>{
            clients = pushSocketIdToArray(clients,data.groupChatId, socket.id);        
        });

        socket.on("check-status",() =>{
            let listUsersOnline = Object.keys(clients);

            //Emit to user 
     
            socket.emit("server-send-list-users-online",listUsersOnline );
     
            //
            socket.broadcast.emit("server-send-when-new-user-online", socket.request.user._id);
        });
        socket.on("disconnect", () => {
            clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
            socket.request.user.chatGroupIds.forEach(group => {
                clients = removeSocketIdFromArray(clients, group._id, socket);
            });
            //step 3:
            socket.broadcast.emit("server-send-when-new-user-offline", socket.request.user._id);

        });
    });
};

module.exports = userOnlineOffline;