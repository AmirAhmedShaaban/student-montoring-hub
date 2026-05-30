const fallbackNotes = [
  {
    id: "note-fallback-1",
    author: "Advisory team",
    category: "Check-in",
    text: "Maintaining steady attendance and showing stronger participation in class discussions.",
    timestamp: new Date("2026-04-10T09:00:00"),
  },
  {
    id: "note-fallback-2",
    author: "Counselor",
    category: "Follow-up",
    text: "Reinforce on-time arrival and praise consistent homework completion.",
    timestamp: new Date("2026-04-08T10:30:00"),
  },
];

export const NOTES_CATEGORIES = [
  "Check-in",
  "Family outreach",
  "Counselor follow-up",
  "Intervention",
];

export const STUDENT_PROFILE_TABS = [
  { id: "overview", label: "Overview" },
  { id: "behavior", label: "Behavior" },
  { id: "notes", label: "Notes" },
];

function formatDate(value) {
  if (!value) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getInitials(name) {
  if (!name) return "??";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function createTrendLabel(riskLevel, disciplineIncidents) {
  if (disciplineIncidents >= 5 || riskLevel === "High") {
    return "Immediate support needed";
  }
  if (disciplineIncidents >= 2 || riskLevel === "Medium") {
    return "Monitor closely";
  }
  return "On track";
}

/**
 * Adapter utility to transform raw API responses into a unified student profile object for the UI
 * @param {Object} student - Basic administrative data from GET /api/Students/{id}
 * @param {Array} attendanceList - Attendance logs from GET /api/Students/{id}/attendance
 * @param {Array} gradesList - Academic grades from GET /api/Students/{id}/grades
 * @param {Array} behaviorList - Behavior incidents from GET /api/Students/{id}/behavior
 */
export function buildStudentProfile(
  student,
  attendanceList = [],
  gradesList = [],
  behaviorList = [],
) {
  if (!student) return null;

  // 1. Calculate Real Attendance Rate based on status (1 = Present, 0 = Absent)
  const totalDays = attendanceList.length;
  const presentDays = attendanceList.filter(
    (record) => record.status === 1,
  ).length;
  const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 100;

  // 2. Calculate Real Academic Average (Scores are out of 100 from backend)
  const totalSubjects = gradesList.length;
  const totalScores = gradesList.reduce(
    (sum, item) => sum + (item.score || 0),
    0,
  );
  const academicAverage = totalSubjects > 0 ? totalScores / totalSubjects : 0;

  // Keep GPA presentation happy by mapping average to a standard 4.0 scale roughly for the UI value
  const simulatedGpa = totalSubjects > 0 ? (academicAverage / 100) * 4 : 4.0;

  // 3. Process Behavior Incidents
  const disciplineIncidents = behaviorList.length;
  const recentIncidents = behaviorList.map((incident) => ({
    id: `incident-${incident.incidentID}`,
    date: formatDate(incident.occurredAt),
    title: incident.detail || "No details provided",
    category: `Reported by ${incident.source || "System"}`,
    type: incident.reviewStatus === 1 ? "Negative" : "Pending Review", // Mapping status enum safely
  }));

  return {
    id: student.studentID,
    name: student.fullName,
    email: `${student.fullName?.toLowerCase().replace(/\s+/g, ".")}@school.edu`, // Fallback elegant email generation
    grade: student.grade,
    className: `Section ${student.section || "N/A"}`,
    initials: getInitials(student.fullName),
    riskLevel: student.isActive ? "Low" : "High", // Temporary mapping until AI endpoint hooks up riskLevel
    enrollmentDate: formatDate(`${student.academicYear}-09-01`), // Dynamic baseline fallback
    attendanceRate,
    attendanceDetail:
      attendanceRate >= 90
        ? "Excellent attendance with minimal absences."
        : "Attendance is fluctuating, requiring consistency monitoring.",
    gpa: simulatedGpa,
    gpaDetail:
      academicAverage >= 85
        ? `Strong academic standing with an average score of ${academicAverage.toFixed(1)}%.`
        : `Grades are holding at ${academicAverage.toFixed(1)}% average. Needs targeted reinforcement.`,
    disciplineIncidents,
    disciplineTrend: createTrendLabel(
      student.isActive ? "Low" : "High",
      disciplineIncidents,
    ),
    recentIncidents,
    notes: fallbackNotes, // Keeps current structure, will bind backend update/post dynamically next
    lastUpdated: formatDate(new Date()),
  };
}
