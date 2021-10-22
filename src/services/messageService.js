import ContactModel from "../models/contactModel";
import UserModel from "../models/userModel";
import ChatGroupModel from "../models/chatGroupModel";
import MessageModel from "../models/messageModel";
import _ from "lodash";
import { transErrors } from "./../../lang/vi";
import {app} from "./../config/app";


const LIMIT_CONVERSATIONS_TAKEN = 100;
const LIMIT_MESSAGES_TAKEN = 100;

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

          //get messages to apply in screen chat
         let allConversationWithMessagesPromise = allConversations.map(async (conversation)=>{
          conversation = conversation.toObject();  
          
          if(conversation.members){
            let getMessages = await MessageModel.model.getMessagesInGroup(conversation._id, LIMIT_MESSAGES_TAKEN);           
            conversation.messages = getMessages;
          }else{
            let getMessages = await MessageModel.model.getMessagesInPersonal(currentUserId, conversation._id, LIMIT_MESSAGES_TAKEN);           
            conversation.messages = getMessages;
          }
            return conversation;
          });

          let allConversationWithMessages = await Promise.all(allConversationWithMessagesPromise);
          //sort by updateAt desending 
          allConversationWithMessages = _.sortBy(allConversationWithMessages, (item)=>{
            return -item.updatedAt;
          })
        
          resolve({ 
            allConversationWithMessages: allConversationWithMessages
          });

        } catch (error) {
            reject(error);
        }
    })
};

let addNewTextEmoji = (sender, receiverId, messageVal, isChatGroup) => {
  return new Promise(async (resolve, reject) => {
    try {
      if(isChatGroup) {
        let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
        if(!getChatGroupReceiver) {
          return reject(transErrors.conversation_not_found);
        }
        let receiver = {
          id: getChatGroupReceiver._id,
          name: getChatGroupReceiver.name,
          avatar: app.general_avatar_group_chat,
        };

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationTypes.GROUP,
          messageType: MessageModel.messageTypes.TEXT,
          sender: sender,    
          receiver: receiver, 
          text: messageVal,
          createdAt: Date.now()
          };

          // create new message 
          let newMessage = await MessageModel.model.createNew(newMessageItem);
          //update group chat message
          await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id, 
                                          getChatGroupReceiver.messageAmount + 1);
          resolve(newMessage);
      
        }else{
        let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
        if(!getUserReceiver) {
          return reject(transErrors.conversation_not_found);
        };
        let receiver = {
          id: getUserReceiver._id,
          name: getUserReceiver.username,
          avatar: getUserReceiver.avatar,
        };

        let newMessageItem = {
          senderId: sender.id,
          receiverId: receiver.id,
          conversationType: MessageModel.conversationTypes.PERSONAL,
          messageType: MessageModel.messageTypes.TEXT,
          sender: sender,    
          receiver: receiver, 
          text: messageVal,
          createdAt: Date.now()
          };

          //create new message
          let newMessage = await MessageModel.model.createNew(newMessageItem);
          resolve(newMessage);

          //update contact 
          await ContactModel.updateWhenHasNewMessage(sender.id, getUserReceiver._id);

      }
    } catch (error) {
      reject(error);
    }
  })
};

module.exports = {
    getAllConversationItems: getAllConversationItems,  
    addNewTextEmoji: addNewTextEmoji
};