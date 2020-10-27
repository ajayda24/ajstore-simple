require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(session({
    secret: "Upload your App.",
    resave:false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://ajayda24:yaja110125@cluster0.l53kc.mongodb.net/ajstoreDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
});



const userAppsSchema = new mongoose.Schema({
    name: String,
    developer: String,
    download: String,
    description: String,
    size: String,
    logo: String
});

// const adminSchema = new mongoose.Schema({
//     email: String,
//     password: String,
//     googleId: String,
// });

// adminSchema.plugin(passportLocalMongoose);
// adminSchema.plugin(findOrCreate);



userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);




const User = mongoose.model("User", userSchema);

const UserApps = mongoose.model("UserApps", userAppsSchema);

// const Admin = mongoose.model("Admin", adminSchema);

// passport.use(User.createStrategy());
//--------------------------------------------------------


// passport.use(Admin.createStrategy());


//   ---------------------------------------------------
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


//   passport.serializeUser(function(admin, done) {
//     done(null, admin.id);
//   });
  
//   passport.deserializeUser(function(id, done) {
//     Admin.findById(id, function(err, admin) {
//       done(err, admin);
//     });
//   });
//-------------------------------------------------------------------------




passport.use('user', new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          return done(null, user);
        });
      }
  ));
  
//   passport.use('admin', new LocalStrategy(
//     function(username, password, done) {
//         Admin.findOne({ username: username }, function (err, user) {
//           if (err) { return done(err); }
//           if (!user) { return done(null, false); }
//           return done(null, user);
//         });
//       }
//   ));



  const ajAppsSchema = new mongoose.Schema({
    name: String,
    developer: String,
    logo: String,
    download: String,
    video: String,
    ready: String,
    d1: String,
    d2: String,
    d3: String,
    d4: String,
    size: String
  });

  
  const Ajapp = mongoose.model("Ajapp", ajAppsSchema);
  
  app.get("/", function(req, res){
  
    Ajapp.find({}, function(err, ajapps){
      res.render("home", {ajapps: ajapps});
    });
  });

  app.get("/apps/:ajappId", function(req, res){

    const requestedAppId = req.params.ajappId;
    
    Ajapp.findOne({_id: requestedAppId}, function(err, ajapps){
        res.render("applications", {
            name: ajapps.name,
            developer: ajapps.developer,
            download: ajapps.download,
            video: ajapps.video,
            ready: ajapps.ready,
            d1: ajapps.d1,
            d2: ajapps.d2,
            d3: ajapps.d3,
            d4: ajapps.d4,
            size: ajapps.size,
            logo: ajapps.logo,
        });
      });
    
  });

// ---------------------------------------------------------------------
// ---------------------------------------------------------------------

// app.get("/login", function(req,res){
//     res.render("login")
// });

// app.get("/register", function(req,res){
//     res.render("register")
// });

// app.get("/secrets", function(req,res){
//     if (req.isAuthenticated()){
//         User.find({"secret": {$ne: null}}, function(err, foundUsers){
//             if(err){
//                 console.log(err);
//             } else {
//                 if(foundUsers){
        
//                     res.render("secrets", {usersWithSecrets: foundUsers});
//                 }
//             }
//             });
//     } else {
//         res.redirect("/login");
//     }
    
// });

// app.get("/appsuccessfull", function(req,res){
//     res.render("userAppRegistration");
// })

// app.get("/submit", function(req,res){
//     if (req.isAuthenticated()){
//         res.render("submit");
//     } else {
//         res.redirect("/login");
//     }
// });

// app.post("/submit", function(req,res){
//     const name = req.body.name;
//     const developer = req.body.developer;
//     const logo = req.body.logo;
//     const download = req.body.download;
//     const description = req.body.description;
//     const size = req.body.size;

//     console.log(req.user.id);

//     User.findById(req.user.id, function(err, foundUser){
//         if(err){
//             console.log(err);
//         } else {
//             if(foundUser){
//                 const newApp = new Ajapp({
//                     name : name,
//                     developer : developer,
//                     logo : logo,
//                     download : download,
//                     description : description,
//                     size : size
//                 });
//                 newApp.save(function(){
//                     res.redirect("/appsuccessfull");
//                 });
//             }
//         }
//     });
// });

// app.get("/logout", function(req,res){
//     req.logout();
//     res.redirect("/");
// });

// app.post("/register", function(req,res){

//      User.register({username: req.body.username}, req.body.password, function(err, user){
//          if(err){
//              console.log(err);
//              res.redirect("/register");
//          } else {
//              passport.authenticate("local")(req,res, function(){
//                  res.redirect("/secrets");
//              });
//          }
//      }); 

// });

// app.get("/loginerror", function(req,res){
//     res.render("loginerror")
// })

// app.post('/login',
//   passport.authenticate('user', { successRedirect: '/secrets',failureRedirect: '/loginerror' })
// );

//---------------------------------------------------------------------------------------------
//Admin
//-------------------------------------------------------------

// app.get("/adminlogin", function(req,res){
//     res.render("admin-login")
// });

// app.get("/adminregister", function(req,res){
//     res.render("admin-register")
// });

// app.get("/admin", function(req,res){
//     // if (req.isAuthenticated()){
        
//         res.render("admin");
                 
             
//     // } else {
//     //     res.redirect("/adminlogin");
//     // }
    
// });

// app.get("/adminupload", function(req,res){
//     if (req.isAuthenticated()){

//     res.render("admin-upload")

//     } else {
//     res.redirect("/adminlogin");
//     }
// })

// app.get("/adminsubmit", function(req,res){
//     if (req.isAuthenticated()){
//         res.render("admin-submit");
//     } else {
//         res.redirect("/adminlogin");
//     }
// });

// app.post("/adminsubmit", function(req,res){
//     const name = req.body.name;
//     const developer = req.body.developer;
//     const logo = req.body.logo;
//     const download = req.body.download;
//     const description = req.body.description;
//     const size = req.body.size;

//     // console.log(req.user.id);

//     User.findById(req.user.id, function(err, foundUser){
//         if(err){
//             console.log(err);
//         } else {
//             if(foundUser){
//                 const newApp = new Ajapp({
//                     name : name,
//                     developer : developer,
//                     logo : logo,
//                     download : download,
//                     description : description,
//                     size : size
//                 });
//                 newApp.save(function(){
//                     res.redirect("/appsuccessfull");
//                 });
//             }
//         }
//     });
// });

// app.get("/adminlogout", function(req,res){
//     req.logout();
//     res.redirect("/");
// });

// app.post("/adminregister", function(req,res){

//      Admin.register({username: req.body.username}, req.body.password, function(err, admin){
//          if(err){
//              console.log(err);
//          } else {
//              passport.authenticate("local")(req,res, function(){
//                  res.redirect("/admin");
//              });
//          }
//      }); 

// });

// app.post('/adminlogin',
//   passport.authenticate('admin', { successRedirect: '/admin',failureRedirect: '/loginerror' })
// );





















































let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port, function() {
    console.log("Server has started successfully");
  });