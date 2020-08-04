const http=require('http');
const path=require('path');
const fs=require('fs');

const host='localhost';
const port=8080;

const server=http.createServer((req,res)=>{
     if(req.method=='GET') {
         var fileUrl;
         if(req.url=='/') fileUrl='/index.html';
         else fileUrl=req.url;

         var filepath=path.resolve('./public'+ fileUrl);
         const fileext=path.extname(filepath);
         if(fileext=='.html') {
             fs.exists(filepath,exist=>{
                 if(!exist) {
                     res.statusCode=404;
                     res.setHeader('Content-Type','text/html');
                     res.end('<html><body>NOt Found</body></html');
                     return;
                 }
                 res.statusCode=200;
                 res.setHeader('Content-Type','text/html');
                 fs.createReadStream(filepath).pipe(res);
             });

         }
         else {
            res.statusCode=404;
            res.setHeader('Content-Type','text/html');
            res.end('<html><body>NOt an HTML file</body></html');
            return;
         }
     }
     else {
        res.statusCode=404;
        res.setHeader('Content-Type','text/html');
        res.end('<html><body>Method not supported</body></hmtl');
        return;
     }
});

server.listen(port,host,()=>{
    console.log(`Server running at http://${host}:${port}`);
})