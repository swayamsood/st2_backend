const bodyParser = require('body-parser')
const mysql=require('mysql')
const express = require('express')
const app=express()
const jsonParser = bodyParser.json()
const cookieParser = require('cookie-parser')
const session = require('express-session');
const flash = require('connect-flash')
const conn = mysql.createConnection({host:'localhost', user:'root', password:'', database:'st2'});
app.set('view engine','ejs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname));
app.use(cookieParser('secret'));
app.use(session({cookie: {maxAge: null}}));
app.use(flash());
app.use((req, res, next)=>{
    res.locals.message = req.session.message
    delete req.session.message
    next()
})

app.get("/", function(req,res){
    // res.sendFile(__dirname+"/Pages/LoginSignUp.html")
    res.render("LoginSignUp");
})

app.get("/SignUp",function(req,res){
    // res.sendFile(__dirname+"/Pages/SignUp.html")
    res.render("SignUp");
})

app.post("/signupform-submit",function(req,res){
    var Username = req.body.Username;
    var Password = req.body.Password;
    var Fname = req.body.Fname;
    var PhoneNumber = req.body.PhoneNo;
    var Gender = req.body.Gender;
    
    conn.connect(function(error){
        // if(error) throw error;
        console.log("Connected");
        var sql = "SELECT * FROM info1 WHERE Name = "+mysql.escape(Username);
        conn.query(sql,function(error,result){
            if(error) throw error;
            if(result.length==0){
                var sql = "INSERT INTO info1 (`Name`,`FName`,`Password`,`Gender`,`PhNo`) VALUES ('"+Username+"','"+Fname+"','"+Password+"','"+Gender+"','"+PhoneNumber+"')";
                conn.query(sql,function(error,result){
                    console.log("Username: "+Username);
                    console.log("Password: "+Password);
                    console.log("Father Name: "+Fname);
                    console.log("Phone Number: "+PhoneNumber);
                    console.log("Gender: "+Gender);
                    
                    console.log("Record Saved");
                })
                req.session.message = {
                    type : 'success',
                    intro : 'SignUp Completed! ',
                    message: 'Please Login.'
                }
                res.redirect("/");
            }
            else{
                req.session.message = {
                    type : 'danger',
                    intro : 'SignUp Unsuccessful! ',
                    message: 'Try different Username.'
                }
                res.redirect("/");
            }
        })
        
    })
})

app.get("/Login",function(req,res){
    res.render("Login");
})

app.post("/Profile", function(req, res){
    var Username = req.body.Username;
    var Password = req.body.Password;
    conn.connect(function(error){
        console.log("Connected with Login");
        var sql = "SELECT * FROM info1 WHERE Name = "+mysql.escape(Username)+" AND Password = "+mysql.escape(Password);
        conn.query(sql,function(error,result){
            if(error) throw error;
            if(result.length==0){
                req.session.message = {
                    type : 'danger',
                    intro : 'Login Unsuccessful! ',
                    message: 'Invalid Username or Password.'
                }
                res.redirect("/");
            }
            else{
                req.session.message = {
                    type : 'success',
                    intro : 'Login Successful! '
                }
                res.render("Profile",{result:result, message: req.session.message});
            }
        })
    })
})

app.get("/ChangePassword",function(req,res){
    res.render("ChangePassword");
})

app.post("/ProfileUpdated", function(req, res){
    var OldPassword = req.body.OPassword;
    var NewPassword = req.body.NPassword;
    conn.connect(function(error){
        console.log("Connected with Update");
        var sql = "UPDATE info1 SET Password = "+mysql.escape(NewPassword)+" WHERE Password = "+mysql.escape(OldPassword);
        conn.query(sql,function(error,result){
            if(error) throw error;
            console.log("Password Updated.");
            var sql = "SELECT * FROM info1 WHERE Password = "+mysql.escape(NewPassword);
            conn.query(sql,function(error,result){
                if(error) throw error;
                req.session.message = {
                    type : 'success',
                    intro : 'Password Updated Successfully! '
                }
                res.render("Profile",{result:result, message: req.session.message});
            })
        })
    })
})

app.get("/logout", function(req, res){
    req.session.message = {
        type : 'success',
        intro : 'Logout Successfully! '
    }
    res.redirect("/");
})

app.get("/admin", function(req,res){
    conn.connect(function(error){
        // if(error) throw error;
        console.log("Connected to Admin");
        var sql = "SELECT * FROM info1";
        conn.query(sql,function(error,result){
            if(error) throw error;
            res.render("Admin",{result: result});
        })
    })
})
app.listen(9000);