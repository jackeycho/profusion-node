const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const nodemailer = require("nodemailer");
const { enable } = require("express/lib/application");
require("dotenv").config();

const app = express();

// View engine setup
// app.engine('handlebars', exphbs());
app.set("view engine", "ejs");
app.use("/public", express.static(path.join(__dirname, "public")));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/send", (req, res) => {
  // console.log(req.body)

  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "whwormsfx@outlook.com",
      pass: process.env.OUTLOOK_PW, // generated ethereal password
    },

    tls: {
      rejectUnauthorized: false,
    },
  });

  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: '"Profusion Contact" <whwormsfx@outlook.com>', // sender address
    to: "jackey@solvewithtech.com, info@profusionventures.com", // list of receivers
    subject: "Profusion Contact Request", // Subject line
    text: "Hello world?", // plain text body
    html: output, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    // res.render("index", { msg: "Email has been sent" });
  });
});

app.listen(3000, () => console.log("Server started..."));
