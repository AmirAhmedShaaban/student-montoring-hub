import API from "./axiosConfig";

/**
 * Fetches the list of all students with their basic administrative data
 * @returns {Promise<{success: boolean, data: Array, message?: string}>}
 */
export async function getAllStudents() {
  try {
    const response = await API.get("/Students");

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
      message:
        error.response?.data?.message ||
        "Server connection error while fetching students.",
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
      message:
        response.data?.message ||
        `Failed to load profile for student ID: ${id}`,
    };
  } catch (error) {
    console.error(`Error fetching student ID ${id}:`, error);
    return {
      success: false,
      data: null,
      message:
        error.response?.data?.message ||
        "Server connection error while fetching student profile.",
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
    const response = await API.get(`/Students/${id}/attendance`);

    if (response.data && response.data.succeeded) {
      return {
        success: true,
        data: response.data.data, // Returns the array of attendance records
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
        error.response?.data?.message ||
        "Server connection error while fetching attendance.",
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
    const response = await API.get(`/Students/${id}/grades`);

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
      message:
        error.response?.data?.message ||
        "Server connection error while fetching grades.",
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
    const response = await API.get(`/Students/${id}/behavior`);

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
        error.response?.data?.message ||
        "Server connection error while fetching behavior logs.",
    };
  }
}

/**
 * Adds a new note/recommendation to a specific student's profile
 * @param {string|number} studentId - The unique ID of the student
 * @param {Object} noteData - The note details
 * @param {number} noteData.userID - The ID of the user (teacher/counselor) creating the note
 * @param {string} noteData.noteText - The content of the note (Must be >= 10 characters)
 * @param {string} noteData.noteType - The category of the note (e.g., Academic, Behavior)
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
      message:
        error.response?.data?.message ||
        "Server error while adding student note.",
      data: null,
    };
  }
}

/**
 * Updates an existing student note by its noteId
 * @param {string|number} noteId - The unique ID of the note to be updated
 * @param {Object} noteData - The updated note details
 * @param {string} noteData.noteText - The updated content (Must be >= 10 characters)
 * @param {string} noteData.noteType - Must be one of: 'Reading', 'Assignment', 'Assessment'
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
      message:
        error.response?.data?.message ||
        "Server error while updating student note.",
      data: null,
    };
  }
}
