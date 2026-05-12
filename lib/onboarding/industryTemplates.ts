export {};
export const industryTemplates: Record<string, any> = {
  hvac: {
    crm: "Service CRM",
    modules: [
      "Dispatch",
      "Technicians",
      "Estimates",
      "Invoices",
      "Service Agreements",
      "SMS Followups",
    ],
  },

  roofing: {
    crm: "Roofing CRM",
    modules: [
      "Insurance Claims",
      "Estimates",
      "Lead Tracking",
      "Photos",
      "Contracts",
    ],
  },

  ecommerce: {
    crm: "Ecommerce CRM",
    modules: [
      "Orders",
      "Abandoned Cart",
      "Inventory",
      "Customer Support",
      "Email Marketing",
    ],
  },

  agency: {
    crm: "Agency CRM",
    modules: [
      "Clients",
      "Projects",
      "Campaigns",
      "Analytics",
      "Reporting",
    ],
  },

  healthcare: {
    crm: "Healthcare CRM",
    modules: [
      "Appointments",
      "Patients",
      "HIPAA Messaging",
      "Reminders",
    ],
  },
};
