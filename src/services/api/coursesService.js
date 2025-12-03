import { toast } from "react-toastify";
import React from "react";
import { getApperClient } from "@/services/apperClient";

const coursesService = {
  async getAll() {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "course_code_c"}}, 
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "faculty_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('course_c', params);
      
      if (!response.success) {
        console.error("Failed to fetch courses:", response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching courses:", error?.response?.data?.message || error.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "course_code_c"}}, 
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "faculty_c"}}
        ]
      };

      const response = await apperClient.getRecordById('course_c', parseInt(id), params);
      
      if (!response.success) {
        console.error("Failed to fetch course:", response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching course:", error?.response?.data?.message || error.message || error);
      return null;
    }
  },

  async create(courseData) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          name_c: courseData.name_c,
          course_code_c: courseData.course_code_c,
          credits_c: parseInt(courseData.credits_c),
          semester_c: courseData.semester_c,
          description_c: courseData.description_c,
          department_c: parseInt(courseData.department_c),
          faculty_c: parseInt(courseData.faculty_c)
        }]
      };

      const response = await apperClient.createRecord('course_c', params);
      
      if (!response.success) {
        console.error("Failed to create course:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} course records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Course created successfully");
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating course:", error?.response?.data?.message || error.message || error);
      return null;
    }
  },

  async update(id, courseData) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          name_c: courseData.name_c,
          course_code_c: courseData.course_code_c,
          credits_c: parseInt(courseData.credits_c),
          semester_c: courseData.semester_c,
          description_c: courseData.description_c,
          department_c: parseInt(courseData.department_c),
          faculty_c: parseInt(courseData.faculty_c)
        }]
      };

      const response = await apperClient.updateRecord('course_c', params);
      
      if (!response.success) {
        console.error("Failed to update course:", response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} course records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Course updated successfully");
          return successful[0].data;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating course:", error?.response?.data?.message || error.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = await getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('course_c', params);
      
      if (!response.success) {
        console.error("Failed to delete course:", response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} course records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success("Course deleted successfully");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting course:", error?.response?.data?.message || error.message || error);
      return false;
    }
  }
};

export default coursesService;