import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
export const tasksService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "assigned_by_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "estimated_hours_c"}},
          {"field": {"Name": "actual_hours_c"}},
          {"field": {"Name": "completion_date_c"}},
          {"field": {"Name": "file_attachments_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "assigned_to_c"}},
          {"field": {"Name": "assigned_by_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "estimated_hours_c"}},
          {"field": {"Name": "actual_hours_c"}},
          {"field": {"Name": "completion_date_c"}},
          {"field": {"Name": "file_attachments_c"}}
        ]
      };

      const response = await apperClient.getRecordById('task_c', parseInt(id), params);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          title_c: taskData.title_c,
          description_c: taskData.description_c,
          assigned_to_c: parseInt(taskData.assigned_to_c),
          assigned_by_c: parseInt(taskData.assigned_by_c),
          due_date_c: taskData.due_date_c,
          priority_c: taskData.priority_c,
          status_c: taskData.status_c,
          category_c: taskData.category_c,
          tags_c: taskData.tags_c,
          estimated_hours_c: parseFloat(taskData.estimated_hours_c),
          actual_hours_c: parseFloat(taskData.actual_hours_c) || 0,
          completion_date_c: taskData.completion_date_c,
          file_attachments_c: taskData.file_attachments_c || []
        }]
      };

      const response = await apperClient.createRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          title_c: taskData.title_c,
          description_c: taskData.description_c,
          assigned_to_c: parseInt(taskData.assigned_to_c),
          assigned_by_c: parseInt(taskData.assigned_by_c),
          due_date_c: taskData.due_date_c,
          priority_c: taskData.priority_c,
          status_c: taskData.status_c,
          category_c: taskData.category_c,
          tags_c: taskData.tags_c,
          estimated_hours_c: parseFloat(taskData.estimated_hours_c),
          actual_hours_c: parseFloat(taskData.actual_hours_c),
          completion_date_c: taskData.completion_date_c,
          file_attachments_c: taskData.file_attachments_c || []
        }]
      };

      const response = await apperClient.updateRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('task_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      return false;
    }
  }
};