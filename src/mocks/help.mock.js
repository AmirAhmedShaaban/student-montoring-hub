export const helpMockData = {
  hero: {
    title: "Help & Support",
    subtitle:
      "Find quick answers, browse common issues, and contact the support team when you need a hand.",
    note: "Quick answers for teachers and administrators using the dashboard.",
  },
  search: {
    placeholder: "Search articles, FAQs, and guides",
  },
  faqs: [
    {
      id: "faq-add-student",
      question: "How do I add a new student?",
      answer:
        'Open the Students area, choose "Add Student", complete the required fields, and save the profile.',
    },
    {
      id: "faq-behavior-scores",
      question: "How are behavior scores calculated?",
      answer:
        "Scores combine incident severity, how often behaviors occur, and the recency of each event. District rules can adjust the weighting.",
    },
    {
      id: "faq-edit-incidents",
      question: "Can teachers edit incidents?",
      answer:
        "Yes, if their role has edit permissions. Some schools lock finalized incidents so only administrators can update them.",
    },
    {
      id: "faq-backup-policy",
      question: "What is the data backup policy?",
      answer:
        "Data is backed up automatically every night and retained according to district policy. Manual exports can be enabled if needed.",
    },
  ],
  footer: {
    note: "Check the FAQs first, then contact the support desk if you need help with workflow or access.",
    responseTime: "Typical response time: within 1 business day.",
    supportEmail: "support@studentdashboard.edu",
    supportPhone: "1-800-STUDENT-1",
    supportHours: "Monday - Friday, 8:00 AM - 5:00 PM EST",
  },
};

export const helpPageMockData = helpMockData;
