const ProductModel=require("../Model/product");

exports.postFormData = (req,res)=>{
	const pTitle=req.body.productTitle;
	const pPrice=req.body.productPrice;
	const pDesc=req.body.description;  
	const product_img=req.file;
	const pImage_url=product_img.path;
	//productImage
	if(!pTitle){
		return res.status(401).json({
			success:false,
			message:"Product title is required"
		  })
	}
	else if(!pPrice){
		return res.status(401).json({
			success:false,
			message:"Price is required"
		  })
	}
	else if(!pDesc){
		return res.status(401).json({
			success:false,
			message:"Description is required"
		  })
	}
	else if(!pImage_url)
	{
		return res.status(401).json({
			success:false,
			message:"Image is required"
		  })
	}
	else{
	const product=new ProductModel({
		prodTitle:pTitle,
		prodPrice:pPrice,
		prodDesc:pDesc,
		prodImage:pImage_url});

	    product.save().then(results=>{
		    return res.status(200).json({
				success:true,
				message:"Product added successfully",
				result:results
			   })
	    }).catch(err=>{
			return res.status(401).json({
			   success:false,
			   message:"Product adding failed"
			 })
	});
}	
}

exports.getAdminProduct = (req,res)=>{
	ProductModel.find()
	.select("_id prodTitle prodPrice prodDesc prodImage")
	.then(products=> {		
		return res.status(201).json({
			success:true,
			message:"Product fetched successfully",
			result:products
		  })
		
	}).catch(err=>{
		return res.status(401).json({
			success:false,
			message:"Product fetcheing failed "+ err,
		  })
	})
}


 exports.postEditFormData = (req,res)=>{
 	const product_id=req.params.prod_id;
 	const updatedTitle=req.body.productTitle;
 	const updatedPrice=req.body.productPrice;
 	const updatedDesc=req.body.description;
	const new_url=req.file;
	
    if(!updatedTitle){
		return res.status(401).json({
			success:false,
			message:"Product title is required"
		  })
	}
	else if(!updatedPrice){
		return res.status(401).json({
			success:false,
			message:"Price is required"
		  })
	}
	else if(!updatedDesc){
		return res.status(401).json({
			success:false,
			message:"Description is required"
		  })
	}
    else{
 	ProductModel.findById(product_id).then(productsData=>{
		console.log(productsData);
 		productsData.prodTitle=updatedTitle;
 		productsData.prodPrice=updatedPrice;
 		productsData.prodDesc=updatedDesc;
		if(new_url===undefined)
		{
			productsData.prodImage=productsData.prodImage
		}
		else
		{
			productsData.prodImage=new_url.path;
		}
 		
 	 productsData.save().then(results=>{
		return res.status(200).json({
			success:true,
			message:"Product updated successfully",
			result:results
		  })
 	})
 	.catch(err=>{
		return res.status(401).json({
			success:false,
			message:"Product updation failed",
		  })
 	 })
	})
 }
}


 exports.deleteProductAdmin = (req,res)=>{
 	const product_id=req.params.prodid; 
	ProductModel.deleteOne({_id:product_id})
	.then(result=>{
		return res.status(200).json({
			success:true,
			message:"Product deleted successfully"
		  })
	}).catch(err=>{
		return res.status(401).json({
			success:false,
			message:"Product deletion failed",
		  })
 	 })

 }