const express = require('express');
const router = express.Router();
const water = require('../lib/water');

router.get('/history', (req, res)=>{
    water.getHistory(req, res);
})

router.get('/:date', (req ,res)=>{
    water.getWaterIntake(req, res);
});



router.post('/', (req ,res)=>{
    water.createTodaysWater(req, res);
});

router.patch('/', (req ,res)=>{
    water.addTodaysIntake(req, res);
});


module.exports = router;