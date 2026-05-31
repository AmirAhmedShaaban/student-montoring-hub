import axios from "axios";
import API from "./axiosConfig";

/* ------------------------------------------------------------------ */
/*  Admin Profile                                                      */
/* ------------------------------------------------------------------ */

export async function getAdminProfile() {
  try {
    const response = await API.get("/Setting/admin-profile");
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

export async function updateAdminProfile(payload) {
  try {
    // To solve 415 Unsupported Media Type, we explicitly set the Content-Type header
    const response = await API.put("/Setting/admin-profile", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

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

export async function changeUserPassword(payload) {
  try {
    const response = await API.post("/Setting/change-password", payload);

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

export async function uploadProfilePicture(formData) {
  try {
    const token = localStorage.getItem("student-behavior-dashboard-token");
    const response = await axios.post(
      `http://studentmonitor.runasp.net/api/Setting/profile-picture`,
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

export async function deleteProfilePicture() {
  try {
    const response = await API.delete("/Setting/profile-picture");
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

export async function deleteAccount() {
  try {
    const response = await API.delete("/Setting/account");

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
