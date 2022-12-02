const jwt =require('jsonwebtoken');



function checkAdminCookie(req,res,next) {

  const token =req.cookies['admin'];

  if (!token) {

  return    res.json({msg:[false,"Admin Cookie does not exists"]})
      
  }else{

      jwt.verify(token,process.env.SECRET,(eror,decoded)=>{
          if (eror) {
              
              return res.json({msg:eror.sqlMessage});
              
          }
        else if(decoded.data.length<=0){
            return     res.json({msg:[false,"Restricted area 2   red"]});

        }else if( decoded.data[3] == 'super'){
          return  next()
        }else if( decoded.data[3] == 'admin'){
          return  next()
        }else{
          return  res.json({msg: [false,"Not  Admin"]})
        }
     
         
  
      })


    }
  
}

module.exports= { checkAdminCookie }