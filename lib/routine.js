const { supabase } = require("./db");
const { format } = require('date-fns');


module.exports={
    add_new_routine : async (req, res)=>  {
        const body = req.body;

        const title = body['title']

        const {data, error} = await supabase.from('routine').insert([{title: title}]);


        if(error) {
            console.log(error);
            res.status(500).json({
                'result' : 'error occured',
                'error': error
            })
        }
        else{
            console.log(data);
            res.json({
                'result' : "done"
            })
        } 
    },

    delete_routine :  async (req, res)=>{
        const routineId = req.params.routineId;

        const {data, error} = await supabase.from('routine').delete().eq('id', routineId);

        if(error){
            console.log(error);
            res.status(500).json({
                'result' : 'error occured',
                'error': error
            })
        }else{
            console.log(data);
            res.json({
                'result': 'done'
            })
        }
    },

    get_routine_list :  async (req, res)=>{
        const {data, error} = await supabase.from('routine').select('*');

        if(error){
            console.log(error);
            res.status(500).json({
                'result' : 'error occured',
                'error': error
            })
        }else{
            console.log(data);
            res.json(data);
        }
    },

    get_single_day_routine : async(req, res)=>{
        const date = req.params.date;

        if(!date){
            res.status(400).json({error : 'Missing date parameter'});
        }

        const {data, error } = await supabase.from('routine').select('*').gte('created_at', `${date}T00:00:00.000Z`).lt('created_at', `${date}T23:59:59.999Z`);

        if(error){
            console.log(error);
            res.status(500).json({
                "result" : "error occured",
                "error" : error
            })
        }else{
            console.log(data);
            res.json(data);
        }
    },

    get_todays_routine : async(req, res)=>{
        const today = format(new Date(), 'yyyy-MM-dd');

        const {data, error} = await supabase.from('routine').select('*').gte('created_at', `${today}T00:00:00.000Z`).lt('created_at', `${today}T23:59:59.999Z`).order('created_at',{ascending:true});

        if(error){
            console.log(error);
            res.status(500).json({
                'result' : 'error occured',
                'error': error
            })
        }else{
            console.log(data);
            res.json(data);
        }
    },

    patch_routine : async(req, res)=>{
        const routineId = req.params.routineId;
        const body = req.body;
        
        const isDone = body['isDone'];
        const title = body['title'];

        const {data, error }  = await supabase.from('routine').update({is_done : isDone, title : title}).eq('id', routineId);

        if(error){
            console.log(error);
            res.status(500).json({
                'result' : 'error occured',
                'error': error
            })
        }else{
            console.log(data);
            res.json({
                result : "routine patched successfully"
            });
        }
    },

    change_done_status : async(req, res)=>{
        const routineId = req.params.routineId;
        const { data: existingData, error: fetchError } = await supabase.from('routine').select('is_done').eq('id', routineId).single();

        if (fetchError) {
            console.error(fetchError);
            res.status(400).json({
                error : 'error occured while connecting server.'
            })
        } else {
            const currentValue = existingData.is_done;
            const toggledValue = !currentValue;

            const { data, error: updateError } = await supabase.from('routine').update({ is_done: toggledValue }).eq('id', routineId);

            if (updateError) {
                console.error(updateError);
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

    settle_routine : async (req, res)=>{
        const now = new Date();
        const kst = new Date(now.getTime() + 9 *60 *60 *1000);
        const yesterdayKst = new Date(now.getTime() + 9 * 60 * 60 * 1000 - 24 * 60 * 60 * 1000);

        const today = kst.toISOString().slice(0,10);
        const yesterday = yesterdayKst.toISOString().slice(0,10);

        const {data : yesterdayData, error : yesterdayError} = await supabase.from('routine').select('*').gte('created_at', `${yesterday}T00:00:00.000Z`).lt('created_at', `${yesterday}T23:59:59.999Z`)


        try {
            for (const d of yesterdayData) {
                const { data, error } = await supabase
                .from('routine')
                .insert([{ title: d['title'] }]);

                if (error) {
                    console.error('Insert error:', error);
                    throw error;  // 필요시 중단
                }
            }
        } catch (e) {
            console.log('error', e);
        }
    },

    delete_old_routines: async(req, res)=>{
        const now = new Date();
        const kst = new Date(now.getTime() + 9 *60 *60 *1000);
        const days7before = new Date(kst.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        
        const{data, error} = await supabase.from('routine').delete().lt('created_at', days7before );

        if(error){
            console.log(error)
            res.status(500).json({
                result : 'error occured',
                error : error
            })
        }else{
            console.log(data);
            res.json({
                result : 'done'
            })
        }
    }
}