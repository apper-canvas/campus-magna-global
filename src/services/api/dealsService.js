import dealsData from '@/services/mockData/deals.json'

// Create a working copy of the data
let deals = [...dealsData]

const dealsService = {
  // Get all deals
  getAll: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...deals] // Return copy to prevent direct mutation
  },

  // Get deal by ID
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const deal = deals.find(d => d.Id === parseInt(id))
    if (!deal) {
      throw new Error('Deal not found')
    }
    return { ...deal }
  },

  // Create new deal
  create: async (dealData) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // Validation
    if (!dealData.name || !dealData.clientName || !dealData.value) {
      throw new Error('Name, client name, and value are required')
    }

    const newDeal = {
      ...dealData,
      Id: Math.max(...deals.map(d => d.Id)) + 1,
      value: parseFloat(dealData.value),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    deals.push(newDeal)
    return { ...newDeal }
  },

  // Update existing deal
  update: async (id, dealData) => {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = deals.findIndex(d => d.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Deal not found')
    }

    // Validation
    if (!dealData.name || !dealData.clientName || !dealData.value) {
      throw new Error('Name, client name, and value are required')
    }

    const updatedDeal = {
      ...deals[index],
      ...dealData,
      value: parseFloat(dealData.value),
      updatedAt: new Date().toISOString()
    }

    deals[index] = updatedDeal
    return { ...updatedDeal }
  },

  // Delete deal
  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = deals.findIndex(d => d.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Deal not found')
    }

    deals.splice(index, 1)
    return { success: true }
  },

  // Get deals by status
  getByStatus: async (status) => {
    await new Promise(resolve => setTimeout(resolve, 250))
    return deals.filter(d => d.status === status)
  },

  // Get deals statistics
  getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const totalDeals = deals.length
    const activeDeals = deals.filter(d => d.status === 'active').length
    const completedDeals = deals.filter(d => d.status === 'completed').length
    const totalValue = deals.reduce((sum, d) => sum + d.value, 0)
    const activeValue = deals
      .filter(d => d.status === 'active')
      .reduce((sum, d) => sum + d.value, 0)

    return {
      totalDeals,
      activeDeals,
      completedDeals,
      totalValue,
      activeValue,
      averageValue: totalDeals > 0 ? totalValue / totalDeals : 0
    }
  }
}

export default dealsService