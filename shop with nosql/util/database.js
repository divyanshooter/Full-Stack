const mongodb=require('mongodb');
const mongoClient=mongodb.MongoClient;

let _db;

const mongoConnect=callback=>{
    mongoClient.connect('mongodb+srv://divyanshu:divyanshu@cluster0-h4th2.mongodb.net/shop?retryWrites=true&w=majority')
    .then(client=>{
        console.log('connected');
        _db=client.db();
        callback();
    })
    .catch(err=>console.log(err));
};

const getDb=()=>{
    if(_db)
     {
         return _db;
     }

     throw 'NO DATABASE FOUND';
}
exports.mongoConnect=mongoConnect;
exports.getDb=getDb;


