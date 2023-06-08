// const Auth_check=require('../middle-ware/isAuth');
const express= require('express');
const adminRouter =express.Router();
const adminController=require('../Controller/adminController');


adminRouter.post('/add-data',adminController.postFormData);

adminRouter.get('/display-data',adminController.getAdminProduct);

adminRouter.put('/edit-data/:prod_id',adminController.postEditFormData);

adminRouter.delete('/delete-data/:prodid',adminController.deleteProductAdmin);

module.exports=adminRouter;
