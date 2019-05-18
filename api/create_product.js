const express = require('express');
const router = express.Router();
var Product = require('../models/product.model');
var db = require('../models/db');
const path= require('path');
const multer = require('multer');
const sharp = require('sharp');



//Creating the Storage engine

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/product_images/')
    },
    filename: function(req,file,cb){
        
        cb(null,file.fieldname+'-'+Date.now()+"-"+
         file.originalname);
    }
});

//Init Upload
const upload=multer({
    storage: storage,
    limits:{fileSize:2000000},
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
});

// //Check File Type
function checkFileType(file,cb){
    // const filetypes ='/jpeg|jpg|png|gif';
    // const extname =filetypes.test(path.extname(file.originalname).toLowerCase());
    // const mimetype = filetypes.test(file.mimetype);

    // if(mimetype && extname){
    //     return cb(null,true);
    // }else{
    //     cb('Error:Image Only!');
    // }
    if(file.mimetype ==='image/jpeg' || file.mimetype==='image/png' || file.mimetype==='image/gif' ||file.mimetype ==='image/jpg'){
        cb(null,true);

        }else
        {
            cb(null,false); //rejects storing a file
        }
    }


//creating the product
router.post('/',upload.array('productImages',3),function(req,res,next){
    console.log(req.files);
    
    const prod = new Product({
        name: req.body.name,
        specs: {
        
        description: req.body.description,
        price: req.body.price,
        gender: req.body.gender,
        size: [{
            size_value : req.body.size_value,
       
        color_details : [{
            color_value : req.body.color_value,
            quantity : req.body.quantity
        }],
        }],
           tags: req.body.tags,
        },
        // productImages: req.file.path,
        
        brand: req.body.brand,

       rating:{
        values: req.body.values
    },
        // rating: req.body.rating,
        
        // values:req.body.values,
        
        review : [{

        user_id:req.body.user_id,
            
            comment_details:{

                comment: req.body.comment,
                likes: req.body.likes,
            },  
            }],
        
        categories: req.body.categories,
        created_date : req.body.create_date,
        updated_date : req.body.updated_date
    });

    prod.save()
    .then(doc=>{
        console.log(JSON.stringify(doc,null,4));
    })
    .catch(err=>{
        console.error(err);
    })
});


router.put('/:id',function(req,res,next){
    product_id= req.params.id;
    Product.findOneAndUpdate({'_id':product_id},{
        $set:{
        name:req.body.name,
        specs: req.body.specs,
        description:req.body.description,
        price: req.body.price,
        size: req.body.size_value,
        color_details: req.body.color_details,
        color: req.body.color_value,
        quantity : req.body.quantity,
        tags:req.body.tags,

        brand: req.body.brand,
        rating:req.body.rating,
        user_id: req.body.user_id,
        values: req.body.comment,
        likes:req.body.likes,
        categories:req.body.categories,
        updated_date:req.body.updated_date
        }
    },function(err,data){
        if(err){
            response={"error":true,"message":data}
        }else{
            response={"error":false,"message":data}
        }
        res.json(response);
    });
    
});

// router.post('/uploadimage',upload.array('image',3),(req,res)=>{
//     console.log(req.files);
//     res.json({'msg':'File uploaded successfully!',
//         'file':req.files});
//     });
    

//     console.log('req.myImage');
//     upload(req,res,(err)=>{
//         if(err){
//             response={"error":true,"message":"Image uplaoded failed"}
//         }else{
//             response={"error":false,"message":req.file.filename}
//             console.log(response);
//         }
//         res.json(response);
//     });
 


module.exports = router;