




const {checkAdminCookie} =require('../../middlewares/Admin/checkAdminCookie')




const { connection } = require('../../model/Model');

const express = require('express')
const router = express.Router()

var jwt = require('jsonwebtoken');



const {CheckUserPassword} =require('../../middlewares/Users/CheckUserPassword');

const {CheckUserCookie} =require('../../middlewares/Users/CheckUserCookie')











                                                //Admin  Routes


                                                                                                  

//Admin singup Create Admin--------------------------------------------------------------------------------------------------------
router.post(`${process.env.USER_ROUTES}/singup` , CheckUserPassword ,checkAdminCookie,async (req,res)=>{
    const {cardId,name,lastName,gender,position,yearsActive,paycheck,overTime,role} =req.body;

    try{
    

 
      
    
    connection.query(`INSERT INTO Korisnici(cardId,name,lastName,gender,position,yearsActive,joinDate ,paycheck,overTime ,role,
     startTime ,endTime, startPause, endPause,startTrue,puseStartTrue,puseEndTrue)
    values('${cardId}','${name}','${lastName}','${gender}','${position}','${yearsActive}',now(),'${paycheck}','${overTime}','${role}', '[""]', '[""]','[""]', '[""]',true,false,false)`, (err,results,fields)=>{
        if (err) {
        return  res.json({msg:err.sqlMessage});
            
        }

        const token= jwt.sign({data:[name,lastName,role,cardId,results[0].id]},process.env.SECRET,{ expiresIn: 60 * 60 })


      return  res.cookie('user',token,{ httpOnly:true  ,maxAge:700000 }).json({user:results}).status(200)


    
    })
    
    }catch(err){
        console.log(err);
    }
    
    
    })


    
