const express= require('express');
const app=express();
const path=require('path');
const cors=require('cors');
const corsOptions=require('./config/corsOptions')
const {logger}=require('./middleware/logEvents');
const errorHandler=require('./middleware/errorHandler');

const PORT=process.env.PORT || 3500;

//custom middleware.logger
app.use(logger);

//cross origin resource sharing
//make your own whitelist, including your doman name

app.use(cors(corsOptions));

//built-in middleware to handle urlencoded data
//in other words, form data:
//'content-type:application/x-www-form-urlencoded'

app.use(express.urlencoded({extended:false}));

//built-in middleware for json
app.use(express.json());

//serve static files
app.use('/',express.static(path.join(__dirname,'/public')));
app.use('/subdir',express.static(path.join(__dirname,'/public')));

//routes
app.use('/',require('./routes/root'));
app.use('/register',require('./routes/register'));
app.use('/auth',require('./routes/auth'));
app.use('/subdir', require('./routes/subdir'));
app.use('/employees',require('./routes/api/employees'));

//the following 404 page statement can also show like below
/*
app.get('/*',(req,res)=>{
    res.status(404).sendFile(path.join(__dirname,'views','404.html'))
});
 */
app.all('*',(req,res)=>{
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'));  
    }else if(req.accepts('json')){
        res.json({error:"404 Not found"});  
    }else{
        res.type('txt').send("404 not found txt");
    }
})
   


app.use(errorHandler);






app.listen(PORT,()=>console.log(`server running on port ${PORT}`));



