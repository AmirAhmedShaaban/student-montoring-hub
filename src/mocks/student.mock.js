export const studentMockData = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@school.edu",
    grade: 10,
    class: "A",
    positiveBehaviors: 45,
    negativeBehaviors: 3,
    riskLevel: "Low",
    enrollmentDate: "2023-09-01",
    behaviorHistory: [
      {
        date: "2024-04-10",
        behavior: "Positive",
        description: "Great teamwork",
      },
      {
        date: "2024-04-08",
        behavior: "Positive",
        description: "Submitted homework on time",
      },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@school.edu",
    grade: 10,
    class: "B",
    positiveBehaviors: 38,
    negativeBehaviors: 7,
    riskLevel: "Medium",
    enrollmentDate: "2023-09-01",
    behaviorHistory: [
      {
        date: "2024-04-09",
        behavior: "Negative",
        description: "Disrupted class",
      },
      { date: "2024-04-07", behavior: "Positive", description: "Helped peers" },
    ],
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@school.edu",
    grade: 11,
    class: "C",
    positiveBehaviors: 25,
    negativeBehaviors: 15,
    riskLevel: "High",
    enrollmentDate: "2023-09-01",
    behaviorHistory: [
      {
        date: "2024-04-12",
        behavior: "Negative",
        description: "Absent from class",
      },
      {
        date: "2024-04-05",
        behavior: "Negative",
        description: "Failed to complete assignment",
      },
    ],
  },
];
