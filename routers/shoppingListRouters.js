const express = require('express');
const router = express.Router();
const shoppingList = require('../lib/shoppingList');

// 전체 리스트 불러오기
router.get('/list', (req, res)=>{
    shoppingList.getShoppingList(req, res);
})

// 상품 추가하기
router.post('/', (req, res)=>{
    shoppingList.addShoppingItem(req, res);
})

// 상품 수정하기
router.patch('/:shoppingId', (req, res)=>{
    shoppingList.editShoppingItem(req ,res);
})

// 상품 구매 완료 상태로 변경하기
router.patch('/status/:shoppingId', (req, res)=>{
    shoppingList.changeItemStatus(req, res);
})

// 상품 삭제하기
router.delete('/:shoppingId', (req, res)=>{
    shoppingList.deleteShoppingItem(req, res);
})

module.exports = router;