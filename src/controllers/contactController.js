import {contact} from "./../services/index";
import { validationResult } from "express-validator/check";

let findUsersContact = async(req, res) => {
    let errorArr = [];
    let validationErrors = validationResult(req);
  
    if (!validationErrors.isEmpty()) {
      let errors = Object.values(validationErrors.mapped());
      errors.forEach((item) => {
        errorArr.push(item.msg);
      });
      
      req.flash("errors", errorArr);
      return res.status(500).send(errorArr);
    }

    try {
        let currentUserId = req.user._id;
        let keyword = req.params.keyword;
       
        let users = await contact.findUsersContact(currentUserId, keyword);
        return res.render("main/contact/sections/_findUsersContact", {users});
    } catch (error) {
        return res.status(500).send(error);
    }
}

module.exports = {
    findUsersContact: findUsersContact
}