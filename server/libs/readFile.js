const fs = require('fs');

function readFile(filename){
    let promise = new Promise(function(resolve,reject){
        fs.readFile(filename,function(err,cont){
            if(err){
                return reject(err)
            }
            else{
                resolve(cont);
            }
        })
    })
    return promise;
}
module.exports = readFile;
