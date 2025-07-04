const { supabase } = require("./db");
const { format } = require('date-fns');

module.exports={
    get_todo_list : async (req ,res)=>{
        const {data, error} = await supabase.from('todo').select('*').eq('is_done', false);

        if(error){
            console.log(error);
            res.status(500).json({
                result : 'error occured',
                error : error
            })
        }else{
            console.log(data);
            res.json(data);
        }
    },

    get_single_todo :  async (req, res)=>{
        const todoId = req.params.todoId;

        const {data, error} = await supabase.from('todo').select('*').eq('id', todoId);

        if(error){
            console.log(error);
            res.status(500).json({
                result : 'error occured',
                error : error
            })
        }else{
            console.log(data);
            res.json(data);
        }


    },

    add_new_todo :  async(req, res)=>{

        const body = req.body;
        const title = body['title'];
        const description = body['description'];

        const { data, error } = await supabase.from('todo').insert([{title :title, description : description}]);

        if(error){
            console.log(error);
            res.status(500).json({
                result : 'error occured',
                error : error
            })
        }else{
            console.log(data);
            res.json({
                result : 'done'
            });
        }
    },

    get_my_archive : async(req, res)=>{
        const {data, error } = await supabase.from('todo').select('*').eq('is_done', true);

        if(error){
            console.log(error);
            res.status(500).json({
                result : 'error occured',
                error : error
            })
        }else{
            console.log(data);
            res.json(data);
        }
    },

    save_to_archive : async(req, res)=>{
        const todoId = req.params.todoId;
        const today = format(new Date(), 'yyyy-MM-dd HH:mm:ss'); 


        const {data, error} = await supabase.from('todo').update({is_done : true, done_date : today}).eq('id', todoId);

        if(error){
            console.log(error);
            res.status(500).json({
                result : 'error occured',
                error : error
            })
        }else{
            console.log(data);
            res.json({
                result : 'todo saved to archive'
            });
        }
    },

    edit_todo : async(req, res)=>{
        const body = req.body;
        const todoId = req.params.todoId;

        const title = body['title'];
        const description = body['description'];

        const {data, error} = await supabase.from('todo').update({title : title, description : description}).eq('id', todoId);

        if(error){
            console.log(error);
            res.status(500).json({
                result : 'error occured',
                error : error
            })
        }else{
            console.log(data);
            res.json({
                result : 'todo editted successfully'
            });
        }        
    },

    delete_todo : async(req, res) =>{
        const todoId = req.params.todoId;

        const {data, error} = await supabase.from('todo').delete().eq('id', todoId);

        if(error){
            console.log(error);
            res.status(500).json({
                result : 'error occured',
                error : error
            })
        }else{
            console.log(data);
            res.json({
                result : 'todo deleted successfully'
            });
        }
    }
}