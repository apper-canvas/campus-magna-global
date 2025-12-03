import { useState, useEffect } from 'react'
import dealsService from '@/services/api/dealsService'

const useDeals = () => {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load all deals
  const loadDeals = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await dealsService.getAll()
      setDeals(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Create new deal
  const createDeal = async (dealData) => {
    const newDeal = await dealsService.create(dealData)
    setDeals(prev => [...prev, newDeal])
    return newDeal
  }

  // Update existing deal
  const updateDeal = async (id, dealData) => {
    const updatedDeal = await dealsService.update(id, dealData)
    setDeals(prev => prev.map(deal => 
      deal.Id === id ? updatedDeal : deal
    ))
    return updatedDeal
  }

  // Delete deal
  const deleteDeal = async (id) => {
    await dealsService.delete(id)
    setDeals(prev => prev.filter(deal => deal.Id !== id))
  }

  // Get deal by ID
  const getDealById = async (id) => {
    return await dealsService.getById(id)
  }

  // Get deals statistics
  const getDealsStats = async () => {
    return await dealsService.getStats()
  }

  // Initial load
  useEffect(() => {
    loadDeals()
  }, [])

  return {
    deals,
    loading,
    error,
    loadDeals,
    createDeal,
    updateDeal,
    deleteDeal,
    getDealById,
    getDealsStats
  }
}

export default useDeals