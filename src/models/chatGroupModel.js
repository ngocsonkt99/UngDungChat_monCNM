import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ChatGroupSchema = new Schema({
  name: String,
  userAmount: { type: Number, min: 3, max: 100 },
  messageAmount: { type: Number, default: 0 },
  userId: String,
  members: [{ userId: String }],
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
  deletedAt: { type: Number, default: null },
});

ChatGroupSchema.statics = {
  getChatGroups(userId, limit){
    return this.find({
      "members": {$elemMatch: {"userId": userId}}
    }).sort({"updateAt":-1}).limit(limit).exec();
  },
  
  getChatGroupById(id){
    return this.findById(id).exec();
  },

  updateWhenHasNewMessage(id, newMessageAmount){
    return this.findByIdAndUpdate(id, {
      "messageAmount": newMessageAmount,
      "updatedAt": Date.now()
    }).exec();
  },

  getChatGroupIdsByUser(userId){
    return this.find({
      "members": {$elemMatch: {"userId": userId}}
    }, {_id: 1}).exec();
  }
};

module.exports = mongoose.model("chat-group", ChatGroupSchema);
