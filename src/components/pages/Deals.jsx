import React, { useState } from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { toast } from "react-toastify"
import useDeals from "@/hooks/useDeals"
import DataTable from "@/components/organisms/DataTable"
import SearchBar from "@/components/molecules/SearchBar"
import Modal from "@/components/molecules/Modal"
import ConfirmationDialog from "@/components/molecules/ConfirmationDialog"
import FormField from "@/components/molecules/FormField"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import Select from "@/components/atoms/Select"
import Badge from "@/components/atoms/Badge"
import Card from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import ErrorView from "@/components/ui/ErrorView"
import Empty from "@/components/ui/Empty"

const Deals = () => {
  const { deals, loading, error, loadDeals, createDeal, updateDeal, deleteDeal } = useDeals()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDeal, setEditingDeal] = useState(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    value: "",
    currency: "USD",
    status: "pending",
    priority: "medium",
    category: "business",
    startDate: "",
    expectedCloseDate: "",
    actualCloseDate: ""
  })

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = 
      deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || deal.status === statusFilter
    const matchesPriority = !priorityFilter || deal.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleEdit = (deal) => {
    setEditingDeal(deal)
    setFormData({
      name: deal.name,
      description: deal.description || "",
      clientName: deal.clientName,
      clientEmail: deal.clientEmail || "",
      clientPhone: deal.clientPhone || "",
      value: deal.value.toString(),
      currency: deal.currency,
      status: deal.status,
      priority: deal.priority,
      category: deal.category,
      startDate: deal.startDate || "",
      expectedCloseDate: deal.expectedCloseDate || "",
      actualCloseDate: deal.actualCloseDate || ""
    })
    setIsModalOpen(true)
  }

  const handleDelete = (deal) => {
    setDeleteConfirmation(deal)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingDeal) {
        await updateDeal(editingDeal.Id, formData)
        toast.success("Deal updated successfully!")
      } else {
        await createDeal(formData)
        toast.success("Deal created successfully!")
      }
      setIsModalOpen(false)
      resetForm()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const confirmDelete = async () => {
    if (!deleteConfirmation) return
    
    try {
      await deleteDeal(deleteConfirmation.Id)
      toast.success("Deal deleted successfully!")
      setDeleteConfirmation(null)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const resetForm = () => {
    setEditingDeal(null)
    setFormData({
      name: "",
      description: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      value: "",
      currency: "USD",
      status: "pending",
      priority: "medium",
      category: "business",
      startDate: "",
      expectedCloseDate: "",
      actualCloseDate: ""
    })
  }

  const renderStatusBadge = (status) => {
    const variants = {
      pending: "warning",
      active: "info",
      completed: "success",
      cancelled: "destructive"
    }
    return <Badge variant={variants[status] || "default"}>{status}</Badge>
  }

  const renderPriorityBadge = (priority) => {
    const variants = {
      high: "destructive",
      medium: "warning",
      low: "default"
    }
    return <Badge variant={variants[priority] || "default"}>{priority}</Badge>
  }

const formatCurrency = (value, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(value)
  }

  const formatSafeDate = (dateValue) => {
    if (!dateValue) return "N/A"
    
    const date = new Date(dateValue)
    if (isNaN(date.getTime())) return "N/A"
    
    try {
      return format(date, "MMM d, yyyy")
    } catch (error) {
      return "N/A"
    }
  }

  const columns = [
    {
      key: "name",
      label: "Deal",
      sortable: true,
      render: (_, deal) => (
        <div className="space-y-1">
          <p className="font-medium text-slate-900">{deal.name}</p>
          <p className="text-sm text-slate-500">{deal.clientName}</p>
        </div>
      )
    },
    {
      key: "value",
      label: "Value",
      sortable: true,
      render: (value, deal) => (
        <span className="font-medium text-green-700">
          {formatCurrency(value, deal.currency)}
        </span>
      )
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (status) => renderStatusBadge(status)
    },
    {
      key: "priority",
      label: "Priority",
      sortable: true,
      render: (priority) => renderPriorityBadge(priority)
    },
{
      key: "startDate",
      label: "Start Date",
      sortable: true,
      render: (date) => formatSafeDate(date)
    },
    {
      key: "expectedCloseDate",
      label: "Expected Close",
      sortable: true,
      render: (date) => formatSafeDate(date)
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (category) => (
        <span className="capitalize text-slate-700">{category}</span>
      )
    }
  ]

  if (loading) return <Loading />
  if (error) return <ErrorView error={error} onRetry={loadDeals} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                Deals Management
              </h1>
              <p className="text-slate-600 mt-1">Track and manage business deals and partnerships</p>
            </div>
            <Button
              variant="primary"
              icon="Plus"
              onClick={() => {
                resetForm()
                setIsModalOpen(true)
              }}
              className="mt-4 sm:mt-0"
            >
              Add Deal
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <Card.Content className="py-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <SearchBar
                    placeholder="Search deals..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="sm:w-48"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Select>
                  <Select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="sm:w-48"
                  >
                    <option value="">All Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </Select>
                </div>
              </div>
            </Card.Content>
          </Card>
        </motion.div>

        {/* Deals Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredDeals.length === 0 ? (
            <Empty
              title="No deals found"
              description="Start by adding your first business deal to the system."
              action={() => {
                resetForm()
                setIsModalOpen(true)
              }}
              actionLabel="Add First Deal"
              icon="Handshake"
            />
          ) : (
            <DataTable
              data={filteredDeals}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              loading={loading}
            />
          )}
        </motion.div>

        {/* Add/Edit Deal Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            resetForm()
          }}
          title={editingDeal ? "Edit Deal" : "Add New Deal"}
          size="xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Deal Information */}
              <FormField label="Deal Name" required className="md:col-span-2">
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter deal name"
                />
              </FormField>

              <FormField label="Description" className="md:col-span-2">
                <textarea
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deal description..."
                />
              </FormField>

              {/* Client Information */}
              <FormField label="Client Name" required>
                <Input
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  required
                  placeholder="Client company name"
                />
              </FormField>

              <FormField label="Client Email">
                <Input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  placeholder="client@company.com"
                />
              </FormField>

              <FormField label="Client Phone">
                <Input
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </FormField>

              {/* Deal Details */}
              <FormField label="Deal Value" required>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    required
                    placeholder="0.00"
                    className="flex-1"
                  />
                  <Select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-20"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </Select>
                </div>
              </FormField>

              <FormField label="Status" required>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </FormField>

              <FormField label="Priority" required>
                <Select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  required
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Select>
              </FormField>

              <FormField label="Category" required>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="technology">Technology</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="software">Software</option>
                  <option value="security">Security</option>
                  <option value="facilities">Facilities</option>
                  <option value="sustainability">Sustainability</option>
                  <option value="business">Business</option>
                  <option value="partnership">Partnership</option>
                </Select>
              </FormField>

              {/* Dates */}
              <FormField label="Start Date">
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </FormField>

              <FormField label="Expected Close Date">
                <Input
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                />
              </FormField>

              {formData.status === 'completed' || formData.status === 'cancelled' ? (
                <FormField label="Actual Close Date">
                  <Input
                    type="date"
                    value={formData.actualCloseDate}
                    onChange={(e) => setFormData({ ...formData, actualCloseDate: e.target.value })}
                  />
                </FormField>
              ) : null}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingDeal ? "Update Deal" : "Add Deal"}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation */}
        <ConfirmationDialog
          isOpen={!!deleteConfirmation}
          onClose={() => setDeleteConfirmation(null)}
          onConfirm={confirmDelete}
          title="Delete Deal"
          message={`Are you sure you want to delete "${deleteConfirmation?.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
        />
      </div>
    </div>
  )
}

export default Deals