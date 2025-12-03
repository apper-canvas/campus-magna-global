import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const dealsService = {
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
          {"field": {"Name": "contact_name_c"}},
          {"field": {"Name": "contact_email_c"}},
          {"field": {"Name": "contact_phone_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "source_c"}},
          {"field": {"Name": "owner_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_date_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('deal_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error);
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
          {"field": {"Name": "contact_name_c"}},
          {"field": {"Name": "contact_email_c"}},
          {"field": {"Name": "contact_phone_c"}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_date_c"}},
          {"field": {"Name": "source_c"}},
          {"field": {"Name": "owner_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_date_c"}}
        ]
      };

      const response = await apperClient.getRecordById('deal_c', parseInt(id), params);
      return response.data;
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(dealData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          title_c: dealData.title_c,
          description_c: dealData.description_c,
          contact_name_c: dealData.contact_name_c,
          contact_email_c: dealData.contact_email_c,
          contact_phone_c: dealData.contact_phone_c,
          value_c: parseFloat(dealData.value_c),
          stage_c: dealData.stage_c,
          probability_c: parseInt(dealData.probability_c),
          expected_close_date_c: dealData.expected_close_date_c,
          source_c: dealData.source_c,
          owner_c: parseInt(dealData.owner_c),
          notes_c: dealData.notes_c,
          created_date_c: dealData.created_date_c || new Date().toISOString().split('T')[0]
        }]
      };

      const response = await apperClient.createRecord('deal_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} deals:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, dealData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error("ApperClient not initialized");
      }

      const params = {
        records: [{
          Id: parseInt(id),
          title_c: dealData.title_c,
          description_c: dealData.description_c,
          contact_name_c: dealData.contact_name_c,
          contact_email_c: dealData.contact_email_c,
          contact_phone_c: dealData.contact_phone_c,
          value_c: parseFloat(dealData.value_c),
          stage_c: dealData.stage_c,
          probability_c: parseInt(dealData.probability_c),
          expected_close_date_c: dealData.expected_close_date_c,
          source_c: dealData.source_c,
          owner_c: parseInt(dealData.owner_c),
          notes_c: dealData.notes_c,
          created_date_c: dealData.created_date_c
        }]
      };

      const response = await apperClient.updateRecord('deal_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} deals:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('deal_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} deals:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error);
      return false;
    }
}
};