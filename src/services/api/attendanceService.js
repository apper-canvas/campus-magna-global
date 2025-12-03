import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
export const attendanceService = {
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
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "time_in_c"}},
          {"field": {"Name": "time_out_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "marked_by_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "week_number_c"}},
          {"field": {"Name": "class_duration_c"}},
          {"field": {"Name": "excused_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('attendance_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching attendance:", error?.response?.data?.message || error);
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
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "time_in_c"}},
          {"field": {"Name": "time_out_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "marked_by_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "week_number_c"}},
          {"field": {"Name": "class_duration_c"}},
          {"field": {"Name": "excused_c"}}
        ]
      };

      const response = await apperClient.getRecordById('attendance_c', parseInt(id), params);
      return response.data;
    } catch (error) {
      console.error(`Error fetching attendance ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(attendanceData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          student_c: parseInt(attendanceData.student_c),
          course_c: parseInt(attendanceData.course_c),
          date_c: attendanceData.date_c,
          status_c: attendanceData.status_c,
          time_in_c: attendanceData.time_in_c,
          time_out_c: attendanceData.time_out_c,
          notes_c: attendanceData.notes_c,
          marked_by_c: parseInt(attendanceData.marked_by_c),
          semester_c: attendanceData.semester_c,
          week_number_c: parseInt(attendanceData.week_number_c),
          class_duration_c: parseInt(attendanceData.class_duration_c),
          excused_c: attendanceData.excused_c === true
        }]
      };

      const response = await apperClient.createRecord('attendance_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} attendance records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating attendance:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, attendanceData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          student_c: parseInt(attendanceData.student_c),
          course_c: parseInt(attendanceData.course_c),
          date_c: attendanceData.date_c,
          status_c: attendanceData.status_c,
          time_in_c: attendanceData.time_in_c,
          time_out_c: attendanceData.time_out_c,
          notes_c: attendanceData.notes_c,
          marked_by_c: parseInt(attendanceData.marked_by_c),
          semester_c: attendanceData.semester_c,
          week_number_c: parseInt(attendanceData.week_number_c),
          class_duration_c: parseInt(attendanceData.class_duration_c),
          excused_c: attendanceData.excused_c === true
        }]
      };

      const response = await apperClient.updateRecord('attendance_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} attendance records:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating attendance:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('attendance_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} attendance records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting attendance:", error?.response?.data?.message || error);
      return false;
    }
  }
}