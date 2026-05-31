import axios from "axios";
import API from "./axiosConfig";

/* ------------------------------------------------------------------ */
/*  Admin Profile                                                      */
/* ------------------------------------------------------------------ */

export async function getAdminProfile(userId) {
  try {
    const response = await API.get(`/Setting/admin-profile/${userId}`);
    if (response.data && response.data.succeeded) {
      return { success: true, data: response.data.data };
    }

    const status = response.status;
    const msg = response.data?.message || "";
    if (status === 404 || msg === "User not found") {
      return {
        success: false,
        data: null,
        message:
          "Your account profile is not available yet. Please contact the system administrator.",
      };
    }

    return {
      success: false,
      data: null,
      message: msg || "Failed to load profile.",
    };
  } catch (error) {
    const status = error.response?.status;
    const msg = error.response?.data?.message || "";

    if (status === 404 || msg === "User not found") {
      return {
        success: false,
        data: null,
        message:
          "Your account profile is not available yet. Please contact the system administrator.",
      };
    }

    return {
      success: false,
      data: null,
      message: msg || "Server error fetching profile.",
    };
  }
}

export async function updateAdminProfile(userId, payload) {
  try {
    const response = await API.put(`/Setting/admin-profile/${userId}`, payload);
    if (response.data && response.data.succeeded) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    return {
      success: false,
      message: response.data?.message || "Failed to update profile.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Server error updating profile.",
    };
  }
}

/* ------------------------------------------------------------------ */
/*  Password                                                           */
/* ------------------------------------------------------------------ */

export async function changeUserPassword(userId, payload) {
  try {
    const response = await API.post(
      `/Setting/change-password/${userId}`,
      payload,
    );
    if (response.data && response.data.succeeded) {
      return { success: true, message: response.data.message };
    }
    return {
      success: false,
      message: response.data?.message || "Failed to change password.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Server error changing password.",
    };
  }
}

/* ------------------------------------------------------------------ */
/*  Profile Picture                                                    */
/* ------------------------------------------------------------------ */

export async function uploadProfilePicture(userId, formData) {
  try {
    // Use the correct token key from axiosConfig.js
    const token = localStorage.getItem("student-behavior-dashboard-token");

    // Use base 'axios' to avoid the default 'application/json' header from the API instance.
    // This allows the browser to automatically set 'multipart/form-data' with the correct boundary.
    const response = await axios.post(
      `http://studentmonitor.runasp.net/api/Setting/profile-picture/${userId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data && response.data.succeeded) {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    }
    return {
      success: false,
      message: response.data?.message || "Failed to upload picture.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Server error uploading picture.",
    };
  }
}

export async function deleteProfilePicture(userId) {
  try {
    const response = await API.delete(`/Setting/profile-picture/${userId}`);
    if (response.data && response.data.succeeded) {
      return { success: true, message: response.data.message };
    }
    return {
      success: false,
      message: response.data?.message || "Failed to delete picture.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Server error deleting picture.",
    };
  }
}

/* ------------------------------------------------------------------ */
/*  Account                                                            */
/* ------------------------------------------------------------------ */

export async function deleteAccount(id) {
  try {
    const response = await API.delete(`/Setting/account/${id}`);
    if (response.data && response.data.succeeded) {
      return { success: true, message: response.data.message };
    }
    return {
      success: false,
      message: response.data?.message || "Failed to delete account.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Server error deleting account.",
    };
  }
}
