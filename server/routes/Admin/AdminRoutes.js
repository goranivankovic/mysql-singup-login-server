





const {checkSuperAdminPassword} =require('../../middlewares/Admin/checkSuperAdminPassword')
const {superValidate}=require('../../middlewares/ValidateSuperAdmin/superValidate') 





const {checkAdminCookie} =require('../../middlewares/Admin/checkAdminCookie')




const { connection } = require('../../model/Model');

const express = require('express')
const router = express.Router()

var jwt = require('jsonwebtoken');





                                                    //Super Admin




//Admin singup Create Admin--------------------------------------------------------------------------------------------------------
router.post(`${process.env.ADMIN_ROUTES}/singup` , checkSuperAdminPassword ,superValidate,async (req,res)=>{
const {name,lastName,password,role} =req.body;

try{


    const token= jwt.sign({data:[name,lastName,password,role]},process.env.SECRET,{ expiresIn: 60 * 60 })

connection.query(`INSERT INTO admin(name,lastName,password,role) values('${name}','${lastName}','${password}','${role}')`, (err,results,fields)=>{
    if (err) {
    return  res.json({msg:err.sqlMessage});
        
    }

  return  res.cookie('admin',token,{ httpOnly:true  ,maxAge:700000}).json({user:results}).status(200)

})

}catch(err){
    console.log(err);
}


})




//Admin login Page--------------------------------------------------------------------------------------------------------------
router.post(`${process.env.ADMIN_ROUTES}/login`,checkSuperAdminPassword ,async (req,res)=>{
    const {name,password}=req.body

  
  
try{

    
connection.query(`SELECT * FROM admin WHERE name ='${name}' AND  password ='${password}'`, (err,results,fields)=>{

  
   
   
    if (err) {

        return  res.json({msg:err.sqlMessage});

    }
    else if(results.length===0){

       return res.json({msg:[false,"Not loged in"]})
    }
    else if(results[0].role != "super"){

        const token= jwt.sign({data:[true,results[0].name, results[0].lastName, results[0].role ]},process.env.SECRET,{ expiresIn: 60 * 60 })

        

        return res.cookie('admin',token,{ httpOnly:true  ,maxAge:700000 }).json({msg:[true,"You are loged in admin ",results[0].role]})

    }
    else{
    const token= jwt.sign({data:[true,results[0].name, results[0].lastName,results[0].role,results[0].password, ]},process.env.SECRET,{ expiresIn: '1h' })


      return  res.cookie('admin',token,{ httpOnly:true  , maxAge:9000000  }).cookie('superAdmin',token,{ httpOnly:true  ,maxAge:9000000 }).json({msg:[true,"You are loged in Super Admin",results[0].role]})
    }

})

}catch(err){
    console.log(err);

}

})


//Update admin----------------------------------------------------------------------------------------------------------------------

router.post(`${process.env.ADMIN_ROUTES}/update`, checkSuperAdminPassword , superValidate , async(req,res)=>{
    const {name,lastName,password,role}=req.body;
    try{
        connection.query(`UPDATE admin SET name='${name}',lastName='${lastName}',password='${password}',role='${role}' WHERE name='${name}'`,(err,results,fields)=>{
         
             if (err) {
                throw err
                
             }else if(results.affectedRows<1){
              return  res.json({msg:"Admin user not updated"}).status(200)

             }

             return  res.json({msg:"Admin user updated"}).status(200)


        })

    }catch(error){
        console.log(error);

    }
})


//Delete Admin-----------------------------------------------------------------------------------------------------------------------


router.delete(`${process.env.ADMIN_ROUTES}/delete`, superValidate , async(req,res)=>{
    const {name}=req.body


    try{

        
    connection.query(`DELETE FROM admin WHERE name='${name}'`,(err,results,fields)=>{
        if (err) {
            return  res.json({msg:err.sqlMessage});
            
        }else if(results.affectedRows<1){

            return res.json({msg:results})

        }


     return   res.json({msg:'User is been deleted'})

    })



    }catch(eror){
        console.log(eror);

    }

})


//---------------------------------------------------------------------------------------------------------------------------------




//----------------------------------------------------------------------------------------------------------

//Get admin cookie
router.get(`${process.env.ADMIN_ROUTES}/login/cookie`,async (req,res)=>{
    const token =req.cookies['admin'];

try{
    if (!token) {

    return    res.json({msg:[false,"Restricted area"]})
        
    }

    


jwt.verify(token, process.env.SECRET, function(err, decoded) {

    if (err) {
       return res.json({msg:[false,"Admin not loged in"]})
        
    }

        return res.json({msg:[true,"You are loged in Super admin ",decoded.data[1],decoded.data[2],decoded.data[3],decoded.data[4]]})

   
   
  });





}catch(eror){
    console.log(eror);

}


})



//Clear Admin Super Cookie



    //Clear  Super Admin Cookie
    router.get(`${process.env.ADMIN_ROUTES}/clear/super/cookie`, async(req,res)=>{
        try{
 

       return   res.clearCookie('superAdmin').clearCookie('admin').json({msg:"kolac unisten"}).end()


        }catch(err){
            console.log(err);
        }



    
    
    
    })




    
    //Clear   Admin Cookie
    router.get(`${process.env.ADMIN_ROUTES}/clear/admin/cookie`, async(req,res)=>{
        try{
 

       return   res.clearCookie('admin').json({msg:"kolac unisten"}).end()

        }catch(err){
            console.log(err);
        }



    
    
    
    })
    

    












   router.get(`${process.env.ADMIN_ROUTES}/users`, superValidate , async(req,res)=>{

    try{

 
        connection.query('SELECT * FROM admin',(err,results,fields)=>{
            if (err) {
                throw err;
                
            }
            res.json({msg:results})
        })


    }catch(eror){
        console.log(eror);

    }

   
})



   //Get single user Super Admin
   router.get(`${process.env.ADMIN_ROUTES}/users/single`, superValidate , async(req,res)=>{


     try{

        
    connection.query(`SELECT * FROM admin WHERE name='${name}'`,(err,results,fields)=>{
        if (err) {
            throw err;
            
        }
        res.json({msg:results})
    })




     }catch(eror){

        console.log(eror);

     }

    

})



//Get All Users from TABLE korisnici for ADMIN and SUPER-ADMIN
router.get(`${process.env.ADMIN_ROUTES}/users/korisnici`,checkAdminCookie, async(req,res)=>{
        

    try{



 
        connection.query('SELECT * FROM korisnici',(err,results,fields)=>{
            if (err) {
                throw err;
                
            }
            res.json({msg:results})
        })


    }catch(eror){
        console.log(eror);

    }

   
})






//Clear Super Admin cookie
router.get(`${process.env.ADMIN_ROUTES}/clearsuperadmin`,checkAdminCookie,superValidate,(req,res)=>{

return   res.clearCookie("superAdmin").clearCookie("admin").json({msg:"Super Admin Logout."}).end().status(200)

   

})






   






                                                                                           

module.exports = router