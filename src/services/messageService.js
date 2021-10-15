import ContactModel from "../models/contactModel";
import UserModel from "../models/userModel";
import ChatGroupModel from "../models/chatGroupModel";
import _ from "lodash";


const LIMIT_CONVERSATIONS_TAKEN = 100;

let getAllConversationItems = (currentUserId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let contacts = await ContactModel.getContacts(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
            let userConversationsPromise = contacts.map(async(contact) => {
              if(contact.contactId == currentUserId) {
                let getUserContact = await UserModel.findUserById(contact.userId);
                getUserContact.updatedAt = contact.updatedAt;
                return getUserContact;
              }else {
                let getUserContact = await UserModel.findUserById(contact.contactId);
                getUserContact.updatedAt = contact.updatedAt;
                return getUserContact;
              }
          });
          let userConversations = await Promise.all(userConversationsPromise);          
          let groupConversations = await ChatGroupModel.getChatGroups(currentUserId, LIMIT_CONVERSATIONS_TAKEN);
          let allConversations = userConversations.concat(groupConversations);
          allConversations = _.sortBy(allConversations, (item)=>{
            return -item.updatedAt;
          })
          resolve({ 
            userConversations: userConversations,
            groupConversations: groupConversations,
            allConversations : allConversations,
          });

        } catch (error) {
            reject(error);
        }
    })
};

module.exports = {
    getAllConversationItems: getAllConversationItems,  
};