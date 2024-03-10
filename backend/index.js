const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const validator = require("validator");

const app = express();
const port = 7001;

app.use(cors("*" /* origin */));
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "keshanna9618@gmail.com",
    pass: "zovd tnlx huwv jlxb",
  },
});

const savedOTPS = {};

app.post("/sendotp", (req, res) => {
  const email = req.body.email;

  if (!validator.isEmail(email)) {
    return res.status(400).send("Invalid email address");
  }

  const digits = "0123456789";
  const limit = 4;
  let otp = "";
  for (let i = 0; i < limit; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }

  const options = {
    from: "keshanna9618@gmail.com",
    to: email,
    subject: "Testing node emails",
    html: `<p>Enter the otp: ${otp} to verify your email address</p>`,
  };

  transporter.sendMail(options, function (error, info) {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Couldn't send OTP");
    } else {
      savedOTPS[email] = otp;
      setTimeout(() => {
        delete savedOTPS[email];
      }, 60000);
      res.send("Sent OTP successfully");
    }
  });
});

app.post("/verify", (req, res) => {
  const otpReceived = req.body.otp;
  const email = req.body.email;
  if (savedOTPS[email] === otpReceived) {
    res.send("Verified");
  } else {
    res.status(500).send("Invalid OTP");
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
