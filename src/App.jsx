import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // TODO: Replace with actual API call

      // fake network call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      setTodos([
        { id: 1, text: 'completed todo', completed: true },
        { id: 2, text: 'todo 1', completed: false },
        { id: 3, text: 'todo 2', completed: false },
        { id: 5, text: 'todo 3', completed: false }
      ])
    } catch (err) {
      setError('Failed to load todos')
      console.error('Error fetching todos:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (inputValue.trim() && !isSaving) {
      try {
        setIsSaving(true)

        const newTodo = {
          text: inputValue,
          completed: false
        }

        // TODO: Replace with API call

        // fake network call delay
        await new Promise(resolve => setTimeout(resolve, 2000))
        const savedTodo = { ...newTodo, id: Date.now() }

        setTodos([...todos, savedTodo])
        setInputValue('')
      } catch (err) {
        setError('Failed to add todo')
        console.error('Error adding todo:', err)
      } finally {
        setIsSaving(false)
      }
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Todo App</h1>
      </header>
      <main className="app-main">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading todos...</p>
          </div>
        ) : (
            <>
              <form className="todo-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  className="todo-input"
                  placeholder="What needs to be done?"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isSaving}
                />
                <button
                  type="submit"
                  className="todo-button"
                  disabled={isSaving}
                >
                  {isSaving ? 'Adding...' : 'Add'}
                </button>
              </form>

              {todos.length === 0 ? (
                <div className="empty-state">
                  <p>No todos yet.</p>
                </div>
              ) : (
                  <ul className="todo-list">
                    {todos.map(todo => (
                      <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                        <span className="todo-text">{todo.text}</span>
                      </li>
                    ))}
                  </ul>
                )}
            </>
          )}
      </main>
    </div>
  )
}

export default App
