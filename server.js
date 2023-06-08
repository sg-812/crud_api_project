
require('dotenv').config();
const mongoose= require('mongoose');
const express = require('express');
const appServer = express();

const cors =require('cors'); 

const session=require('express-session');
const mongodb_session=require('connect-mongodb-session')(session);

const multer=require('multer');

const UserModel= require("./Model/reg-login");

const adminRouting = require('./Router/adminRoute');
const authRouting= require('./Router/authRoute');

const path = require('path');

appServer.use(express.urlencoded({extended:true}))
appServer.use(express.json())

const storeValue=new mongodb_session({
	uri:'mongodb+srv://soumi123:soumi123@cluster0.880zndc.mongodb.net/ApiProject',
	collection:'user-session'
})
appServer.use(session({secret:'secret-key', resave:false, saveUninitialized:false, store:storeValue}))

appServer.use('/Uploaded_images',express.static(path.join(__dirname,'Uploaded_images')))
const fileStorage=multer.diskStorage({
	destination:(req,file,callback)=>{
		callback(null,'') //callback(error,result )
	},
	filename:(req,file,callback)=>{
		callback(null,file.originalname)
	}
});
const fileFilter=(req,file,callback)=>{
	if(file.mimetype.includes("png") || file.mimetype.includes("jpg") || file.mimetype.includes("jpeg") )
	{
		callback(null,true)
	}
	else
	{
		callback(null,false)
	}
}
appServer.use(multer({storage:fileStorage,fileFilter:fileFilter,limits:{fieldSize:1024*1024*5}}).single('productImage'));


//cors
appServer.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

    next();
});
appServer.use(cors());

appServer.use((req,res,next) => {
	if(!req.session.user) 
	{
	   return next();
	}
	UserModel.findById(req.session.user._id)
	.then(userValue=>{
		req.user = userValue;
		console.log('app' + req.user)
		next();
	}).catch(err=> console.log(err));
});


appServer.use((req,res,next)=>{
	res.locals.isAuthenticated=req.session.isLoggedIn;
	next();
})

appServer.use(adminRouting);
appServer.use(authRouting);


appServer.use((req,res)=>{
    res.send('<h1>PAGE  NOT FOUND!! Please recheck.</h1>')
})

mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser:true,useUnifiedTopology:true})
.then(result=>{

    appServer.listen(process.env.PORT|| 1000,()=>{
	console.log("Server is running at localhost:1000");
	
    });
  }).catch(err=>{
	console.log(err);
})




