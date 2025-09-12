import { useState, useEffect } from 'react'
import TodoItem from './TodoItem'
import { todoService, type Todo } from './services/todoService'
import './App.css'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const fetchedTodos = await todoService.fetchTodos()
      setTodos(fetchedTodos)
    } catch (err) {
      setError('Failed to load todos')
      console.error('Error fetching todos:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !isSaving) {
      try {
        setIsSaving(true)

        const newTodo = {
          text: inputValue,
          completed: false
        }

        const savedTodo = await todoService.createTodo(newTodo)
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

  const handleDelete = async (todoId: number) => {
    try {
      await todoService.deleteTodo(todoId)
      setTodos(todos.filter(todo => todo.id !== todoId))
    } catch (err) {
      setError('Failed to delete todo')
      console.error('Error deleting todo:', err)
    }
  }

  const handleToggle = async (todoId: number) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === todoId)
      if (!todoToUpdate) return

      const newCompleted = !todoToUpdate.completed
      setTodos(todos.map(todo =>
        todo.id === todoId
          ? { ...todo, completed: newCompleted }
          : todo
      ))

      await todoService.updateTodo(todoId, { completed: newCompleted })

    } catch (err) {
      setTodos(todos.map(todo =>
        todo.id === todoId
          ? { ...todo, completed: todoToUpdate.completed }
          : todo
      ))
      setError('Failed to update todo')
      console.error('Error updating todo:', err)
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
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onDelete={handleDelete}
                        onToggle={handleToggle}
                      />
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
