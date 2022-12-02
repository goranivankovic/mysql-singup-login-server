const express = require('express');
const cors = require('cors');

const path = require('path');
 require('dotenv').config()
 const cookieParser = require('cookie-parser');






const app = express()



 

const PORT =process.env.PORT || 5000;
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({credentials: true ,optionSuccessStatus:200, origin: process.env.DOMAIN_NAME }));


// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", '*');
//     res.header("Access-Control-Allow-Credentials", true);
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
//     next();
// });



//User routes

const userRoutes = require('./server/routes/User/UserRoutes');
app.use('/',userRoutes)






//Admin routes

const adminRoutes = require('./server/routes/Admin/AdminRoutes');
app.use('/',adminRoutes)






if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname,'client','build','index.html'));
    });
}

app.listen(PORT,()=>{
    console.log(`Server is runing on ${PORT}`);
})
