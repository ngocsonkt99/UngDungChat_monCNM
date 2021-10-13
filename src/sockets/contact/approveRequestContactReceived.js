import { pushSocketIdToArray, emitNotifyToArray, removeSocketIdFromArray } from "./../../helpers/socketHelper";

let approveRequestContactReceived = (io) => {
    let clients = {};
    io.on("connection", (socket) => {

        clients = pushSocketIdToArray(clients, socket.request.user._id, socket.id);

        socket.on("approve-request-contact-received", (data) => {
            let currentUser = {
                id: socket.request.user._id,
                username: socket.request.user.username,
                avatar: socket.request.user.avatar,
                address: (socket.request.user.address !==null) ? socket.request.user.address:"",
            };

            //emit notification
            if (clients[data.contactId]) {
                emitNotifyToArray(clients, data.contactId, io, "response-approve-request-contact-received", currentUser);
            }

        });

        socket.on("disconnect", () => {
            clients = removeSocketIdFromArray(clients, socket.request.user._id, socket);
        });
    });
};

module.exports = approveRequestContactReceived;