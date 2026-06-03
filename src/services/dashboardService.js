import API from "./axiosConfig";

/**
 * Get main dashboard statistics.
 * Backend response shape: { succeeded, message, data: { ...stats } }
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
 * Get a single attendance count by type.
 * Backend returns the count as a raw number in `data` (e.g. data: 7).
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
 * Get all attendance counts (present, absent, late) at once.
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
 * Get a student's academic information.
 * Backend response shape: { succeeded, message, data: { fullName, averageGPA, topThreeSubjects, ... } }
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

/**
 * Get behavior summary (used for Risk Distribution & Most Incidents).
 * Backend response shape: { succeeded, message, data: [ { studentName, totalIncidents, ... } ] }
 */
export async function getBehaviorSummary() {
  try {
    const response = await API.get("/Behavior/summary");
    if (response.data && response.data.succeeded) {
      return {
        success: true,
        data: response.data.data,
      };
    }
    return {
      success: false,
      message: response.data?.message || "Failed to fetch behavior summary",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Server error fetching behavior summary",
    };
  }
}

/**
 * Get attendance summary (used for Attendance Distribution).
 * Backend response shape: { succeeded, message, data: [ { studentName, attendancePercentage, ... } ] }
 */
export async function getAttendanceSummary() {
  try {
    const response = await API.get("/Attendance/summary");
    if (response.data && response.data.succeeded) {
      return {
        success: true,
        data: response.data.data,
      };
    }
    return {
      success: false,
      message: response.data?.message || "Failed to fetch attendance summary",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Server error fetching attendance summary",
    };
  }
}

/**
 * Get grades average (used for Grades Distribution & Top Performers).
 * Backend response shape: { succeeded, message, data: [ { studentName, averageScore, ... } ] }
 */
export async function getGradesAverage() {
  try {
    const response = await API.get("/grades/average");
    if (response.data && response.data.succeeded) {
      return {
        success: true,
        data: response.data.data,
      };
    }
    return {
      success: false,
      message: response.data?.message || "Failed to fetch grades average",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Server error fetching grades average",
    };
  }
}
