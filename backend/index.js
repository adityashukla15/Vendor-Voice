
require("dotenv").config();
const app=require('./src/app')

const dotenv=require('dotenv')


const cors=require('cors')
const connectToDB=require('./src/config/db')


app.use(cors())
connectToDB()

const PORT=process.env.PORT||5000
app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
 })
 