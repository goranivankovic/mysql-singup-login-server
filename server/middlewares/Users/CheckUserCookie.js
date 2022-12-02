
const jwt =require('jsonwebtoken');

function CheckUserCookie(req,res,next) {


    
  const token =req.cookies['user'];

  if (!token) {

  return    res.json({msg:[false,"Protected route"]})
      
  }else{

      jwt.verify(token,process.env.SECRET,(eror,decoded)=>{
          if (eror) {
              
              return res.json({msg:eror.sqlMessage});
              
          }else if(!decoded.data){

            return res.json({msg:[false,"Role not given"]})

          }else{
            return next()

          }
  
      })


    }
  



    
}


module.exports={CheckUserCookie}