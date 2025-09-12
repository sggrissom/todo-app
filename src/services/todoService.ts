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
      // TODO: Replace with actual API call
      // fake network call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      return [
        { id: 1, text: 'completed todo', completed: true },
        { id: 2, text: 'todo 1', completed: false },
        { id: 3, text: 'todo 2', completed: false },
        { id: 5, text: 'todo 3', completed: false }
      ]
    } catch (error) {
      throw new Error('Failed to fetch todos')
    }
  }

  async createTodo(todo: CreateTodoRequest): Promise<Todo> {
    try {
      // TODO: Replace with actual API call
      // fake network call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      return { ...todo, id: Date.now() }
    } catch (error) {
      throw new Error('Failed to create todo')
    }
  }

  async updateTodo(id: number, updates: Partial<Todo>): Promise<Todo> {
    try {
      // TODO: Replace with actual API call
      // fake network call delay
      await new Promise(resolve => setTimeout(resolve, 500))

      return { id, ...updates } as Todo
    } catch (error) {
      throw new Error('Failed to update todo')
    }
  }

  async deleteTodo(id: number): Promise<void> {
    try {
      // TODO: Replace with actual API call to delete todo
      // fake network call delay
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      throw new Error('Failed to delete todo')
    }
  }
}

export const todoService = new TodoService()
export type { Todo, CreateTodoRequest }
