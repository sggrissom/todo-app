import { useState } from 'react'

function TodoItem({ todo, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      // TODO: delete API
      await new Promise(resolve => setTimeout(resolve, 500))

      onDelete(todo.id)
      setShowConfirm(false)
    } catch (err) {
      console.error('Error deleting todo:', err)
      alert('Failed to delete todo')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
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
