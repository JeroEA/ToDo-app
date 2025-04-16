import React, { useState, useEffect } from 'react';
import supabase from './helper/supabaseClient';

function App() {


    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');

    useEffect(() => {
      fetchTodos();
    },[])

    async function fetchTodos() {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order ('created_at', { ascending: true });
      if (error) console.error('Error fetching todos:', error);
      else setTodos(data);
    }

    async function addTodo() {
      if (!title.trim()) return;
      const { error } = await supabase
        .from('todos')
        .insert([{ title }])
        if (error) console.error('Error adding todo:', error);
        else {
          setTitle('');
          fetchTodos();
        }
      }

      async function completeTodo(id) {
        await supabase.from('todos')
          .update({
            completed: true,
            completed_at: new Date().toISOString()
          })
          .eq('id', id);
        fetchTodos();
      }
      

    async function deleteTodo(id) {
      await supabase.from('todos')
        .delete()
        .eq('id', id);
      fetchTodos();
    }
    
    return (
      <div className="todo-container">
  <h1>Todo List</h1>
  <input
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    placeholder="Add a new todo"
  />
  <button onClick={addTodo}>Add Todo</button>

  <h2>Incomplete</h2>
  <div>
    {todos.filter(t => !t.completed).map((todo) => (
      <div className="todo-item" key={todo.id}>
        <div>
          <h3>{todo.title}</h3>
          <p className="todo-meta">
            {new Date(todo.created_at).toLocaleString()}
          </p>
        </div>
        <div>
          <button onClick={() => completeTodo(todo.id)}>Complete</button>
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </div>
      </div>
    ))}
  </div>

  <h2>Completed</h2>
  <div>
    {todos.filter(t => t.completed).map((todo) => (
      <div className="todo-item todo-completed" key={todo.id}>
        <div>
          <h3>{todo.title}</h3>
          <p className="todo-meta">
            Creado: {new Date(todo.created_at).toLocaleString()}<br />
            Completado: {new Date(todo.completed_at).toLocaleString()}
          </p>
        </div>
        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
      </div>
    ))}
  </div>
</div>


  );
}
export default App;