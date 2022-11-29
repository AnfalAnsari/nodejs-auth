const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const {mailTransporter, mailDetails } = require("../../nodemail")
//VALIDATION OF USER INPUTS PREREQUISITES
const Joi = require("@hapi/joi");

const registerSchema = Joi.object({
  first_name: Joi.string().max(255).required(),
  last_name: Joi.string().max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
  age: Joi.number().min(10).max(150).required(),
  city: Joi.string().max(255).required() 
});

//SIGNUP USER
router.post("/register", async (req, res) => {
  //CHECKING IF USER EMAIL ALREADY EXISTS
  const emailExist = await User.findOne({ email: req.body.email });
  // IF EMAIL EXIST THEN RETURN
  if (emailExist) {
    res.status(400).send({message: "Email already exists", status: 400});
    return;
  }

  //HASHING THE PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //ON PROCESS OF ADDING NEW USER

  const user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: hashedPassword,
    age: req.body.age,
    city: req.body.city
  });

  try {
    //VALIDATION OF USER INPUTS

    const { error } = await registerSchema.validateAsync(req.body);
    
    //   IF ERROR EXISTS THEN SEND BACK THE ERROR
    if (error) {
      res.status(400).send({status: 400, message: error.details[0].message});
      return;
    } else {
     
      //NEW USER IS ADDED
      const saveUser = await user.save();
      
      //GENERATING JWT
      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
      res.header("auth-token", token).status(200).send({message: "Success", jwt_token: token, status: 200});


      //SENDING MAIL THROUGH NODEMAILER
      mailDetails.to = req.body.email;
      mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) console.log(err);
        else console.log("Mail Sent Successfully");

      })

    }
  } catch (error) {
    res.status(500).send({status: 500, message: error});
  }
});

const loginSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

//LOGIN USER

router.post("/login", async (req, res) => {
  //CHECKING IF USER EMAIL EXISTS
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send({message: "Incorrect Email- ID", status: 400});

  //CHECKING IF USER PASSWORD MATCHES

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send({message: "Incorrect Password", status: 400});

  try {
    //VALIDATION OF USER INPUTS
    const { error } = await loginSchema.validateAsync(req.body);
    if (error) return res.status(400).send({message: error.details[0].message, status: 400});
    else {
      //SENDING BACK THE TOKEN
      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
      res.header("auth-token", token).status(200).send({message: "Success", status: 200, jwt_token: token});
    }
  } catch (error) {
    res.status(500).send({message: error, status: 500});
  }
});

module.exports = router;
