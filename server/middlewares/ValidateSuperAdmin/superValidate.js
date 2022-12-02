const jwt =require('jsonwebtoken');

async function superValidate(req,res,next){

    const token=req.cookies['superAdmin']

    try{

        if (!token) {

            return  res.json({msg:[false,"Restricted area  Please leave "]});
            
        
                   
                
            }
        
                jwt.verify(token,process.env.SECRET,(eror,decoded)=>{
                    if (eror) {
                        
                        return res.json({msg:eror.sqlMessage});
                        
                    }   
                    
                    else if(decoded.data.length<=0){
                        return     res.json({msg:[false,"Restricted area 2   red"]});
        
                    }else if( decoded.data[3] != 'super'){
                      return  res.json({msg: [false,"Not Super Admin"]})
                    }
                    return next()
        
                
              
            
                })
        




    }catch(err){
        console.log(err)
    }

  


    }
    
 
   module.exports={superValidate}