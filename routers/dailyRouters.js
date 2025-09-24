const express = require('express');
const router = express.Router();
const daily = require('../lib/daily');
const cron = require('node-cron');

// Add New Daily Routine
router.post('/routine', (req, res)=>{
    daily.add_new_routine(req,res);
})

// Delete Daily Routine
router.delete('/routine/:routineId',(req, res)=>{
    daily.delete_routine(req, res);
})

// Get All Routine List(왜 필요한지 모르겠다.)
router.get('/routine',(req, res)=>{
    daily.get_routine_list(req, res);
})

// Get Today's routine
router.get('/routine/today', (req, res)=>{
    daily.get_todays_routine(req, res);
})

// Get Routine with Date
router.get('/routine/single/:date', (req, res)=>{
    daily.get_single_day_routine(req, res);
})


// Patch Single Routine
router.patch('/routine/:routineId', (req, res)=>{
    daily.patch_routine(req, res);
})

// Change Routine's Status
router.patch('/routine/done/:routineId', (req, res)=>{
    daily.change_done_status(req, res);
})


router.get('/routine/new', (req, res)=>{
    daily.settle_routine(req, res);
})


router.patch('/routine/result/settle', (req, res)=>{
    daily.settle_routine(req, res);
})

// Delete items when created_at < 8days
router.delete('/routine/result/settle', (req, res)=>{
    daily.delete_old_routines(req, res);
})


// crontab : 매일 0 시에 작동
cron.schedule('0 0 * * *', async () => {
    // TODO : 
    daily.settle_routine();
})


// Daily Todo 관련

// 새로운 오늘 할 일 생성
router.post('/todo', (req, res)=>{
    daily.createNewDailyTodo(req, res);
})

// 특정 날짜의 오늘 할 일 들고오기
router.get('/todo/:date', (req, res)=>{
    daily.getSingleDayDailyTodo(req, res);
})

// 특정 오늘 할 일 아이템 수정
router.patch('/todo/:todoId', (req, res)=>{
    daily.editSingleDailyTodoItem(req, res);
})

// 특정 오늘 할 일 아이템의 상태를 바꾸기(isDone -> !isDone)
router.patch('/todo/:todoId/done', (req, res)=>{
    daily.patchDailyTodoStatus(req, res);
})

// 특정 오늘 할 일 아이템 삭제
router.delete('/todo/:todoId', (req, res)=>{
    daily.deleteSingleDailyTodoItem(req, res);
})


// Allocation 관련
router.get('/allocation/:date', (req, res)=>{
    daily.getSingleDayDailyAllocation(req, res);
})

module.exports = router;