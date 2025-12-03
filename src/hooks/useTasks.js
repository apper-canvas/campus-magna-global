import { useState, useEffect } from "react"
import tasksService from "@/services/api/tasksService"

const useTasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadTasks = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await tasksService.getAll()
      setTasks(data)
    } catch (err) {
      setError(err.message || "Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const createTask = async (taskData) => {
    try {
      const newTask = await tasksService.create(taskData)
      setTasks(prev => [...prev, newTask])
      return newTask
    } catch (err) {
      throw new Error(err.message || "Failed to create task")
    }
  }

  const updateTask = async (id, taskData) => {
    try {
      const updatedTask = await tasksService.update(id, taskData)
      setTasks(prev => prev.map(t => t.Id === parseInt(id) ? updatedTask : t))
      return updatedTask
    } catch (err) {
      throw new Error(err.message || "Failed to update task")
    }
  }

  const deleteTask = async (id) => {
    try {
      await tasksService.delete(id)
      setTasks(prev => prev.filter(t => t.Id !== parseInt(id)))
    } catch (err) {
      throw new Error(err.message || "Failed to delete task")
    }
  }

  const searchTasks = async (query) => {
    try {
      setLoading(true)
      const results = await tasksService.search(query)
      setTasks(results)
    } catch (err) {
      setError(err.message || "Failed to search tasks")
    } finally {
      setLoading(false)
    }
  }

  return {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    searchTasks
  }
}

export default useTasks