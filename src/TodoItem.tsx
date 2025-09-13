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
  onEdit: (id: number, newText: string) => Promise<void>
}

function TodoItem({ todo, onDelete, onToggle, onEdit }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const [isSaving, setIsSaving] = useState(false)

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

  const handleEdit = async () => {
    if (editText.trim() === '') return
    if (editText.trim() === todo.text) {
      setIsEditing(false)
      return
    }

    try {
      setIsSaving(true)
      await onEdit(todo.id, editText.trim())
      setIsEditing(false)
    } catch (err) {
      console.error('Error editing todo:', err)
      setEditText(todo.text)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditText(todo.text)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
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
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="edit-input"
          autoFocus
          disabled={isSaving}
        />
      ) : (
        <span
          className="todo-text"
          onDoubleClick={() => setIsEditing(true)}
          title="Double-click to edit"
        >
          {todo.text}
        </span>
      )}

      {isEditing ? (
        <div className="todo-actions edit">
          <button
            className="save-button"
            onClick={handleEdit}
            disabled={isSaving || editText.trim() === ''}
          >
            {isSaving ? '...' : 'Save'}
          </button>
          <button
            className="cancel-button"
            onClick={handleCancelEdit}
            disabled={isSaving}
          >
            Cancel
          </button>
        </div>
      ) : showConfirm ? (
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
        <div className="todo-actions">
          <button
            className="edit-button"
            onClick={() => setIsEditing(true)}
            aria-label="Edit todo"
          >
            Edit
          </button>
          <button
            className="delete-button"
            onClick={() => setShowConfirm(true)}
            aria-label="Delete todo"
          >
            Delete
          </button>
        </div>
      )}
    </li>
  )
}

export default TodoItem