//Admin login Page--------------------------------------------------------------------------------------------------------------
router.post(`${process.env.USER_ROUTES}/login`,CheckUserPassword ,async (req,res)=>{
    const {cardId}=req.body

  
  
try{

   

    
connection.query(`SELECT * FROM korisnici WHERE  cardId ='${cardId}'`,(err,results,fields)=>{




  
  
   
   
    if (err) {

        return  res.json({msg:err});

    }else if(results.length <=0){

        return res.json({msg:[false,'Not loged in']})


    }else{

       

        const token=  jwt.sign({data:[true,results[0].name, results[0].lastName,results[0].id, results[0].startTrue, results[0].puseStartTrue,results[0].puseEndTrue]},process.env.SECRET,{ expiresIn: '1h' })

    return res.cookie('user',token,{ maxAge: 9000000, httpOnly: true  }).json({msg:[true,"You are loged in"]})


   

    }

})

}catch(err){
    console.log(err);

}

})





    
    
    
    
    
    //Update admin----------------------------------------------------------------------------------------------------------------------
    
    router.post(`${process.env.USER_ROUTES}/update/:id` , checkAdminCookie , async(req,res)=>{
    
       const{id}=req.params   

        const {cardId,name,lastName,gender,position,yearsActive,paycheck,overTime,role} =req.body;

        try{
             
    connection.query(`UPDATE Korisnici SET cardId='${cardId}',name ='${name}',lastName='${lastName}',gender='${gender}',position='${position}',yearsActive='${yearsActive}',joinDate=now() ,paycheck='${paycheck}',overTime='${overTime}' ,role='${role}' WHERE id='${id}'`, (err,results,fields)=>{
        if (err) {
        return  res.json({msg:err.sqlMessage});
            
        }else if(results.affectedRows<1){
            return  res.json({msg:"User not updated"}).status(200)

           }

           return  res.json({msg:"User updated"}).status(200)


      })

    

    
        }catch(error){
            console.log(error);
    
        }
    })
    
    
    //Delete Admin-----------------------------------------------------------------------------------------------------------------------
    
    
    router.delete(`${process.env.USER_ROUTES}/delete/:id`, checkAdminCookie , async(req,res)=>{
        const {id}=req.params
    
    
        try{
    
            
        connection.query(`DELETE FROM korisnici WHERE id='${id}'`,(err,results,fields)=>{
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
    
    //Check Admin is logedin with cookie
    
    
    router.get(`${process.env.USER_ROUTES}/login/cookie`, checkAdminCookie,async (req,res)=>{

        const token=req.cookies["admin"]
  
    try{
        if (!token) {
            
            return res.json({msg:[false,"Restricted area"]})
            
        }
    

    jwt.verify(token.token, process.env.SECRET, function(err, decoded) {
    
        if (err) {
           return res.json({msg:[false,"Admin not loged in"]})
            
        }
        return res.json({msg:[true,"Welcome Admin"]}).status(200)
    
      
       
    
       
      });
    

    
    }catch(eror){
        console.log(eror);
    
    }
    
    
    })
    
    
    
       //Get All Users Super Admin
       router.get(`${process.env.USER_ROUTES}/users`, checkAdminCookie , async(req,res)=>{

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
    
    
    
       //Get single user Super Admin
       router.get(`${process.env.USER_ROUTES}/users/single/:id`, checkAdminCookie , async(req,res)=>{
    
         const { id } =req.params

         try{

    
 
    
        connection.query(`SELECT * FROM korisnici WHERE id='${id}'`,(err,results,fields)=>{
            if (err) {
                throw err;
                
            }
            res.json({msg:results})
        })
    
    
    
    
         }catch(eror){
    
            console.log(eror);
    
         }
    
        
    
    })

    //Clear  Admin cookie
router.get(`${process.env.USER_ROUTES}/clearadmincookie`,checkAdminCookie,(req,res)=>{

    res.clearCookie("admin");

    res.json({msg:"Admin Logout."}).end().status(200)

})








//Check user cookie
router.get('/api/user/cookie',async (req,res)=>{

    const token=req.cookies['user']

try{
    if (!token) {
        
        return res.json({msg:[false,"Restricted area"]})
        
    }


jwt.verify(token, process.env.SECRET, function(err, decoded) {

    if (err) {
       return res.json({msg:[false,"Somthing wenth wrong "+err]})
        
    }
    return res.json({msg:[decoded.data[0],"Welcome User",decoded.data[1],decoded.data[2],decoded.data[3],decoded.data[4],decoded.data[5],decoded.data[6]]}).status(200)

  
   

   
  });





}catch(eror){
    console.log(eror);

}


})


    //Clear  User  cookie
    router.get(`${process.env.USER_ROUTES}/clear/user/cookie`, async(req,res)=>{
        try{
 

       return   res.clearCookie('user').json({msg:"kolac unisten"}).end()


        }catch(err){
            console.log(err);
        }



    
    
    
    })
    







//------------------------------------------------------------
//User update Time start Time

router.post(`${process.env.USER_ROUTES}/update/time/start/:id`, CheckUserCookie , async(req,res)=>{

    const {id} =req.params;
    const {startTime} =req.body
 

    try{
         
connection.query(`UPDATE korisnici SET startTime = JSON_ARRAY_APPEND(startTime , '$', '${startTime}') , startTrue=false , puseStartTrue=true WHERE id='${id}'`, (err,results,fields)=>{
    if (err) {
    return  res.json({msg:err+' asasdas'});
        
    }else if(results.affectedRows<1){
        return  res.json({msg:"User not updated "}).status(200)

       }

       return  res.clearCookie('user').json({msg:"User start time"}).status(200)


  })




    }catch(error){
        console.log(error);

    }
})



//User update Time start Time

router.post(`${process.env.USER_ROUTES}/update/time/end/:id`,  CheckUserCookie , async(req,res)=>{

    const {id} =req.params;
    const{endTime} =req.body

    try{

                
connection.query(`UPDATE korisnici SET endTime = JSON_ARRAY_APPEND(endTime , '$', '${endTime}') , startTrue=true , puseStartTrue=false ,puseEndTrue=false  WHERE id='${id}'`, (err,results,fields)=>{
    if (err) {
    return  res.json({msg:err+' asasdas'});
        
    }else if(results.affectedRows<1){
        return  res.json({msg:"User not updated time"+err}).status(200)

       }

       return  res.clearCookie('user').json({msg:"User updated time"}).status(200)


  })







    }catch(error){
        console.log(error);

    }
})





















//User update Time Pause Time



router.post(`${process.env.USER_ROUTES}/update/time/pause/:id`,  CheckUserCookie , async(req,res)=>{

    const {id} =req.params;
    const{startPause} =req.body

    try{

               
connection.query(`UPDATE korisnici SET startPause = JSON_ARRAY_APPEND(startPause , '$', '${startPause}') , puseStartTrue=false ,puseEndTrue=true   WHERE id='${id}'`, (err,results,fields)=>{
    if (err) {
    return  res.json({msg:err+' asasdas'});
        
    }else if(results.affectedRows<1){
        return  res.json({msg:"User not updated time"+err}).status(200)

       }

       return res.clearCookie('user').json({msg:"User updated Puse"}).status(200)


  })


         




    }catch(error){
        console.log(error);

    }
})




//User update Time End Pause Time



router.post(`${process.env.USER_ROUTES}/update/time/endPause/:id`, CheckUserCookie , async(req,res)=>{

    const {id} =req.params;
    const{endPause} =req.body

    try{

               
        connection.query(`UPDATE korisnici SET endPause = JSON_ARRAY_APPEND(endPause , '$', '${endPause}') , puseEndTrue=false WHERE id='${id}'`, (err,results,fields)=>{
            if (err) {
            return  res.json({msg:err+' asasdas'});
                
            }else if(results.affectedRows<1){
                return  res.json({msg:"User not updated time "+err}).status(200)
        
               }
        
          return     res.clearCookie('user').json({msg:"User end  pause"}).status(200)
        
        
          })
        
        
                 

         




    }catch(error){
        console.log(error);

    }
})









module.exports =router