import API from "./axiosConfig";

/**
 * Fetches the list of all students with their basic administrative data
 * @returns {Promise<{success: boolean, data: Array, message?: string}>}
 */
export async function getAllStudents() {
  try {
    const response = await API.get("Students/Get All");

    if (response.data && response.data.succeeded) {
      return {
        success: true,
        data: response.data.data,
      };
    }

    return {
      success: false,
      data: [],
      message: response.data?.message || "Failed to load students list.",
    };
  } catch (error) {
    console.error("Error fetching all students:", error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || "Server connection error.",
    };
  }
}

/**
 * Fetches a specific student's profile details by ID
 * @param {string|number} id - The unique ID of the student
 * @returns {Promise<{success: boolean, data: Object|null, message?: string}>}
 */
export async function getStudentById(id) {
  try {
    const response = await API.get(`/Students/${id}`);

    if (response.data && response.data.succeeded) {
      return {
        success: true,
        data: response.data.data,
      };
    }

    return {
      success: false,
      data: null,
      message: response.data?.message || `Student ID ${id} not found.`,
    };
  } catch (error) {
    console.error(`Error fetching student ID ${id}:`, error);
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message || "Server error fetching profile.",
    };
  }
}

/**
 * Fetches a specific student's attendance history by ID
 * @param {string|number} id - The unique ID of the student
 * @returns {Promise<{success: boolean, data: Array, message?: string}>}
 */
export async function getStudentAttendance(id) {
  try {
    const response = await API.get(`/Attendance/student/${id}`);

    if (response.data && response.data.succeeded) {
      return {
        success: true,
        data: response.data.data,
      };
    }

    return {
      success: false,
      data: [],
      message:
        response.data?.message ||
        `Failed to load attendance for student ID: ${id}`,
    };
  } catch (error) {
    console.error(`Error fetching attendance for student ID ${id}:`, error);
    return {
      success: false,
      data: [],
      message:
        error.response?.data?.message || "Server error fetching attendance.",
    };
  }
}

/**
 * Fetches attendance summary for all students
 * @returns {Promise<{success: boolean, data: Array, message?: string}>}
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
      data: [],
      message: response.data?.message || "Failed to load attendance summary.",
    };
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    return {
      success: false,
      data: [],
      message:
        error.response?.data?.message ||
        "Server error fetching attendance summary.",
    };
  }
}

/**
 * Fetches a specific student's academic grades by ID
 * @param {string|number} id - The unique ID of the student
 * @returns {Promise<{success: boolean, data: Array, message?: string}>}
 */
export async function getStudentGrades(id) {
  try {
    const response = await API.get(`/grades/student/${id}`);

    if (response.data && response.data.succeeded) {
      return {
        success: true,
        data: response.data.data,
      };
    }

    return {
      success: false,
      data: [],
      message:
        response.data?.message || `Failed to load grades for student ID: ${id}`,
    };
  } catch (error) {
    console.error(`Error fetching grades for student ID ${id}:`, error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || "Server error fetching grades.",
    };
  }
}

/**
 * Fetches grades average for all students
 * @returns {Promise<{success: boolean, data: Array, message?: string}>}
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
      data: [],
      message: response.data?.message || "Failed to load grades average.",
    };
  } catch (error) {
    console.error("Error fetching grades average:", error);
    return {
      success: false,
      data: [],
      message:
        error.response?.data?.message ||
        "Server error fetching grades average.",
    };
  }
}

/**
 * Fetches a specific student's behavior incidents and history by ID
 * @param {string|number} id - The unique ID of the student
 * @returns {Promise<{success: boolean, data: Array, message?: string}>}
 */
export async function getStudentBehavior(id) {
  try {
    const response = await API.get(`/Behavior/student/${id}`);

    if (response.data && response.data.succeeded) {
      return {
        success: true,
        data: response.data.data,
      };
    }

    return {
      success: false,
      data: [],
      message:
        response.data?.message ||
        `Failed to load behavior logs for student ID: ${id}`,
    };
  } catch (error) {
    console.error(`Error fetching behavior logs for student ID ${id}:`, error);
    return {
      success: false,
      data: [],
      message:
        error.response?.data?.message || "Server error fetching behavior.",
    };
  }
}

/**
 * Fetches behavior incidents summary for all students
 * @returns {Promise<{success: boolean, data: Array, message?: string}>}
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
      data: [],
      message: response.data?.message || "Failed to load behavior summary.",
    };
  } catch (error) {
    console.error("Error fetching behavior summary:", error);
    return {
      success: false,
      data: [],
      message:
        error.response?.data?.message ||
        "Server error fetching behavior summary.",
    };
  }
}

/**
 * Fetches all notes and filters them for a specific student
 * @param {string|number} studentId - The unique ID of the student
 * @returns {Promise<{success: boolean, data: Array, message?: string}>}
 */
