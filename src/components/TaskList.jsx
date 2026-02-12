import { useEffect, useState } from 'react' 
import { supabase } from '../supabaseClient'

function TaskList() {
    const [tasks, setTasks] = useState([]) // Memory for our data
    const [loading, setLoading] = useState(true) // Loading state
    const [error, setError] = useState(null) // Error state

    useEffect(()=> {
        fetchTasks();
    },[])
    
    async function fetchTasks() {
        try {
            setLoading(true);

            const {data, error} = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false }) // Sort by newest
            console.log(data);
            if (error) throw error;
            if (data.length === 0) throw {message: "Blocked by Policy"}

            setTasks(data);
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            <p className="text-xl">Loading your tasks...</p>
        </div>
    );
    if (error) return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            <p className="text-red-500 text-xl">Error: {error}</p>
        </div>
    );

    console.log(tasks)

    return ( 
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {tasks.map((task) => (
                    <div key={task.id} className="border border-slate-700 p-4 rounded-xl shadow-lg bg-slate-800">
                        {task.image_url && <img src={task.image_url} alt={task.title} className="rounded-lg mb-4 w-full h-48 object-cover" />}
                        <h2 className="text-xl font-bold text-white">{task.title}</h2>
                        <p className="text-slate-300">{task.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TaskList;