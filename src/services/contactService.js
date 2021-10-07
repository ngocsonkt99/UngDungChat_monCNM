import ContactModel from "./../models/ContactModel";
import UserModel from "./../models/userModel";
import NotificationModel from "./../models/notificationModel";
import _ from "lodash";

let findUsersContact = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let deprecateUserIds = [currentUserId];
    let contactsByUser = await ContactModel.findAllByUser(currentUserId);
    contactsByUser.forEach((contact) => {
        deprecateUserIds.push(contact.userId);
        deprecateUserIds.push(contact.contactId);
    });

      deprecateUserIds = _.uniqBy(deprecateUserIds);
      let users = await UserModel.findAllForContact(currentUserId, keyword);
      resolve(users);
});

}

let addNew = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
    let contactExists = await ContactModel.checkExists(currentUserId, contactId);
    if(contactExists) {
      return reject(false);
    }
    //create contact
    let newContactItem ={
      userId: currentUserId,
      contactId: contactId,
    };
    let newContact = await ContactModel.createNew(newContactItem);
    
    //create notification
    let notificationItem = {
      senderId: currentUserId,
      receiverId:contactId, 
      type: NotificationModel.types.ADD_CONTACT,
    };
    await NotificationModel.model.createNew(notificationItem);

    resolve(newContact);
    
  });

}

let removeRequestContact = (currentUserId, contactId) => {
  return new Promise(async (resolve, reject) => {
   let removeReq = await ContactModel.removeRequestContact(currentUserId, contactId);
   if( removeReq.result === 0 ) {
     return reject(false);
   }
   //remove notification
   let notifTypeAddContact = NotificationModel.types.ADD_CONTACT;
   await NotificationModel.model.removeRequestContactNotification(currentUserId, contactId, notifTypeAddContact);
   
   resolve(true);
  
  });

}


module.exports = {
    findUsersContact: findUsersContact,
    addNew: addNew,
    removeRequestContact: removeRequestContact,
};