const { supabase } = require("./db");
const { format } = require('date-fns');


module.exports={
    // 새로운 루팅 생성 
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

    // 기존의 루틴 삭제
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

    // 모든 루틴 리스트를 들고옴(필요없음)
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

    // 특정 날짜 루틴 들고오기
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

    // 오늘 날짜로 루틴 받아오기
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
            // console.log(data);
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

    // 특정 루틴의 done 상태를 변경
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

    // 어제 했던 루틴들을 들고와서 undone 상태 + 오늘 날짜로 새로 데이터 생성
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
                    res.status(500).json({
                        result : 'error occured',
                        error: e
                    })
                    throw error;  // 필요시 중단
                }
            }
            res.json({
                result : 'done'
            })
        } catch (e) {
            console.log('error', e);
            res.status(500).json({
                result : 'error occured',
                error: e
            })
        }
    },

    delete_old_routines: async(req, res)=>{
        const now = new Date();
        const kst = new Date(now.getTime() + 9 *60 *60 *1000);
        const days7before = new Date(kst.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString();
        
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
    },



    // Daily Todo 관련

    // 새로운 오늘 할 일 생성
    createNewDailyTodo : async (req, res)=>{
        const newDailyTodo = req.body;

        const title = newDailyTodo['title'];
        const isToday = newDailyTodo['isToday'];

        const today = new Date();
        let kst;
        // datetime만해서 오늘 날짜 만들고, isToday면 
        if(!isToday){
            kst = new Date(today.getTime() + 33 * 60*60*1000);
        }else{
            kst = new Date(today.getTime() + 9 * 60*60*1000);
        }

        const {data, error} = await supabase.from('daily_todo').insert([{title : title, created_at : kst }]);

         if(error){
            console.log('❌ 오류 발생(500) : Daily Todo 생성')
            console.log(error);
            res.status(500).json({
                status : 500,
                message : 'error occured while adding new daily Todo item',
            })
        }else{
            console.log('✅ 새로운 Daily Todo 생성 완료')
            res.status(200).json({
                status : 200,
                message : 'new Daily Routine created Successfully',
                data : title
            })
        }
    },


    // 특정 날짜의 오늘 할 일 목록 들고오기
    getSingleDayDailyTodo : async(req, res)=>{
        const date = req.params.date; // date 포멧 : yyyy-mm-dd

        const {data, error} = await supabase.from('daily_todo').select('*').gte('created_at', `${date}T00:00:000Z`).lt('created_at',`${date}T23:59:59.999Z`)

        if(error){
            console.log('❌ 오류 발생(500) : Daily Todo 불러오기')
            console.log(error);
            res.status(500).json({
                status : 500,
                message : 'error occured while getting daily Todo list',
            })
        }else{
            console.log('✅ Daily Todo 불러오기 완료')
            res.status(200).json({
                status : 200,
                message : 'Loaded Daily Todo Item successfully',
                data : data
            })
        }
    },

    // 특정 오늘 할 일 수정
    editSingleDailyTodoItem : async (req, res)=>{
        const id = req.params.todoId;
        const input = req.body;

        const {data, error} = await supabase.from('daily_todo').update({title : input['title']}).eq('id', id);
        
        if(error){
            console.log('❌ 오류 발생(500) : Daily Todo 수정')
            console.log(error);
            res.status(500).json({
                status : 500,
                message : 'error occured while editing daily Todo item',
            })
        }else{
            console.log('✅ Daily Todo 수정 완료')
            res.status(200).json({
                status : 200,
                message : 'Edited Daily Todo Item successfully',
                data : input['title']
            })
        }  
    },

    // 특정 오늘 할 일 아이템 삭제
    deleteSingleDailyTodoItem : async (req, res)=>{
        const id = req.params.todoId;

        const {data, error} = await supabase.from('daily_todo').delete('*').eq('id', id);

        if(error){
            console.log('❌ 오류 발생(500) : Daily Todo 삭제')
            console.log(error);
            res.status(500).json({
                status : 500,
                message : 'error occured while deleting daily Todo item',
            })
        }else{
            console.log('✅ Daily Todo 삭제 완료')
            res.status(200).json({
                status : 200,
                message : 'deleted Daily Todo Item successfully',
                data : id
            })
        }  
    },

    patchDailyTodoStatus : async(req, res)=>{
        const id = req.params.todoId;
        const currentState = req.body;

        try{
            const {data, error} = await supabase.rpc('toggle_daily_todo', {_id : id}).single();

            if(error) throw error;
            
            console.log('✅ Daily Todo 상태 변경 완료')
            res.status(200).json({
                status : 200,
                message : 'Daily Todo item Status Changed Successfully',
                data : data
            })
        }catch(error){
            console.log('❌ 오류 발생(500) : Daily Todo 상태 변경')
            console.log(error);
            res.status(500).json({
                status : 500,
                message : 'error occured while changing daily Todo item status',
            })
        }
    },


    // 단일 routine + todo 리스트 +  Allocation 
    getSingleDayDailyAllocation : async (req, res)=>{
        // 특정 날짜의 routine + Daily_todo 테이블을 합쳐서 보기
        const date = req.params.date;

        try{
            const {data, error} = await supabase.rpc('merge_daily_table', {_date : date});

            if(error) throw error;

            var doneCount = 0;
            var unDoneCount = 0;

            for(var item of data){
                if(item['is_done']){
                    doneCount +=1;
                }else{
                    unDoneCount += 1;
                }
            }

            console.log('✅ Daily Allocation 전송 완료')
            res.status(200).json({
                status : 200,
                message : 'Daily Allocation Sent Successfully',
                data : {
                    data, doneCount, unDoneCount
                }
            })
        }catch(error){
            console.log('❌ 오류 발생(500) : Allocation 가져오기')
            console.log(error);
            res.status(500).json({
                status : 500,
                message : 'error occured while loading daily allocation',
                
            })

        }       
    }

}