const { supabase } = require("./db");
const { format } = require('date-fns');

module.exports = {
    getShoppingList : async(req, res)=>{
        const {data, error} = await supabase.from('shopping_list').select('*');

        if(error) {
            console.log(error);
            res.status(500).json({
                result : 'error occured',
                error : error
            })
        }else{
            // console.log(data);
            res.json(data);
        }
    },

    addShoppingItem : async(req, res)=>{
        const body = req.body;
        const name = body['name'];

        const { data, error } = await supabase.from('shopping_list').insert([{name: name}]);

        if(error) {
            console.log(error);
            res.status(500).json({
                result : 'error occured',
                error : error
            })
        }else{
            console.log('done');
            res.json({result : 'done'});
        }
    },

    editShoppingItem : async(req, res)=>{
        const shoppingId = req.params.shoppingId;

        const body = req.body;
        const name = body['name'];

        const {data, error} = await supabase.from('shopping_list').update({ name : name}).eq('id', shoppingId);

        if(error) {
            console.log(error);
            res.status(500).json({
                result : 'error occured',
                error : error
            })
        }else{
            res.json({
                result : 'done'
            });
        }
    },

    changeItemStatus : async(req, res)=>{
        const shoppingId = req.params.shoppingId;

        const { data: existingData, error: fetchError } = await supabase.from('shopping_list').select('is_done').eq('id', shoppingId).single();

        if (fetchError) {
            console.error(fetchError);
            res.status(400).json({
                error : 'error occured while connecting server.'
            })
        } else {
            const currentValue = existingData.is_done;
            const toggledValue = !currentValue;

            const { data, error: updateError } = await supabase.from('shopping_list').update({ is_done: toggledValue }).eq('id', shoppingId);

            if (updateError) {
                console.log(updateError);
                res.status(500).json({
                error : 'Error occured while updating data'
            })
            } else {
                console.log('✅ Toggled:', data);
                res.json({
                    'result': 'done'
                })
            }
        }
    },

    deleteShoppingItem : async(req, res)=>{
        const shoppingId = req.params.shoppingId;

        const {data, error } = await supabase.from('shopping_list').delete('').eq('id', shoppingId);

        if (error) {
                console.error(error);
                res.status(500).json({
                error : 'Error occured while removing data'
            })
            } else {
                console.log('✅ Toggled:', data);
                res.json({
                    'result': 'done'
                })
            }
    },



}