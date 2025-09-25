const express = require('express');
const app = express();
const cors = require('cors');
const { format } = require('date-fns');
require('dotenv').config();

// 바디 파서
app.use(express.json());

app.use(cors({
    origin : '*'
}))

const dailyRouters = require('./routers/dailyRouters');
const todoRouters = require('./routers/todoRouters');
const shoppingListRouters = require('./routers/shoppingListRouters');
const waterRouters = require('./routers/waterRouters');

// 라우터
app.use('/daily', dailyRouters);
app.use('/todo', todoRouters); 
app.use('/shopping', shoppingListRouters);
app.use('/water', waterRouters);

app.get('/', (req, res)=>{
    const today = new Date();
    const kst = new Date(today.getTime() + 33 * 60*60*1000);

    res.send(kst);
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log('Connected to port 3000✅');
})