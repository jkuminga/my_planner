const { supabase } = require("./db");
const { format } = require('date-fns');

module.exports = {
    createTodaysWater : async(req, res)=>{

        const today = format(new Date(), 'yyyy-MM-dd');

        const {data : todaysIntake, error: readError} = await supabase.from('water').select('*').gte('date', `${today}T00:00:00.000Z`).lt('date', `${today}T23:59:59.999Z`);

        if(todaysIntake.length != 0){
            console.log("Today's water intake is already exist!");
            return res.status(501).json({
                result : "Today's water intake is already exist!"
            })
        }

        const {data, error} = await supabase.from('water').insert();

        if(error){
            console.log(error);
            res.status(500).json({
                result : 'error occured',
                error : error
            })
        }else{
            res.status(200).json({
                result : 'done'
            })
        }
    },

    addTodaysIntake: async(req, res)=>{
        const intake = req.body;
        const today = format(new Date(), 'yyyy-MM-dd');

        const {data : todaysIntake, error: readError} = await supabase.from('water').select('*').gte('date', `${today}T00:00:00.000Z`).lt('date', `${today}T23:59:59.999Z`);
        
        if(readError){
            console.log(readError);
            return res.status(501).json({
                result : 'error occured',
                error : readError
            })
        }


        const newIntake = parseInt(todaysIntake[0]['amount'])  + parseInt(intake['intake']);
        console.log('newIntake', newIntake);

        const { data  : updateResult, error: updateError } = await supabase.from('water').update({amount : newIntake}).gte('date', `${today}T00:00:00.000Z`).lt('date', `${today}T23:59:59.999Z`);

        if(updateError){
            console.log(updateError);
            res.status(500).json({
                result : 'error occured',
                error : updateError
            })
        }else{
            res.status(200).json({
                result : 'done'
            })
        }
    },

    getWaterIntake : async(req, res)=> {
        const date = req.params.date;
        // const today = format(new Date(), 'yyyy-MM-dd');

        const {data, error} = await supabase.from('water').select('*').gte('date', `${date}T00:00:00.000Z`).lt('date', `${date}T23:59:59.999Z`);

        const dailyIntake = data[0]['amount'];
        console.log(dailyIntake);

        if(error){
            console.log(error);
            res.status(500).json({
                result : 'error occured',
                error : error
            })
        }else{
            res.status(200).json({
                intake : dailyIntake
            });
        }
    },

    getHistory :  async(req, res)=>{

        const {data, error} = await supabase.from('water').select('*')

        if(error){
            console.log(error);
            res.status(500).json({
                result : 'error occured',
                error : error
            })
        }else{
            res.json(data)
        }
        
    }


}