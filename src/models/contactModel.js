import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
  useId: String,
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
  }
};

module.exports = mongoose.model("contact", ContactSchema);
