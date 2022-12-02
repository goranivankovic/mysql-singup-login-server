
function checkSuperAdminPassword(req,res,next){

    const password=req.body.password;

    const name=req.body.name;

    if(!name){

        res.json({msg:[false,"Name input is empty"]})

    }else  if(name.length <4 ){
        res.json({msg:[false,"Name must be at least 4 characters length"]})

    }else if(!password){

        res.json({msg:[false,"Password input is empty"]})

    }else  if(password.length <6 ){
        res.json({msg:[false,"Password must be at least 6 characters length"]})

    }
    
    else{
        next()
    }

}


module.exports= { checkSuperAdminPassword }
