import { toast } from "react-toastify";
import React from "react";
import { getApperClient } from "@/services/apperClient";

export const facultyService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "faculty_id_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "hire_date_c"}},
          {"field": {"Name": "salary_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "office_location_c"}},
          {"field": {"Name": "specialization_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('faculty_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching faculty:", error?.response?.data?.message || error);
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "faculty_id_c"}},
          {"field": {"Name": "position_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "hire_date_c"}},
          {"field": {"Name": "salary_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "office_location_c"}},
          {"field": {"Name": "specialization_c"}}
        ]
      };

      const response = await apperClient.getRecordById('faculty_c', parseInt(id), params);
      return response.data;
    } catch (error) {
      console.error(`Error fetching faculty ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(facultyData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          first_name_c: facultyData.first_name_c,
          last_name_c: facultyData.last_name_c,
          email_c: facultyData.email_c,
          phone_c: facultyData.phone_c,
          faculty_id_c: facultyData.faculty_id_c,
          position_c: facultyData.position_c,
          department_c: parseInt(facultyData.department_c),
          hire_date_c: facultyData.hire_date_c,
          salary_c: parseFloat(facultyData.salary_c),
          status_c: facultyData.status_c,
          office_location_c: facultyData.office_location_c,
          specialization_c: facultyData.specialization_c
        }]
      };

      const response = await apperClient.createRecord('faculty_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} faculty:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating faculty:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, facultyData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          first_name_c: facultyData.first_name_c,
          last_name_c: facultyData.last_name_c,
          email_c: facultyData.email_c,
          phone_c: facultyData.phone_c,
          faculty_id_c: facultyData.faculty_id_c,
          position_c: facultyData.position_c,
          department_c: parseInt(facultyData.department_c),
          hire_date_c: facultyData.hire_date_c,
          salary_c: parseFloat(facultyData.salary_c),
          status_c: facultyData.status_c,
          office_location_c: facultyData.office_location_c,
          specialization_c: facultyData.specialization_c
        }]
      };

      const response = await apperClient.updateRecord('faculty_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} faculty:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating faculty:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('faculty_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} faculty:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
} catch (error) {
      console.error("Error deleting faculty:", error?.response?.data?.message || error);
      return false;
    }
  }
};

export default facultyService;