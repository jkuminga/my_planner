const express = require('express');
const router = express.Router();
const todo = require('../lib/todo');

router.get('/single', (req, res)=>{
    todo.get_todo_list(req, res);
})

router.get('/single/:todoId', (req, res)=>{
    todo.get_single_todo(req, res);
})

router.patch('/single/:todoId', (req, res)=>{
    todo.edit_todo(req, res);
})  

router.post('/', (req, res)=>{
    todo.add_new_todo(req, res);
})

router.get('/archive', (req, res)=>{
    todo.get_my_archive(req, res);
})

router.patch('/archive/:todoId', (req, res)=>{
    todo.save_to_archive(req, res);
})

router.delete('/:todoId', (req, res)=>{
    todo.delete_todo(req, res);
})

module.exports = router;