const express = require('express');
const router = express.Router();
const routine = require('../lib/routine');
const cron = require('node-cron');

router.post('/', (req, res)=>{
    routine.add_new_routine(req,res);
})

router.delete('/:routineId',(req, res)=>{
    routine.delete_routine(req, res);
})

router.get('/',(req, res)=>{
    routine.get_routine_list(req, res);
})

router.get('/today', (req, res)=>{
    routine.get_todays_routine(req, res);
})

router.get('/single/:date', (req, res)=>{
    routine.get_single_day_routine(req, res);
})

router.patch('/:routineId', (req, res)=>{
    routine.patch_routine(req, res);
})

router.patch('/done/:routineId', (req, res)=>{
    routine.change_done_status(req, res);
})

router.get('/new', (req, res)=>{
    routine.settle_routine(req, res);
})

cron.schedule('0 0 * * *', async () => {
    routine.settle_routine();
})

module.exports = router;