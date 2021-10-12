import NotificationModel from "./../models/notificationModel";
import UserModel from "./../models/userModel";

const LIMIT_NUMBER_TAKEN = 100;

let getNotifications = (currentUserId ) => {
    return new Promise(async(resolve, reject) => {
        try {
            let notifications = await NotificationModel.model.getByUserIdAndLimit(currentUserId, LIMIT_NUMBER_TAKEN);
            
            let getNotifContent = notifications.map(async(notification) => {
                let sender = await UserModel.findUserById(notification.senderId);
                return NotificationModel.contents.getContent(notification.type, notification.isRead,sender._id,sender.username, sender.avatar);
            });

               resolve (await Promise.all(getNotifContent));

        } catch (error) {
            reject(error);
        }
    })

};

//
let countNotifUnread = (currentUserId) => {
    return new Promise(async(resolve, reject) => {
        try {
          let notificationsUnread = await NotificationModel.model.countNotifUnread(currentUserId);
         resolve(notificationsUnread);
        } catch (error) {
            reject(error);
        }
    })

};


let markAllAsRead = (currentUserId, targetUsers) => {
    return new Promise(async(resolve, reject) => {
        try {
            await NotificationModel.model.markAllAsRead(currentUserId, targetUsers);
            resolve(true);

        } catch (error) {
            console.log(`Error when mark notification as read: ${error}`)
            reject(error);
        }
    })

};

module.exports = {
    getNotifications: getNotifications,
    countNotifUnread: countNotifUnread,
    // readMore: readMore,
    markAllAsRead: markAllAsRead,
}