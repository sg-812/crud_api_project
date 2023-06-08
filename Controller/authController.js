
const RegLoginModel=require("../Model/reg-login");
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken'); // token step 1

exports.postUserData = (req,res)=>{
	const fName=req.body.first_name;
  const lName=req.body.last_name;
	const uEmail=req.body.email;
	const uPwd=req.body.password;
  const ph=req.body.phone;

  if(!fName){
    return res.status(401).json({
      success:false,
      message:"First Name is required"
    })
  }
  else if(!lName){
    return res.status(401).json({
      success:false,
      message:"Last Name is required"
    })
  }
  else if(!uEmail){
    return res.status(401).json({
      success:false,
      message:"Email is required"
    })
  }
  else if(!uPwd){
    return res.status(401).json({
      success:false,
      message:"Password is required"
    })
  }
  else
  { 
	  RegLoginModel.findOne({email:uEmail})
    .then(userValue=>{
			 if(userValue)
      {
			      return res.status(401).json({
              success:false,
              message:"Email already exist"
            })
		  }
		  return bcrypt.hash(uPwd,12)
		    .then(hashPassword=>{
			    const userData=new RegLoginModel({
              firstName:fName,
              lastName:lName,
              email:uEmail,
              password:hashPassword,
              contact:ph})
			    return userData.save()
		      }).then(results=>{
               return res.status(200).json({
                  success:true,
                  message:"You have done registration successfully",
                  result:results
                 })

	          }).catch(err=>{
                   return res.status(401).json({
                      success:false,
                      message:"Registration failed"
                   })
	           })
	  }).catch(err=>{
      return res.status(401).json({
        success:false,
        message:"Error to register your data"
      })	
	    })
  }
}


exports.postLogin=(req,res,next)=>{
	const email=req.body.email;
	const password=req.body.password;
	
  if(!email)
  {
      return res.status(401).json({
         success:false,
          message:"Email is required"
      })
  }
  else if(!password)
  {
      return res.status(401).json({
        success:false,
        message:"Password is required"
      })
  }
 else
 { 
	  RegLoginModel.findOne({email:email})
	  .then(userValue => {
          if(!userValue) 
          {
             return res.status(401).json({
               success:false,
               message:"Invalid Email "
             })
          }
          bcrypt.compare(password,userValue.password)
          .then(result=>{
              if(!result)
              {
                  return res.status(401).json({
                     success:false,
                     message:"Invalid Password"
                  })
              }
               console.log(result);
               req.session.data=userValue;
               req.session.save((err)=>{
                    if(err)
                    {
                        return res.status(401).json({
                           success:false,
                           message:"Error to Login"
                        })
                    }
                    else
                    {
                         const token_jwt=jwt.sign({email:userValue.email},"ABCDE",{expiresIn:'1h'}); // token step 2
                         return res.status(201).json({
                              success:true,
                              message:"Login successful",
                              result:userValue,
                              token:token_jwt        // token step 3
                         })
                    }
              })
        }).catch(err=>{
               return res.status(401).json({
                     success:false,
                      message:err
               })
        })
   }).catch(err=>{
         return res.status(500).json({
             success:false,
             message:"Internal server error"
          })
    })
}
} 




