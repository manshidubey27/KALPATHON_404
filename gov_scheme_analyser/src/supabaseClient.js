import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tudpgjnfjemwcjyfpkay.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1ZHBnam5mamVtd2NqeWZwa2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzODM0NzksImV4cCI6MjA1OTk1OTQ3OX0.QXR4yjSA__yTB2zeagFMmeiVtXPC72jlWNxIg8mXKKY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
