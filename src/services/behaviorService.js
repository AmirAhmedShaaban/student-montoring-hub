import API from "./axiosConfig";

/**
 * Fetch all AI behavior rules registered in the system
 * @returns {Promise<{success: boolean, data: Array, message: string}>}
 */
export async function getAllBehaviorRules() {
  try {
    const response = await API.get("/BehaviorRule");
    if (response.data && response.data.succeeded) {
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message,
      };
    }
    return {
      success: false,
      data: [],
      message: response.data?.message || "Failed to fetch rules.",
    };
  } catch (error) {
    console.error("Error in getAllBehaviorRules:", error);
    return {
      success: false,
      data: [],
      message:
        error.response?.data?.message ||
        "Server error fetching behavior rules.",
    };
  }
}

/**
 * Fetch a specific behavior rule by its ID
 * @param {number|string} ruleId
 */
export async function getBehaviorRuleById(ruleId) {
  try {
    const response = await API.get(`/BehaviorRule/${ruleId}`);
    if (response.data && response.data.succeeded) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    return {
      success: false,
      data: null,
      message: response.data?.message || "Rule not found.",
    };
  } catch (error) {
    console.error(`Error in getBehaviorRuleById (${ruleId}):`, error);
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message || "Server error fetching rule details.",
    };
  }
}

/**
 * Create a brand new behavior rule (AI detection label)
 * @param {Object} ruleData
 * @param {string} ruleData.ruleName - e.g., "Using Phone"
 * @param {string} ruleData.description - What this rule detects
 * @param {string} ruleData.category - e.g., "General"
 * @param {number} ruleData.severityLevel - Intensity rank (1 to 5)
 * @param {number} ruleData.createdByUserID - Active admin/user ID
 */
export async function createBehaviorRule(ruleData) {
  try {
    const response = await API.post("/BehaviorRule", ruleData);
    if (response.data && response.data.succeeded) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    return {
      success: false,
      data: null,
      message: response.data?.message || "Failed to create rule.",
    };
  } catch (error) {
    console.error("Error creating behavior rule:", error);
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message || "Server error creating behavior rule.",
    };
  }
}

/**
 * Update an existing behavior rule data
 * @param {Object} ruleData - Must include ruleID
 */
export async function updateBehaviorRule(ruleData) {
  try {
    const response = await API.put("/BehaviorRule", ruleData);
    if (response.data && response.data.succeeded) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    return {
      success: false,
      data: null,
      message: response.data?.message || "Failed to update rule.",
    };
  } catch (error) {
    console.error("Error updating behavior rule:", error);
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message || "Server error updating behavior rule.",
    };
  }
}

/**
 * Toggle active status of a rule (Active/Inactive) using PATCH
 * @param {number|string} ruleId
 */
export async function toggleBehaviorRuleStatus(ruleId) {
  try {
    const response = await API.patch(`/BehaviorRule/${ruleId}/toggle`);
    if (response.data && response.data.succeeded) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    return {
      success: false,
      message: response.data?.message || "Failed to toggle rule state.",
    };
  } catch (error) {
    console.error(`Error toggling behavior rule ${ruleId}:`, error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Server error during patch toggle.",
    };
  }
}

/**
 * Delete a behavior rule permanently from the system
 * @param {number|string} ruleId
 */
export async function deleteBehaviorRule(ruleId) {
  try {
    const response = await API.delete(`/BehaviorRule/${ruleId}`);
    if (response.data && response.data.succeeded) {
      return {
        success: true,
        message: response.data.message || "Deleted successfully.",
      };
    }
    return {
      success: false,
      message: response.data?.message || "Failed to delete rule.",
    };
  } catch (error) {
    console.error(`Error deleting behavior rule ${ruleId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || "Server error deleting rule.",
    };
  }
}
