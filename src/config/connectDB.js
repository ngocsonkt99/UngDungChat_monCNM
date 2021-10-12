import mongoose from "mongoose";
import bluebird from "bluebird"; //thư viện hỗ trợ cho viết Promise 

/* Connect to MongoDB*/
let connectDB = () => {
  mongoose.Promise = bluebird;

  //mongodb://localhost:27017/chat
  let URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  return mongoose.connect(URI,{useMongoClient:true});
};

module.exports = connectDB;
