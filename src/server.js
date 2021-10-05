import express from "express";
import ConnectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine"
import initRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import configSession from "./config/session";
import passport from "passport";


//khoi tao app
let app = express();

//Connect DB
ConnectDB();

//config session
configSession(app);

//config view engine
configViewEngine(app);

//Enable post data for request
app.use(bodyParser.urlencoded({ extended: true }));

//Enable flash messages
app.use(connectFlash());

//config passport
app.use(passport.initialize());
app.use(passport.session());

//Khoi tao Routers
initRoutes(app);

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
  console.log(
    `Example app listening at ${process.env.APP_HOST}:${process.env.APP_PORT}`
  );
});


// import pem from "pem";
// import https from "https";

// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//   if (err) {
//     throw err;
//   }
//   //khoi tao app
// let app = express();

// //Connect DB
// ConnectDB();

// //config session
// configSession(app);

// //config view engine
// configViewEngine(app);

// //Enable post data for request
// app.use(bodyParser.urlencoded({ extended:true}));

// //Enable flash messages
// app.use(connectFlash());

// //config passport
// app.use(passport.initialize());
// app.use(passport.session());

// //Khoi tao Routers
// initRoutes(app);
//   https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app
//   ).listen(process.env.APP_PORT, process.env.APP_HOST, () => {
//     console.log(
//       `Example app listening at ${process.env.APP_HOST}:${process.env.APP_PORT}`
//     );
//   });
// })

