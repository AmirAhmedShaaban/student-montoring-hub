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
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function createTrendLabel(riskLevel, disciplineIncidents) {
  if (disciplineIncidents >= 12 || riskLevel === "High") {
    return "Immediate support needed";
  }

  if (disciplineIncidents >= 5 || riskLevel === "Medium") {
    return "Monitor closely";
  }

  return "On track";
}

export function buildStudentProfile(student) {
  const disciplineIncidents = student.negativeBehaviors ?? 0;
  const attendanceRate = Math.max(
    82,
    Math.min(
      99,
      98 - disciplineIncidents * 1.5 + (student.positiveBehaviors ?? 0) * 0.1,
    ),
  );
  const gpa = Math.max(
    1.8,
    Math.min(
      4,
      3.85 -
        disciplineIncidents * 0.08 +
        (student.positiveBehaviors ?? 0) * 0.01,
    ),
  );

  const recentIncidents = (student.behaviorHistory ?? []).map(
    (incident, index) => ({
      id: `${student.id}-incident-${index}`,
      date: formatDate(incident.date),
      title: incident.description,
      category:
        incident.behavior === "Negative"
          ? "Discipline"
          : "Positive reinforcement",
      type: incident.behavior,
    }),
  );

  return {
    id: student.id,
    name: student.name,
    email: student.email,
    grade: student.grade,
    className: student.class,
    initials: getInitials(student.name),
    riskLevel: student.riskLevel,
    enrollmentDate: formatDate(student.enrollmentDate),
    attendanceRate,
    attendanceDetail:
      attendanceRate >= 95
        ? "Excellent attendance with minimal absences."
        : "Attendance is stable, with room to improve consistency.",
    gpa,
    gpaDetail:
      gpa >= 3.5
        ? "Strong academic standing and consistent output."
        : "Grades are holding steady with a few areas to reinforce.",
    disciplineIncidents,
    disciplineTrend: createTrendLabel(student.riskLevel, disciplineIncidents),
    recentIncidents,
    notes: fallbackNotes,
    lastUpdated: formatDate(new Date()),
  };
}
