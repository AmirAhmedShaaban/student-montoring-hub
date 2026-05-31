// src/services/dashboardService.js

import API from "./axiosConfig";

/**
 * Get main dashboard statistics
 */
export async function getDashboardStats() {
  try {
    const response = await API.get("/Dashboard/stats");

    if (response.data && response.data.succeeded) {
      return {
        success: true,
        data: response.data.data,
      };
    }

    return {
      success: false,
      message: response.data?.message || "Failed to fetch dashboard stats",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Server error fetching dashboard stats",
    };
  }
}

/**
 * Get attendance count (present, absent, late)
 * @param {string} type - "present" | "absent" | "late"
 */
export async function getAttendanceCount(type) {
  try {
    const endpoint = `/Dashboard/attendanceCount/${type}`;
    const response = await API.get(endpoint);

    if (response.data && response.data.succeeded) {
      return {
        success: true,
        count: response.data.data,
      };
    }

    return {
      success: false,
      count: 0,
    };
  } catch (error) {
    return {
      success: false,
      count: 0,
    };
  }
}

/**
 * Get all attendance counts at once
 */
export async function getAllAttendanceCounts() {
  try {
    const [present, absent, late] = await Promise.all([
      getAttendanceCount("present"),
      getAttendanceCount("absent"),
      getAttendanceCount("late"),
    ]);

    return {
      success: true,
      data: {
        present: present.count || 0,
        absent: absent.count || 0,
        late: late.count || 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      data: { present: 0, absent: 0, late: 0 },
    };
  }
}

/**
 * Get student academic information
 * @param {number} studentId
 */
export async function getStudentAcademic(studentId) {
  try {
    const response = await API.get(`/Dashboard/student/${studentId}/academic`);

    if (response.data && response.data.succeeded) {
      return {
        success: true,
        data: response.data.data,
      };
    }

    return {
      success: false,
      message: response.data?.message || "Failed to fetch academic data",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Server error fetching academic data",
    };
  }
}
