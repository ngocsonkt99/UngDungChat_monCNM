import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null },
});

ContactSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  findAllByUser(userId){
    return this.find({
      $or:[
        {"userId": userId},
        {"contactId": userId},
      ]
    }).exec();
  },

  //kiem tra ton tai cua 2 user
  checkExists(userId, contactId){
    return this.findOne({
      $or:[
        {$and:[
          {"userId": userId},
          {"contactId": contactId}
        ]},
        {$and:[
          {"userId": contactId},
          {"contactId": userId}
        ]}
      ]
    }).exec();
  },

  removeRequestContactSent(userId, contactId) {
    return this.deleteMany({
      $and:[
        {"userId": userId},
        {"contactId": contactId}
      ]
    }).exec();
  },

  getContacts(userId, limit) {
    return this.find({
      $and:[
        {$or:[
        {"userId":userId},
        {"contactId": userId}
      ]},
        {"status":true},
      ]
    }).sort({"createdAt": -1}).limit(limit).exec();
  },

  getContactsSent(userId, limit) {
    return this.find({
      $and:[
        {"userId": userId},
        {"status":false},
      ]
    }).sort({"createdAt": -1}).limit(limit).exec();
  },

  getContactsReceived(userId, limit) {
    return this.find({
      $and:[
        {"contactId": userId},
        {"status":false},
      ]
    }).sort({"createdAt": -1}).limit(limit).exec();
  },

  countAllContacts(userId) {
    return this.count({
      $and:[
        {$or:[
        {"userId":userId},
        {"contactId": userId}
      ]},
        {"status":true},
      ]
    }).exec();
  },

  countAllContactsSent(userId) {
    return this.count({
      $and:[
        {"userId": userId},
        {"status":false},
      ]
    }).exec();
  },

  countAllContactsReceived(userId) {
    return this.count({
      $and:[
        {"contactId": userId},
        {"status":false},
      ]
    }).exec();
  },

};

module.exports = mongoose.model("contact", ContactSchema);
