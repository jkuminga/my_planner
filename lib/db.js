// import { createClient} from '@supabase/supabase-js';
const {createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = 'https://rpweulgkeulxqiqdruxg.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = {supabase};
