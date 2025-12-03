import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

const enrollmentService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        fields: [
          {"field": {"Name": "student_c"}},
          {"field": {"Name": "course_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "attendance_percentage_c"}},
          {"field": {"Name": "midterm_grade_c"}},
          {"field": {"Name": "final_grade_c"}},
          {"field": {"Name": "completion_date_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('enrollment_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching enrollments:", error?.response?.data?.message || error);
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
          {"field": {"Name": "student_c"}},
          {"field": {"Name": "course_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "year_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "attendance_percentage_c"}},
          {"field": {"Name": "midterm_grade_c"}},
          {"field": {"Name": "final_grade_c"}},
          {"field": {"Name": "completion_date_c"}}
        ]
      };

      const response = await apperClient.getRecordById('enrollment_c', parseInt(id), params);
      return response.data;
    } catch (error) {
      console.error(`Error fetching enrollment ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(enrollmentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          student_c: parseInt(enrollmentData.student_c),
          course_c: parseInt(enrollmentData.course_c),
          enrollment_date_c: enrollmentData.enrollment_date_c,
          grade_c: enrollmentData.grade_c,
          status_c: enrollmentData.status_c,
          semester_c: enrollmentData.semester_c,
          year_c: parseInt(enrollmentData.year_c),
          credits_c: parseInt(enrollmentData.credits_c),
          attendance_percentage_c: parseFloat(enrollmentData.attendance_percentage_c) || 0,
          midterm_grade_c: enrollmentData.midterm_grade_c,
          final_grade_c: enrollmentData.final_grade_c,
          completion_date_c: enrollmentData.completion_date_c
        }]
      };

      const response = await apperClient.createRecord('enrollment_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} enrollments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating enrollment:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, enrollmentData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          student_c: parseInt(enrollmentData.student_c),
          course_c: parseInt(enrollmentData.course_c),
          enrollment_date_c: enrollmentData.enrollment_date_c,
          grade_c: enrollmentData.grade_c,
          status_c: enrollmentData.status_c,
          semester_c: enrollmentData.semester_c,
          year_c: parseInt(enrollmentData.year_c),
          credits_c: parseInt(enrollmentData.credits_c),
          attendance_percentage_c: parseFloat(enrollmentData.attendance_percentage_c),
          midterm_grade_c: enrollmentData.midterm_grade_c,
          final_grade_c: enrollmentData.final_grade_c,
          completion_date_c: enrollmentData.completion_date_c
        }]
      };

      const response = await apperClient.updateRecord('enrollment_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} enrollments:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating enrollment:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('enrollment_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} enrollments:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting enrollment:", error?.response?.data?.message || error);
      return false;
    }
  }
};

export default enrollmentService;