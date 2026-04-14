export const helpMockData = {
  hero: {
    title: "Help & Support",
    subtitle:
      "Find quick answers, browse common issues, and contact the support team when you need a hand.",
    note: "Built for teachers and administrators using the Student Behavior Monitoring Dashboard.",
  },
  search: {
    placeholder: "Search articles, FAQs, and guides",
  },
  quickLinks: [
    {
      id: "getting-started",
      title: "Getting Started",
      description:
        "Review the basics for navigating the dashboard and finding key tools.",
      href: "#help-hero",
      icon: "spark",
    },
    {
      id: "knowledge-base",
      title: "Knowledge Base",
      description:
        "Jump to the FAQ accordion for common questions and troubleshooting.",
      href: "#help-faqs",
      icon: "book",
    },
    {
      id: "contact-support",
      title: "Contact Support",
      description: "Open the support ticket form to send a detailed request.",
      href: "#support-ticket",
      icon: "chat",
    },
    {
      id: "user-guide",
      title: "User Guide",
      description:
        "Check the response note and support details before you submit a ticket.",
      href: "#help-footer",
      icon: "guide",
    },
  ],
  faqs: [
    {
      id: "faq-add-student",
      question: "How do I add a new student?",
      answer:
        'Go to the Students section and click "Add New Student". Fill in the required information and save the record.',
    },
    {
      id: "faq-record-incident",
      question: "How do I record a behavior incident?",
      answer:
        'Open the student profile and choose "Add Behavior Record". Select the behavior type, add details, and submit.',
    },
    {
      id: "faq-export-reports",
      question: "Can I export reports?",
      answer:
        "Yes. Reports can be exported in PDF or Excel format from the reports or analytics areas of the dashboard.",
    },
    {
      id: "faq-clustering-updates",
      question: "How often is the clustering analysis updated?",
      answer:
        "The clustering analysis runs automatically every night and refreshes the dashboard with the latest grouping.",
    },
    {
      id: "faq-backup-policy",
      question: "What is the data backup policy?",
      answer:
        "Data is backed up daily. You can also trigger a manual backup from the Settings page if needed.",
    },
  ],
  supportTicket: {
    title: "Submit a Support Ticket",
    description:
      "Send a clear subject and a short message so the team can route your request quickly.",
    subjectLabel: "Subject",
    subjectPlaceholder: "Example: I cannot open a student profile",
    messageLabel: "Message",
    messagePlaceholder:
      "Describe the issue, who it affects, and what you were doing when it happened.",
    submitLabel: "Submit support ticket",
    confirmation:
      "Your ticket will be queued for the support team. A response usually arrives within one business day.",
  },
  footer: {
    note: "Need a faster answer? Check the FAQs first, then submit a ticket with as much context as possible.",
    responseTime: "Typical response time: within 1 business day.",
    supportEmail: "support@studentdashboard.edu",
    supportPhone: "1-800-STUDENT-1",
    supportHours: "Monday - Friday, 8:00 AM - 5:00 PM EST",
  },
};

export const helpPageMockData = helpMockData;
