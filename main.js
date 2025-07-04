const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// 바디 파서
app.use(express.json());

app.use(cors({
    origin : '*'
}))

const routineRouter = require('./routers/routineRouters');
const todoRouter = require('./routers/todoRouters');
// 라우터
app.use('/routine', routineRouter);
app.use('/todo', todoRouter); 



const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log('Connected to port 3000✅');
})