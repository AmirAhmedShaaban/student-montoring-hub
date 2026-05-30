import { useSyncExternalStore } from "react";

const listeners = new Set();

export const dashboardMockData = {
  totalStudents: 250,
  positiveBehaviors: 1842,
  behavioralIssues: 145,
  studentsAtRisk: 23,
  summary: {
    note: "Attendance remains steady, risk flags are concentrated in a small group, and follow-up actions are active across the dashboard.",
    monitoredToday: 214,
    improving: 61,
    followUpsDue: 12,
    aiInsights: 8,
    openInterventions: 9,
    escalations: 4,
    atRiskStudents: 23,
    pendingFollowUps: 12,
    activeInterventions: 9,
    flaggedCases: 4,
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
  },
  quickActions: [
    {
      label: "Record behavior note",
      description: "Log a positive note or intervention update.",
      href: "/behavior-management",
    },
    {
      label: "Open student profile",
      description: "Review attendance, incidents, and follow-up history.",
      href: "/students/1",
    },
    {
      label: "Review clustering",
      description: "See risk groups and AI-assisted intervention segments.",
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

let dashboardMockState = {
  ...dashboardMockData,
  latestAnalysisResult: {
    studentId: null,
    classification: "Awaiting upload",
    riskLevel: "Unknown",
    cluster: "Unassigned",
    suggestedIntervention: "Upload classroom media to generate a review.",
    latestIncident: "No analysis available yet.",
    followUpStatus: "Waiting for analysis",
    confidenceScore: 0,
  },
};

function subscribe(listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function notify() {
  for (const listener of listeners) {
    listener();
  }
}

function getResultSeed(file) {
  const seedSource = `${file.name}-${file.size}-${file.type}`;
  let seed = 0;

  for (const character of seedSource) {
    seed = (seed + character.charCodeAt(0)) % 997;
  }

  return seed;
}

export function createMockAnalysisResponse(file) {
  const profiles = [
    {
      studentId: 1,
      riskLevel: "Low",
      classification: "Positive engagement",
      cluster: "Cluster C",
      confidenceScore: 93,
      suggestedIntervention:
        "Log a recognition note and continue routine monitoring.",
      latestIncident: "Classroom participation remained positive.",
      followUpStatus: "No immediate follow-up needed",
      flaggedStudentsImpact: 0,
      interventionImpact: {
        aiInsights: 1,
      },
    },
    {
      studentId: 2,
      riskLevel: "Medium",
      classification: "Attendance drift",
      cluster: "Cluster B",
      confidenceScore: 88,
      suggestedIntervention:
        "Add an attendance check-in and review the student tomorrow.",
      latestIncident: "Recent late arrival and incomplete classwork were noted.",
      followUpStatus: "Check in tomorrow",
      flaggedStudentsImpact: 1,
      interventionImpact: {
        pendingFollowUps: 1,
        activeInterventions: 1,
        followUpsDue: 1,
        aiInsights: 1,
      },
    },
    {
      studentId: 3,
      riskLevel: "High",
      classification: "Behavior escalation",
      cluster: "Cluster A",
      confidenceScore: 82,
      suggestedIntervention:
        "Open an intervention note and escalate to counselor review.",
      latestIncident: "Repeated absences and missed assignments raised risk.",
      followUpStatus: "Immediate follow-up required",
      flaggedStudentsImpact: 2,
      interventionImpact: {
        atRiskStudents: 2,
        pendingFollowUps: 1,
        activeInterventions: 1,
        flaggedCases: 1,
        followUpsDue: 1,
        behavioralIssues: 1,
        aiInsights: 1,
        escalations: 1,
      },
    },
  ];

  const selectedProfile = profiles[getResultSeed(file) % profiles.length];

  return {
    id: `analysis-${Date.now()}`,
    fileName: file.name,
    latestIncident: selectedProfile.latestIncident,
    followUpStatus: selectedProfile.followUpStatus,
    ...selectedProfile,
  };
}

export function getDashboardMockData() {
  return dashboardMockState;
}

export function useDashboardMockData() {
  return useSyncExternalStore(
    subscribe,
    getDashboardMockData,
    getDashboardMockData,
  );
}

export function applyMockAnalysisResult(result) {
  const flaggedStudentsImpact = Number(result?.flaggedStudentsImpact ?? 0);
  const interventionImpact = result?.interventionImpact ?? {};

  dashboardMockState = {
    ...dashboardMockState,
    studentsAtRisk:
      dashboardMockState.studentsAtRisk + flaggedStudentsImpact,
    behavioralIssues:
      dashboardMockState.behavioralIssues +
      Number(interventionImpact.behavioralIssues ?? 0),
    summary: {
      ...dashboardMockState.summary,
      atRiskStudents:
        dashboardMockState.summary.atRiskStudents + flaggedStudentsImpact,
      pendingFollowUps:
        dashboardMockState.summary.pendingFollowUps +
        Number(interventionImpact.pendingFollowUps ?? 0),
      activeInterventions:
        dashboardMockState.summary.activeInterventions +
        Number(interventionImpact.activeInterventions ?? 0),
      flaggedCases:
        dashboardMockState.summary.flaggedCases + flaggedStudentsImpact,
      followUpsDue:
        dashboardMockState.summary.followUpsDue +
        Number(interventionImpact.followUpsDue ?? 0),
      openInterventions:
        dashboardMockState.summary.openInterventions +
        Number(interventionImpact.activeInterventions ?? 0),
      escalations:
        dashboardMockState.summary.escalations +
        Number(interventionImpact.escalations ?? 0),
      aiInsights: dashboardMockState.summary.aiInsights + 1,
    },
    latestAnalysisResult: result,
  };

  notify();

  return dashboardMockState;
}
