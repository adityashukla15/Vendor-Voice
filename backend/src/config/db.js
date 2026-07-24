const mongoose=require('mongoose')

function connectToDB(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log('Server connected to DB')
    })
    .catch((error)=>{
        console.log('Error connecting to DB')
        console.log('Error:',error)        
    })
}
module.exports=connectToDB