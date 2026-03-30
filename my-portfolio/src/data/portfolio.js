const portfolio = {
  meta: {
    name: "Agraj Naman Mishra",
    title: "Senior Salesforce Developer",
    tagline: "7x Certified · 6 Years Experience · LWC · Apex · OmniStudio",
  },
  contact: {
    email: "agrajnaman1@gmail.com",
    phone: "+91-9455146488",
    linkedin: "https://linkedin.com/in/agrajnaman",
    github: "",
  },
  bio: "7x certified Senior Salesforce Developer with 6 years of experience leading full-cycle implementations across Sales Cloud, Service Cloud, and OmniStudio. Expert in designing scalable solutions using Lightning Web Components (LWC), Apex, and complex integrations. Managed a team of 3 junior developers and interns. Experienced in Agile delivery, client training across global regions (US, UK, JP), and implementing DevOps practices. Seeking to contribute technical leadership to a European technology team.",
  education: {
    degree: "Bachelor of Technology — Computer Science Engineering",
    institution: "Vellore Institute of Technology, Chennai",
    year: 2020,
    courses: ["Web Software Construction", "Object-Oriented Programming (Java)", "Agile & Waterfall Methodologies", "Algorithms & Data Structures (Java)"],
  },
  languages: [
    { name: "English", level: "Fluent" },
    { name: "Hindi", level: "Native" },
  ],
  certifications: [
    "Salesforce Certified Platform Developer I",
    "Salesforce Certified Platform Developer II",
    "Salesforce Certified Administrator",
    "Salesforce Certified Service Cloud Consultant",
    "Salesforce Certified OmniStudio Developer",
    "Salesforce Certified JavaScript Developer I",
    "Copado Certified DevOps Engineer",
    "Salesforce Certified AI Associate",
  ],
  skills: {
    "Salesforce Core": ["Apex", "Lightning Web Components (LWC)", "Aura", "Triggers", "Flows", "Profiles / Permission Sets", "Salesforce Admin Tools"],
    "Salesforce Clouds": ["Sales Cloud", "Service Cloud"],
    "OmniStudio": ["OmniScripts", "DataRaptors", "Integration Procedures", "FlexCards"],
    "Integration": ["REST APIs", "Email Services", "CPQ System Integration"],
    "DevOps & Tools": ["Copado", "Git", "GitHub", "VS Code", "CI/CD", "Agile / Scrum", "Azure DevOps", "Jira"],
    "Programming": ["JavaScript", "Java"],
    "Core Competencies": ["Technical Leadership", "Solution Architecture", "Requirements Gathering", "Code Review", "Client Training", "Project Planning"],
  },
  experience: [
    {
      company: "PracticeVantage Consulting",
      role: "Senior Salesforce Developer",
      period: "June 2024 – Present",
      tech: "Salesforce, LWC, Apex, Aura, Integrations, Team Leadership, Agile",
      bullets: [
        "Led technical solutioning and code reviews while mentoring 3 junior developers and interns, improving team code quality and sprint velocity.",
        "Architected and delivered custom LWC-based solutions for complex business requirements, reducing manual processes by up to 30%.",
        "Managed resource allocation and user story prioritization within Agile sprints, ensuring on-time project delivery.",
        "Implemented robust deployment pipelines using Git and Copado, ensuring version control and streamlined releases.",
        "Acted as the primary technical point of contact for onshore business teams, translating business needs into phased technical plans.",
      ],
    },
    {
      company: "United Airlines",
      role: "Salesforce Developer",
      period: "February 2022 – June 2024",
      tech: "Salesforce, LWC, Apex, Custom CRM, OmniStudio, Copado",
      bullets: [
        "Owned the end-to-end systems lifecycle from pre-sales consultation to successful implementation of Salesforce solutions.",
        "Engineered scalable applications using LWC and Apex, applying advanced security models (Profiles, Permission Sets, Roles).",
        "Automated business processes using Flows, Workflows, and triggers, enhancing operational efficiency.",
        "Supported deployment processes via Copado and GitHub within an Azure DevOps environment.",
        "Collaborated on development stories involving OmniStudio components and integrations.",
      ],
    },
    {
      company: "Capgemini",
      role: "Senior Salesforce Analyst",
      period: "January 2020 – January 2022",
      tech: "OmniStudio, Vlocity CPQ, Apex, LWC, Aura, Integrations",
      bullets: [
        "Leveraged Vlocity CPQ (OmniStudio) to build tailored solutions for complex business needs using OmniScripts, DataRaptors, and Integration Procedures.",
        "Integrated external APIs within LWC-driven OmniScripts to extend platform functionality.",
        "Assisted in designing solution architecture following Salesforce best practices for real-time/batch integrations and data migration.",
        "Implemented debugging and retry mechanisms for external callouts, improving system reliability.",
        "Utilized VS Code for development and Jira for project tracking in an Agile framework.",
      ],
    },
  ],
  projects: [
    {
      name: "Custom Salesforce Forecasting Application",
      tech: ["LWC", "Apex", "Lightning Pages"],
      bullets: [
        "Built a custom revenue forecasting application with event-driven LWC architecture to calculate actual vs. forecasted revenue, enhancing financial visibility and decision-making.",
        "Engineered a CSV upload feature that reduced manual data entry by ~30%, improving operational efficiency and data accuracy.",
        "Designed and implemented optimal performance patterns through event-driven architecture, ensuring responsive user interactions at scale.",
      ],
    },
    {
      name: "Automated Email-to-Case System for Deal Desk",
      tech: ["Apex", "Email Services", "Custom Settings"],
      bullets: [
        "Designed and built a round-robin case assignment system with intelligent Out-of-Office logic, ensuring equitable workload distribution across the deal desk team.",
        "Increased team productivity and case handling efficiency by automating case creation from inbound emails, reducing manual administrative overhead.",
      ],
    },
    {
      name: "Opportunity Guided Entry Flow",
      tech: ["LWC", "Apex", "Triggers"],
      bullets: [
        "Engineered an interactive LWC-guided flow for opportunity management that standardized data entry processes and reduced entry errors across the sales division.",
        "Accelerated sales cycle velocity by implementing guided workflows that streamlined the opportunity nurturing process and enforced data quality standards.",
      ],
    },
    {
      name: "CPQ Integration & Custom Approval Automation",
      tech: ["OmniStudio", "Apex", "Email Services"],
      bullets: [
        "Architected bidirectional integration between Salesforce and a custom CPQ system using OmniStudio, enabling seamless quote generation and order management workflows.",
        "Implemented automated approval routing and notifications using a bot user framework, eliminating manual approval bottlenecks and accelerating deal closure timelines.",
      ],
    },
  ],
};

export default portfolio;