export async function getStudentNotes(studentId) {
  try {
    const response = await API.get("Students/GetAllNotes");

    if (response.data && response.data.succeeded) {
      const allNotes = response.data.data || [];

      const studentNotes = allNotes
        .filter((note) => note.studentID === studentId)
        .map((note) => ({
          ...note,
          formattedDate: note.timestamp
            ? new Date(note.timestamp).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "N/A",
        }));

      return {
        success: true,
        data: studentNotes,
      };
    }

    return { success: false, data: [], message: "Failed to load notes." };
  } catch (error) {
    console.error(`Error fetching notes for student ID ${studentId}:`, error);
    return {
      success: false,
      data: [],
      message: "Server error fetching notes.",
    };
  }
}

/**
 * Adds a new note/recommendation to a specific student's profile
 * @param {string|number} studentId - The unique ID of the student
 * @param {Object} noteData - The note details
 * @returns {Promise<{success: boolean, message: string, data: Object|null}>}
 */
export async function addStudentNote(studentId, noteData) {
  try {
    const response = await API.post(`/Students/${studentId}/notes`, noteData);

    if (response.data && response.data.succeeded) {
      return {
        success: true,
        message: response.data.message || "Note added successfully.",
        data: response.data.data,
      };
    }

    return {
      success: false,
      message: response.data?.message || "Failed to add note.",
      data: null,
    };
  } catch (error) {
    console.error(`Error adding note for student ID ${studentId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || "Server error.",
      data: null,
    };
  }
}

/**
 * Updates an existing student note by its noteId
 * @param {string|number} noteId - The unique ID of the note to be updated
 * @param {Object} noteData - The updated note details
 * @returns {Promise<{success: boolean, message: string, data: Object|null}>}
 */
export async function updateStudentNote(noteId, noteData) {
  try {
    const response = await API.put(`/Students/notes/${noteId}`, noteData);

    if (response.data && response.data.succeeded) {
      return {
        success: true,
        message: response.data.message || "Note updated successfully.",
        data: response.data.data,
      };
    }

    return {
      success: false,
      message: response.data?.message || "Failed to update note.",
      data: null,
    };
  } catch (error) {
    console.error(`Error updating note ID ${noteId}:`, error);
    return {
      success: false,
      message: error.response?.data?.message || "Server error.",
      data: null,
    };
  }
}

/**
 * Adds a new student to the system.
 * POST /Students/AddStudent (multipart/form-data, includes ImageFile)
 *
 * The Content-Type header is set to undefined so the browser attaches the
 * correct multipart boundary automatically.
 *
 * @param {FormData} formData - Prebuilt FormData with the student fields + ImageFile.
 * @returns {Promise<{success: boolean, message: string, data: Object|null}>}
 */
export async function addStudent(formData) {
  try {
    const response = await API.post("/Students/AddStudent", formData, {
      headers: { "Content-Type": undefined },
    });

    if (response.data && response.data.succeeded) {
      // The endpoint returns the created student inside a data array.
      const created = Array.isArray(response.data.data)
        ? response.data.data[0]
        : response.data.data;

      return {
        success: true,
        message: response.data.message || "Student added successfully.",
        data: created || null,
      };
    }

    return {
      success: false,
      message: response.data?.message || "Failed to add student.",
      data: null,
    };
  } catch (error) {
    console.error("Error adding student:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Server error adding student.",
      data: null,
    };
  }
}

/**
 * Marks attendance via AI face recognition from a camera image.
 * POST /Attendance/mark (multipart/form-data)
 * Fields: CameraImage (binary), ScheduledTime (date-time), VideoSessionId (int)
 *
 * NOTE: This endpoint returns { success, message, data: {...} }
 * (uses "success", not the usual "succeeded" envelope).
 *
 * The Content-Type header is set to undefined so the browser attaches the
 * correct multipart boundary automatically.
 *
 * @param {Object} payload
 * @param {File} payload.cameraImage - The captured/uploaded image.
 * @param {string} payload.scheduledTime - ISO date-time string.
 * @param {number|string} payload.videoSessionId - The session identifier.
 * @returns {Promise<{success: boolean, message: string, data: Object|null}>}
 */
export async function markAttendance({
  cameraImage,
  scheduledTime,
  videoSessionId,
}) {
  try {
    const formData = new FormData();
    formData.append("CameraImage", cameraImage);
    formData.append("ScheduledTime", scheduledTime);
    formData.append("VideoSessionId", videoSessionId);

    const response = await API.post("/Attendance/mark", formData, {
      headers: { "Content-Type": undefined },
    });

    if (response.data && response.data.success) {
      return {
        success: true,
        message: response.data.message || "Attendance recorded.",
        data: response.data.data || null,
      };
    }

    return {
      success: false,
      message: response.data?.message || "Failed to mark attendance.",
      data: null,
    };
  } catch (error) {
    console.error("Error marking attendance:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.response?.data?.title ||
        "Server error marking attendance.",
      data: null,
    };
  }
}
