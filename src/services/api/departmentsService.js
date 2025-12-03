import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const departmentsService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "code_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "head_c"}},
          {"field": {"Name": "building_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "budget_c"}},
          {"field": {"Name": "established_year_c"}},
          {"field": {"Name": "student_count_c"}},
          {"field": {"Name": "faculty_count_c"}},
          {"field": {"Name": "status_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('department_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching departments:", error?.response?.data?.message || error);
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "code_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "head_c"}},
          {"field": {"Name": "building_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "budget_c"}},
          {"field": {"Name": "established_year_c"}},
          {"field": {"Name": "student_count_c"}},
          {"field": {"Name": "faculty_count_c"}},
          {"field": {"Name": "status_c"}}
        ]
      };

      const response = await apperClient.getRecordById('department_c', parseInt(id), params);
      return response.data;
    } catch (error) {
      console.error(`Error fetching department ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(departmentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          name_c: departmentData.name_c,
          code_c: departmentData.code_c,
          description_c: departmentData.description_c,
          head_c: parseInt(departmentData.head_c),
          building_c: departmentData.building_c,
          phone_c: departmentData.phone_c,
          email_c: departmentData.email_c,
          budget_c: parseFloat(departmentData.budget_c),
          established_year_c: parseInt(departmentData.established_year_c),
          student_count_c: parseInt(departmentData.student_count_c) || 0,
          faculty_count_c: parseInt(departmentData.faculty_count_c) || 0,
          status_c: departmentData.status_c
        }]
      };

      const response = await apperClient.createRecord('department_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} departments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating department:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, departmentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          name_c: departmentData.name_c,
          code_c: departmentData.code_c,
          description_c: departmentData.description_c,
          head_c: parseInt(departmentData.head_c),
          building_c: departmentData.building_c,
          phone_c: departmentData.phone_c,
          email_c: departmentData.email_c,
          budget_c: parseFloat(departmentData.budget_c),
          established_year_c: parseInt(departmentData.established_year_c),
          student_count_c: parseInt(departmentData.student_count_c),
          faculty_count_c: parseInt(departmentData.faculty_count_c),
          status_c: departmentData.status_c
        }]
      };

      const response = await apperClient.updateRecord('department_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} departments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating department:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('department_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} departments:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting department:", error?.response?.data?.message || error);
      return false;
    }
  }
}