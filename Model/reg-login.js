
const mongoose = require('mongoose');
const SchemaVariable=mongoose.Schema;

const UserSchema=new SchemaVariable({

firstName:{
	type:String,
	required:true
},
lastName:{
	type:String,
	required:true
},
email:{
    type:String,
	required:true
},
password:{
    type:String,
	required:true
},
contact:{
	type:Number,
	required:false
}

})

module.exports=mongoose.model('User',UserSchema); 