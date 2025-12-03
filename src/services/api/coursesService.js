import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const coursesService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "course_code_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "max_students_c"}},
          {"field": {"Name": "enrolled_count_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "schedule_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('course_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching courses:", error?.response?.data?.message || error);
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
          {"field": {"Name": "course_code_c"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "instructor_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "max_students_c"}},
          {"field": {"Name": "enrolled_count_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "schedule_c"}}
        ]
      };

      const response = await apperClient.getRecordById('course_c', parseInt(id), params);
      return response.data;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(courseData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          course_code_c: courseData.course_code_c,
          title_c: courseData.title_c,
          description_c: courseData.description_c,
          credits_c: parseInt(courseData.credits_c),
          department_c: parseInt(courseData.department_c),
          instructor_c: parseInt(courseData.instructor_c),
          semester_c: courseData.semester_c,
          year_c: parseInt(courseData.year_c),
          max_students_c: parseInt(courseData.max_students_c),
          enrolled_count_c: parseInt(courseData.enrolled_count_c) || 0,
          status_c: courseData.status_c,
          schedule_c: courseData.schedule_c
        }]
      };

      const response = await apperClient.createRecord('course_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} courses:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating course:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, courseData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          course_code_c: courseData.course_code_c,
          title_c: courseData.title_c,
          description_c: courseData.description_c,
          credits_c: parseInt(courseData.credits_c),
          department_c: parseInt(courseData.department_c),
          instructor_c: parseInt(courseData.instructor_c),
          semester_c: courseData.semester_c,
          year_c: parseInt(courseData.year_c),
          max_students_c: parseInt(courseData.max_students_c),
          enrolled_count_c: parseInt(courseData.enrolled_count_c),
          status_c: courseData.status_c,
          schedule_c: courseData.schedule_c
        }]
      };

      const response = await apperClient.updateRecord('course_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} courses:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating course:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('course_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} courses:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting course:", error?.response?.data?.message || error);
      return false;
    }
  }
};