import {check} from "express-validator/check";
import {transValidation} from "../../lang/vi";


let addNewGroup  = [
    check("arrayIds",transValidation.add_new_group_users_incorrect)
       .custom((value)=>{
        if(!Array.isArray(value)){
            return false;
        }
        if (value.length < 2 ){
            return false;
        }
        return true;
       }),

    check("groupChatName",transValidation.add_new_group_name_incorrect)
        .isLength({min: 3, max:30 })
 ];

module.exports = {
    addNewGroup: addNewGroup,
}