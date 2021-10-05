import UserModel from "../models/UserModel";
import bcrypt from "bcrypt";
import uuidv4 from "uuid/v4";
import { transErrors, transSuccess, transMail } from "./../../lang/vi";
import sendMail from "./../config/mailer";

// băm mật khẩu ra 7 kí tự
let saltRounds = 7;

let register = (email, gender, password, protocol, host) => {
    return new Promise(async (resolve, reject) => {

        let userByEmail = await UserModel.findByEmail(email);
        if (userByEmail) {
            return reject(transErrors.account_in_use);
        }

        let salt = bcrypt.genSaltSync(saltRounds);

        let userItem = {
            username: email.split("@")[0],
            gender: gender,
            local: {
                email: email,
                password: bcrypt.hashSync(password, salt),
                verifyToken: uuidv4(),// duy nhất
            }
        };

        let user = await UserModel.createNew(userItem);
        let linkVerity = `${protocol}://${host}/verify/${user.local.verifyToken}`;

        //send mailer
        sendMail(email, transMail.subject, transMail.template(linkVerity))
            .then(success => {
                resolve(transSuccess.userCreated(user.local.email));
            })
            .catch(async (error) => {
                //remove user 
                await UserModel.removeById(user._id);
                console.log(error);
                reject(transMail.send_failed);
            })

        resolve(transSuccess.userCreated(user.local.email));

    })

};

let verifyAccount = (token) => {
    return new Promise(async (resolve, reject) => {
        let userByToken = await UserModel.findByToken(token);
        if (!userByToken) {
            return reject(transErrors.token_undefined);
        }
        await UserModel.verify(token);
        resolve(transSuccess.account_actived);
    });
}

module.exports = {
    register: register,
    verifyAccount: verifyAccount,
};