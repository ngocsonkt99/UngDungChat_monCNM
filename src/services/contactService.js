import ContactModel from "./../models/ContactModel";
import UserModel from "./../models/userModel";
import _ from "lodash";

let findUsersContact = (currentUserId, keyword) => {
  return new Promise(async (resolve, reject) => {
    let deprecateUserIds = [];
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

module.exports = {
    findUsersContact: findUsersContact
};