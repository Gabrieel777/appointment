const express = require ("express");
const app = express();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const session = require("express-session");

// - services - 
const AppointmentService = require("./services/AppointmentService");

// sessions
app.use(session({
    secret: "asaijsadhds", cookie: {maxAge: 1080000000}
}))

// - controllers - 

const homeControll = require("./home/HomeController"); 
const appoControll = require("./appointment/AppoContoller");
const usersControll = require("./users/usersController");
const backofficeControll = require("./backoffice/backofficeController");

// - icon - 

app.use("/favicon.ico", express.static("/public/img/favicon.ico"))

// - view engine - 
app.set("view engine", "ejs");

// - static -

app.use(express.static("public"));

// - config bodyParser - 
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// - config mongoose connection - 
mongoose.connect("mongodb://localhost:27017/scheduling", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useFindAndModify", false);

// - routers -

app.use("/", homeControll);

app.use("/", appoControll);

app.use("/", usersControll)

app.use("/", backofficeControll);


setInterval(async () => {
    await AppointmentService.SendNotification();
}, 5000)

app.listen(4000, () => {
    console.log("- server on -")
});