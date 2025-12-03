import tasksData from "@/services/mockData/tasks.json"

let tasks = [...tasksData]

const tasksService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...tasks]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const task = tasks.find(t => t.Id === parseInt(id))
    if (!task) {
      throw new Error("Task not found")
    }
    return { ...task }
  },

  async create(taskData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const newId = Math.max(...tasks.map(t => t.Id)) + 1
    const newTask = {
      Id: newId,
      ...taskData,
      createdAt: new Date().toISOString().split('T')[0]
    }
    tasks.push(newTask)
    return { ...newTask }
  },

  async update(id, taskData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Task not found")
    }
    tasks[index] = { ...tasks[index], ...taskData }
    return { ...tasks[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = tasks.findIndex(t => t.Id === parseInt(id))
    if (index === -1) {
      throw new Error("Task not found")
    }
    const deletedTask = tasks.splice(index, 1)[0]
    return { ...deletedTask }
  },

  async getByStatus(status) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return tasks.filter(t => t.status === status).map(t => ({ ...t }))
  },

  async getByPriority(priority) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return tasks.filter(t => t.priority === priority).map(t => ({ ...t }))
  },

  async getByAssignedTo(assignedTo) {
    await new Promise(resolve => setTimeout(resolve, 250))
    return tasks.filter(t => t.assignedTo === assignedTo).map(t => ({ ...t }))
  },

  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const lowerQuery = query.toLowerCase()
    return tasks.filter(t => 
      t.title.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.assignedTo.toLowerCase().includes(lowerQuery)
    ).map(t => ({ ...t }))
  },

  async getUpcoming(days = 7) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const today = new Date()
    const futureDate = new Date(today.getTime() + (days * 24 * 60 * 60 * 1000))
    
    return tasks.filter(t => {
      const dueDate = new Date(t.dueDate)
      return dueDate >= today && dueDate <= futureDate && t.status !== 'Completed' && t.status !== 'Cancelled'
    }).map(t => ({ ...t }))
  }
}

export default tasksService