interface Todo {
  id: number
  text: string
  completed: boolean
}

interface CreateTodoRequest {
  text: string
  completed: boolean
}

class TodoService {
  async fetchTodos(): Promise<Todo[]> {
    try {
      const response = await fetch('/todos')
      if (!response.ok) throw new Error('Failed to fetch')
      return await response.json()
    } catch (error) {
      throw new Error('Failed to fetch todos')
    }
  }

  async createTodo(todo: CreateTodoRequest): Promise<Todo> {
    try {
      const response = await fetch('/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
      })
      if (!response.ok) throw new Error('Failed to create')
      return await response.json()
    } catch (error) {
      throw new Error('Failed to create todo')
    }
  }

  async updateTodo(id: number, updates: Partial<Todo>): Promise<Todo> {
    try {
      const response = await fetch(`/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      if (!response.ok) throw new Error('Failed to update')
      return await response.json()
    } catch (error) {
      throw new Error('Failed to update todo')
    }
  }

  async deleteTodo(id: number): Promise<void> {
    try {
      const response = await fetch(`/todos/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete')
    } catch (error) {
      throw new Error('Failed to delete todo')
    }
  }
}

export const todoService = new TodoService()
export type { Todo, CreateTodoRequest }
