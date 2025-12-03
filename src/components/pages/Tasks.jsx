import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import useTasks from "@/hooks/useTasks"
import DataTable from "@/components/organisms/DataTable"
import Modal from "@/components/molecules/Modal"
import Button from "@/components/atoms/Button"
import Card, { CardHeader, CardContent } from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import FormField from "@/components/molecules/FormField"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import ConfirmationDialog from "@/components/molecules/ConfirmationDialog"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import ApperIcon from "@/components/ApperIcon"

const Tasks = () => {
  const { tasks, loading, error, loadTasks, createTask, updateTask, deleteTask, searchTasks } = useTasks()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, taskId: null })
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [priorityFilter, setPriorityFilter] = useState("All")
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
    assignedTo: ""
  })

  const statusOptions = ["All", "Pending", "In Progress", "Completed", "Cancelled"]
  const priorityOptions = ["All", "Low", "Medium", "High"]

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Completed":
        return "status-completed"
      case "In Progress":
        return "status-enrolled"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200"
      case "Cancelled":
        return "status-dropped"
      default:
        return "status-inactive"
    }
  }

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border border-red-200"
      case "Medium":
        return "bg-blue-100 text-blue-800 border border-blue-200"
      case "Low":
        return "bg-gray-100 text-gray-800 border border-gray-200"
      default:
        return "status-inactive"
    }
  }

  const columns = [
    {
      key: "title",
      label: "Title",
      render: (task) => (
        <div className="font-medium text-slate-900">
          {task.title}
        </div>
      )
    },
    {
      key: "description",
      label: "Description",
      render: (task) => (
        <div className="text-sm text-slate-600 max-w-xs truncate">
          {task.description}
        </div>
      )
    },
    {
      key: "priority",
      label: "Priority",
      render: (task) => (
        <Badge className={`${getPriorityBadgeClass(task.priority)} px-2 py-1 text-xs font-medium rounded-full`}>
          {task.priority}
        </Badge>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (task) => (
        <Badge className={`${getStatusBadgeClass(task.status)} px-2 py-1 text-xs font-medium rounded-full`}>
          {task.status}
        </Badge>
      )
    },
    {
      key: "dueDate",
      label: "Due Date",
      render: (task) => (
        <div className="text-sm text-slate-600">
          {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )
    },
    {
      key: "assignedTo",
      label: "Assigned To",
      render: (task) => (
        <div className="text-sm text-slate-600">
          {task.assignedTo}
        </div>
      )
    }
  ]

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === "All" || task.status === statusFilter
    const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter
    return matchesStatus && matchesPriority
  })

  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (query.trim()) {
      await searchTasks(query)
    } else {
      await loadTasks()
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "Medium",
      status: "Pending",
      dueDate: "",
      assignedTo: ""
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error("Task title is required")
      return
    }

    try {
      if (editingTask) {
        await updateTask(editingTask.Id, formData)
        toast.success("Task updated successfully")
      } else {
        await createTask(formData)
        toast.success("Task created successfully")
      }
      
      setIsModalOpen(false)
      setEditingTask(null)
      resetForm()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      assignedTo: task.assignedTo
    })
    setIsModalOpen(true)
  }

  const handleDelete = (taskId) => {
    setDeleteConfirmation({ isOpen: true, taskId })
  }

  const confirmDelete = async () => {
    try {
      await deleteTask(deleteConfirmation.taskId)
      toast.success("Task deleted successfully")
      setDeleteConfirmation({ isOpen: false, taskId: null })
    } catch (err) {
      toast.error(err.message)
    }
  }

  const openCreateModal = () => {
    setEditingTask(null)
    resetForm()
    setIsModalOpen(true)
  }

  if (loading) return <Loading />
  if (error) return <ErrorView error={error} onRetry={loadTasks} />

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Task Management</h1>
          <p className="text-slate-600">Manage and track institutional tasks</p>
        </div>
        <Button onClick={openCreateModal} className="bg-primary-600 hover:bg-primary-700 text-white">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Select>
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                {priorityOptions.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredTasks}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
          resetForm()
        }}
        title={editingTask ? "Edit Task" : "Create Task"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Title" required>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title"
            />
          </FormField>

          <FormField label="Description">
            <textarea
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Priority">
              <Select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Select>
            </FormField>

            <FormField label="Status">
              <Select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </Select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Due Date" required>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </FormField>

            <FormField label="Assigned To" required>
              <Input
                type="text"
                value={formData.assignedTo}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                placeholder="Enter assignee"
              />
            </FormField>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                setEditingTask(null)
                resetForm()
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary-600 hover:bg-primary-700 text-white">
              {editingTask ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, taskId: null })}
        onConfirm={confirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
      />
    </motion.div>
  )
}

export default Tasks