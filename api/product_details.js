const express = require('express');
const router= express.Router()

var db= require('../models/db');
var Product= require('../models/product.model');
var Category = require('../models/category.model');
var User = require('../models/user.model');

//getting the product details

router.get('/:id',function(req,res){
    product_id= req.params.id;
    
    try{
    Product.findById({"_id":product_id,"status":1},async function(err,data){
        var category = data.categories;
        
        var categories = new Category();
        var category_data= [];
        await Category.find({"_id":category},function(err,data){
            
            category_data.push(data);
            });
        
        var shop =data.shop_id;
        var shops = new User();
        var shop_data = [];
        await User.find({"_id":shop,"shopkeeper":1},function(err,data){
            shop_data.push(data);
        });

        console.log(shop_data);





        
        if(err){
            response= {"error":true,"message":data}
        }else{
            response={"error":false,"message":data,"category_list":category_data,"shop_details":shop_data}
        }
        res.json(response);
        
      
    });
        }catch(error){
            errorResult(res,error);
            }
        });


module.exports= router;