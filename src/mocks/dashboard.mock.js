export const dashboardMockData = {
  totalStudents: 250,
  positiveBehaviors: 1842,
  behavioralIssues: 145,
  studentsAtRisk: 23,
  summary: {
    note: "Attendance is stable, positive behavior reinforcement is strong, and the students at risk list has dropped this week.",
    monitoredToday: 214,
    improving: 61,
    honors: 88,
  },
  attendance: {
    rate: 94,
    present: 236,
    late: 8,
    absent: 6,
    trend: [96, 95, 94, 93, 95, 96, 94],
  },
  academicSnapshot: {
    averageGpa: 3.42,
    assessmentsCompleted: 92,
    assignmentsSubmitted: 87,
    readingGrowth: 14,
    mathGrowth: 9,
    topSubjects: [
      { subject: "Mathematics", score: "A-" },
      { subject: "Science", score: "B+" },
      { subject: "English", score: "A" },
    ],
  },
  quickActions: [
    {
      label: "Record behavior note",
      description: "Add a positive or corrective entry for a student.",
      href: "/behavior-management",
    },
    {
      label: "Open student profile",
      description: "Review attendance, interventions, and academic history.",
      href: "/students/1",
    },
    {
      label: "Review clustering",
      description: "See risk groups and intervention segments.",
      href: "/clustering",
    },
  ],
  behaviorLog: [
    {
      id: 1,
      student: "John Doe",
      type: "Positive",
      detail:
        "Helped a classmate during lab work and stayed on task throughout the lesson.",
      time: "8:35 AM",
    },
    {
      id: 2,
      student: "Jane Smith",
      type: "Watchlist",
      detail:
        "Arrived late to morning advisory and needs a follow-up attendance call.",
      time: "9:10 AM",
    },
    {
      id: 3,
      student: "Ava Johnson",
      type: "Positive",
      detail:
        "Submitted all assignments ahead of the deadline and participated in discussion.",
      time: "10:05 AM",
    },
  ],
  recentActivities: [
    {
      id: 1,
      student: "John Doe",
      behavior: "Positive",
      description: "Excellent participation in class",
      timestamp: new Date("2024-04-14"),
    },
    {
      id: 2,
      student: "Jane Smith",
      behavior: "Negative",
      description: "Late submission of assignment",
      timestamp: new Date("2024-04-13"),
    },
  ],
  weeklyStats: {
    positive: [45, 52, 48, 55, 61, 58, 63],
    negative: [8, 7, 9, 6, 5, 8, 6],
  },
};
