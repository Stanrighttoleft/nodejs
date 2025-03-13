const http=require('http');
const path=require('path');
const fs=require('fs');
const fsPromises=require('fs').promises;



const logEvents=require('./logEvents');
const EventEmitter=require('events');
class Emitter extends EventEmitter{};

//initialize object
const myEmitter=new Emitter();

myEmitter.on('log',(msg, fileName)=>logEvents(msg, fileName));

const PORT=process.env.PORT || 3500;

const serveFile=async(filePath,contentType,response)=>{
    try{
        const rawData=await fsPromises.readFile(
            filePath,
            !contentType.includes('image')?'utf8':''
        );
        const data=contentType ==='application/json'
            ? JSON.parse(rawData) : rawData;
        response.writeHead(
            filePath.includes('404.html')?404:200,
            {'Content-Type':contentType});
        response.end(
            contentType==='application/json'?JSON.stringify(data):data
        );

    }catch(err){
        console.log(err);
        myEmitter.emit('log',`${err.name}: ${err.message}`,'errLog.txt');
        response.statusCode=500;
        response.end();

    }
}

const server=http.createServer((req,res)=>{
    console.log(req.url, req.method);
    myEmitter.emit('log',`${req.url}\t${req.method}`,'reqLog.txt');

    const extension=path.extname(req.url);
    let contentType;

    switch(extension){
        case '.css':
            contentType='text/css';
            break;
        case '.js':
            contentType='text/javascript';
            break;
        case '.json':
            contentType='application/json';
            break;
        case '.jpg':
            contentType='image/jpeg';
            break;
        case '.png':
            contentType='image/png';
            break;
        case '.txt':
            contentType='text/plain';
            break;
        default:
            contentType='text/html';
    

    }
//the following is equal to if else statement. ?is result, :is condition
    let filePath=
        contentType==='text/html' && req.url==='/'
            ?path.join(__dirname,'views','index.html')
            :contentType==='text/html' && req.url.slice(-1)==='/'
                ?path.join(__dirname,'views',req.url,'index.html')
                :contentType==='text/html'
                    ?path.join(__dirname,'views',req.url)
                    :path.join(__dirname,req.url);
        
        //make .html extension not required in the browser
    
    if(!extension && req.url.slice(-1) !=='/') filePath +='.html';

    const fileExists=fs.existsSync(filePath);

    if(fileExists){
        //serve the file
        serveFile(filePath,contentType,res);
    }else{
        //404
        //301 redirect
        //console.log(path.parse(filePath));
        switch(path.parse(filePath).base){
            case 'old-page.html':
                res.writeHead(301,{'Location':'/new-page.html'});
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301,{'Location':'/'});
                res.end();
                break;
            default:
                //serve a 404 response
                serveFile(path.join(__dirname,'views','404.html'),'text/html',res);

        }
    }



    /*

    //use switch statment instead
    let path;

    switch (req.url){
        case '/':
            res.statusCode=200;
            path=path.join(__dirname,'views','index.html');
            fs.readFile(path,'utf8',(err,data)=>{
                res.end(data);
            });
            break;
    }

*/
    
    /*
    if(req.url === '/'|| req.url==='index.html'){
        res.statusCode=200;
        res.setHeader('Content-Type','text/html');
        path=path.join(__dirname,'views','index.html');
        fs.readFile(path,'utf8',(err,data)=>{
            res.end(data);
        });
    }
    */


});

server.listen(PORT,()=>console.log(`server running on port ${PORT}`))





/*

//add listener for the log event
myEmitter.on('log',(msg)=>logEvents(msg));

setTimeout(()=>{
    //Emit event
    myEmitter.emit('log','log event emitted');

},2000)

*/