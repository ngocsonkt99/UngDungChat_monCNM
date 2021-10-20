import {notification, contact, message} from "./../services/index";
import {bufferToBase64, lastItemOfArray, convertTimestampToHumanTime} from "./../helpers/clientHelper";

let getHome =  async (req, res) => {
    // only 10 item 
    let notifications = await notification.getNotifications(req.user._id);
    
    //get amount notifications uread
    let countNotifUnread = await notification.countNotifUnread(req.user._id);
   
    //get contacts
    let contacts = await contact.getContacts(req.user._id);
   
    //get contacts Sent
    let contactsSent = await contact.getContactsSent(req.user._id);
    
    //get contacts Received
    let contactsReceived = await contact.getContactsReceived(req.user._id);
    
    //count contact 
    let countAllContacts = await contact.countAllContacts(req.user._id);
    let countAllContactsSent = await contact.countAllContactsSent(req.user._id);
    let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);

    let getAllConversationItems = await message.getAllConversationItems(req.user._id);
    let allConversationWithMessages = getAllConversationItems.allConversationWithMessages;
   
    return res.render("main/home/home", {
       errors: req.flash("error"),
       success: req.flash("success") ,
       user: req.user,
       notifications: notifications,
       countNotifUnread: countNotifUnread,
       contacts: contacts,
       contactsSent: contactsSent,
       contactsReceived: contactsReceived,
       countAllContacts: countAllContacts,
       countAllContactsSent: countAllContactsSent,
       countAllContactsReceived: countAllContactsReceived,
       getAllConversationItems : getAllConversationItems,
       allConversationWithMessages: allConversationWithMessages,
       bufferToBase64: bufferToBase64,
       lastItemOfArray: lastItemOfArray,
       convertTimestampToHumanTime: convertTimestampToHumanTime,
    });
  };

  module.exports = {
      getHome: getHome,
  };