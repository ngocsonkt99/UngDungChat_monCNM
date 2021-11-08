import _ from "lodash";
import ChatGroupModel from "./../models/ChatGroupModel";

let addNewGroup = (currentUserId, arrayMemberIds, groupChatName) => {
    return new Promise(async(resolve, reject) => {
        try {
            //add current userId to array member
            arrayMemberIds.unshift({userId: `${currentUserId}`});
            arrayMemberIds = _.uniqBy(arrayMemberIds, "userId");

            let newGroupItem = {
                name: groupChatName,
                userAmount: arrayMemberIds.length,
                userId: `${currentUserId}`,
                members: arrayMemberIds,
                
              };
              
              let newGroup = await ChatGroupModel.createNew(newGroupItem);
              resolve(newGroup);
        } catch (error) {
            reject(error);
        }
    })
};

module.exports = {
    addNewGroup: addNewGroup,
}