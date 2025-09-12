import { useState } from 'react'

interface Todo {
  id: number
  text: string
  completed: boolean
}

interface TodoItemProps {
  todo: Todo
  onDelete: (id: number) => Promise<void>
  onToggle: (id: number) => Promise<void>
}

function TodoItem({ todo, onDelete, onToggle }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await onDelete(todo.id)
      setShowConfirm(false)
    } catch (err) {
      console.error('Error deleting todo:', err)
      alert('Failed to delete todo')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggle = async () => {
    try {
      setIsToggling(true)
      await onToggle(todo.id)
    } catch (err) {
      console.error('Error toggling todo:', err)
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        disabled={isToggling}
        className="todo-checkbox"
      />
      <span className="todo-text">{todo.text}</span>

      {showConfirm ? (
        <div className="todo-actions confirm">
          <span className="confirm-text">Delete?</span>
          <button
            className="confirm-button yes"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? '...' : 'Yes'}
          </button>
          <button
            className="confirm-button no"
            onClick={() => setShowConfirm(false)}
            disabled={isDeleting}
          >
            No
          </button>
        </div>
      ) : (
          <button
            className="delete-button"
            onClick={() => setShowConfirm(true)}
            aria-label="Delete todo"
          >
            Delete
          </button>
        )}
    </li>
  )
}

export default TodoItem
