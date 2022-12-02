



function CheckUserPassword(req,res,next){

    
    const cardId=req.body.cardId;



  if(!cardId){

        res.json({msg:[false,"Password input is empty"]})

    }else  if(cardId.length <6 ){
        res.json({msg:[false,"Password must be at least 6 characters length"]})

    }
    
    else{
        next()
    }




}













module.exports= { CheckUserPassword }