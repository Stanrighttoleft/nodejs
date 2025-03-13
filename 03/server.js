const http=require('http');
const path=require('path');
const fs=require('fs');
const fsPromises=require('fs').promises;



const logEvents=require('./logEvents');

const EventEmitter=require('events');

class Emitter extends EventEmitter{};

//initialize object
const myEmitter=new Emitter();

const PORT=process.env.PORT || 3500;

const server=http.createServer((req,res)=>{
    console.log(req.url, req.method);
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