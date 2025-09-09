import './App.css'

function App() {
  // TODO: load from API call
  const todos = [
    { id: 1, text: 'completed todo', completed: true },
    { id: 2, text: 'todo 1', completed: false },
    { id: 3, text: 'todo 2', completed: false },
    { id: 5, text: 'todo 3', completed: false }
  ]

  return (
    <div className="app">
      <header className="app-header">
        <h1>Todo App</h1>
      </header>
      <main className="app-main">
        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <span className="todo-text">{todo.text}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

export default App
