import { Level, Subject, Course, AppData } from "./types";

export const subjects: Subject[] = [
  { name: "Applied Management", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Accounting", level: [Level.N4, Level.N5, Level.N6] },

  { name: "Building & Civil Technology", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Building Construction", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Building Administration", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Building & Structural Surveying", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Building & Structure Construction", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Building Science", level: [Level.N2] },
  { name: "Building Drawing", level: [Level.N2] },
  { name: "Bricklaying", level: [Level.N2] },

  { name: "Chemistry", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Chemical Plant Operation Theory", level: [Level.N2] },
  { name: "Capentry & Roof Theory", level: [Level.N2] },
  { name: "Child Health", level: [Level.N4] },
  { name: "Catering: Theory & Practical", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Control System", level: [Level.N6] },
  { name: "Communication", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Communication & Human Relations", level: [Level.N6] },
  { name: "Computer Practice", level: [Level.N4, Level.N5] },
  { name: "Computerized Financial Systems", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Cost & Management Accounting", level: [Level.N5, Level.N6] },
  { name: "Construction Theory", level: [Level.N2, Level.N3, Level.N4, Level.N5, Level.N6] },

  { name: "Digital Electronics", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Day Care Communication", level: [Level.N5, Level.N6] },
  { name: "Day Care Personnel Development", level: [Level.N4] },
  { name: "Day Care Management", level: [Level.N4] },
  { name: "Diesel Trade Theory", level: [Level.N2] },
  { name: "Drawing", level: [Level.N4, Level.N5, Level.N6] },

  { name: "Engineering Physics", level: [Level.N5, Level.N6] },
  { name: "Engineering Science", level: [Level.N2, Level.N3, Level.N4] },
  { name: "English", level: [Level.N2, Level.N3, Level.N4, Level.N5, Level.N6] },
  { name: "Electrical Trade Theory", level: [Level.N2] },
  { name: "Engineering Drawing", level: [Level.N2, Level.N3] },
  { name: "Electrotechnics", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Entrepreneurship & Business Management", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Economics", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Education Didactics: Theory & Practice", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Education", level: [Level.N4] },
  { name: "Education Psychology", level: [Level.N5, Level.N6] },

  { name: "Financial Accounting", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Fault Finding", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Fault Finding & Protective Device", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Fitting and Machining", level: [Level.N2] },
  { name: "Fluid Mechanics", level: [Level.N5, Level.N6] },
  { name: "Foundary Theory", level: [Level.N2] },
  { name: "Food & Beverage Services", level: [Level.N5] },

  { name: "GCC Factories", level: [] },
  { name: "GCC Mines", level: [] },

  { name: "History Of Art", level: [Level.N5, Level.N6] },

  { name: "Industrial Electronics", level: [Level.N2, Level.N3, Level.N4, Level.N5, Level.N6] },
  { name: "Installation Rules1", level: [] },
  { name: "Installation Rules2", level: [] },
  { name: "Installations - Special Codes", level: [] },
  { name: "Instrument Trade Theory", level: [Level.N2] },
  { name: "Introductory Accounting", level: [Level.N4] },
  { name: "Introductory Information Processing", level: [Level.N4] },
  { name: "Income Tax", level: [Level.N6] },
  { name: "Information Processing", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Inventory Management", level: [Level.N4, Level.N5, Level.N6] },

  { name: "Jewellery Design", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Jewellery Manufacturing", level: [Level.N4, Level.N5, Level.N6] },

  { name: "Logic Systems", level: [Level.N2, Level.N3, Level.N4] },
  { name: "Loss Control", level: [Level.N6] },
  { name: "Labour Relations", level: [Level.N5, Level.N6] },
  { name: "Legal Practice", level: [Level.N5, Level.N6] },
  { name: "Logistics", level: [Level.N5, Level.N6] },
  { name: "Life Science", level: [Level.N2, Level.N3, Level.N4, Level.N5, Level.N6] },

  { name: "Nutrition & Menu Planning", level: [Level.N4] },

  { name: "Management Communication", level: [Level.N4] },
  { name: "Mathematics", level: [Level.N2, Level.N3, Level.N4, Level.N5, Level.N6] },
  { name: "Mechanotechnics", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Motor Trade Theory", level: [Level.N2] },
  { name: "Motor Electrical Theory", level: [Level.N2] },
  { name: "Mechanical Drafting", level: [Level.N4] },
  { name: "Mercantile Law", level: [Level.N4, Level.N5] },
  { name: "Medical Practice", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Municipal Administration", level: [Level.N5, Level.N6] },

  { name: "Office Practice", level: [Level.N4, Level.N5, Level.N6] },

  { name: "Personel Management", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Public Administration", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Procument", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Public Finance", level: [Level.N5, Level.N6] },
  { name: "Public Law", level: [Level.N6] },
  { name: "Physics", level: [Level.N5, Level.N6] },
  { name: "Physical Science", level: [Level.N5, Level.N6] },
  { name: "Personnel Training", level: [Level.N5, Level.N6] },
  { name: "Platers Theory", level: [Level.N2] },
  { name: "Plant Operation Theory", level: [Level.N2] },
  { name: "Power Machines", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Production & Quality Control", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Platers and Structural Steel Drawing", level: [Level.N2, Level.N3, Level.N4] },
  { name: "Practical Skills", level: [Level.N2, Level.N3, Level.N4, Level.N5, Level.N6] },
  { name: "Plumbing Theory", level: [Level.N2] },
  { name: "Panel Installation", level: [Level.N2] },

  { name: "Quantity Surveying", level: [Level.N4, Level.N5, Level.N6] },

  { name: "Rigging Theory", level: [Level.N2] },

  { name: "Sanitation & Safety", level: [Level.N4] },
  { name: "Strength of Materials & Structures", level: [Level.N5, Level.N6] },
  { name: "Site Safety", level: [Level.N2, Level.N3, Level.N4, Level.N5, Level.N6] },
  { name: "Sales Management", level: [Level.N5, Level.N6] },
  { name: "Supervisory Management", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Supply Chain Systems", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Solar Theory", level: [Level.N4, Level.N5, Level.N6] },

  { name: "Travel Office Procedures", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Travel Services", level: [Level.N4, Level.N5, Level.N6] },
  { name: "Tourism Communication", level: [Level.N4, Level.N5] },
  { name: "Tourism Destination", level: [Level.N4, Level.N5, Level.N6] },

  { name: "Water & Waste Water Treatment Practice", level: [Level.N2] },
  { name: "Welders Theory", level: [Level.N2] },
  { name: "Woodworkers", level: [Level.N2] },
  { name: "Workplace Experience", level: [Level.N2, Level.N3, Level.N4, Level.N5, Level.N6] },
  { name: "Wiring & Testing", level: [Level.N2, Level.N3, Level.N4, Level.N5, Level.N6] }
]

// Put this near the top of the file
const getSubject = (name: string): Subject => {
  const subject = subjects.find(s => s.name === name);
  if (!subject) {
    console.warn(`Subject not found: ${name}`);
    return { name, level: [] };
  }
  return subject;
};

export const courses: Course[] = [
  {
    id: "eng-electrical", image: "/assets/engineering.jpg",
    name: "Electrical Engineering",
    category: "Engineering Studies",
    // level: "N1–N6",
    duration: "3 months", fee: 18500, regFee: 500, popular: true,
    mode: "Hybrid",
    subjects: [
      getSubject("Engineering Science"),
      getSubject("Mathematics"),
      getSubject("Logic Systems"),
      getSubject("Industrial Electronics"),
      getSubject("Electrical Trade Theory"),
      getSubject("Electrotechnics"),
      getSubject("Instrument Trade Theory"),
      getSubject("Physics"),
      getSubject("Control Systems"),
      getSubject("Supervisory Management"),
      getSubject("Fault Finding"),
      getSubject("Fault Finding & Protective Device"),
      getSubject("Digital Electronics"),
      getSubject("Installation Rules1"),
      getSubject("Installation Rules2"),
      getSubject("Power Machines"),
      getSubject("Installations - Special Codes"),
      getSubject("GCC Factory"),
      getSubject("GCC Mines"),
    ]
  },
  {
    id: "business-management", image: "/assets/management.jpg",
    name: "Business Management", category: "Business & Management",
    // level: "N4–N6", 
    duration: "6 months", fee: 16500, regFee: 500, popular: true,
    mode: "On campus",
    subjects: [
      getSubject("Entrepreneurship & Business Management"),
      getSubject("Management Communication"),
      getSubject("Computer Practice"),
      getSubject("Introductory Accounting"),
      getSubject("Financial Accounting"),
      getSubject("Sales Management"),
      getSubject("Computerized Financial System")
    ]
  },
  {
    id: "it", image: "/assets/it.jpg", name: "Information Technology",
    category: "Information Technology",
    // level: "Certificate", 
    duration: "12 months",
    fee: 14500, regFee: 500, popular: true, mode: "Hybrid",
    subjects: [
      getSubject("Physics"),
      getSubject("Control Systems"),
      getSubject("Supervisory Management"),
      getSubject("Fault Finding"),
      getSubject("Fault Finding & Protective Device"),
      getSubject("Digital Electronics"),
      getSubject("Installation Rules1"),
      getSubject("Installation Rules2"),
      getSubject("Power Machines"),
      getSubject("Installations - Special Codes"),
      getSubject("GCC Factory"),
      getSubject("GCC Mines")
    ]
  },
  {
    id: "health-safety", image: "/assets/health&safety.jpg",
    name: "Health & Safety Officer", category: "Health & Safety",
    // level: "Occupational", 
    duration: "12 months", fee: 22000, regFee: 500,
    mode: "On campus",
    subjects: [
      getSubject("Occupational Health"),
      getSubject("Risk Assessment"),
      getSubject("First Aid"),
      getSubject("Incident Investigation"),
      getSubject("Safety Legislation")
    ]
  },
  {
    id: "bricklayer", image: "/assets/bricklayer.jpg",
    name: "Occupational Certificate: Bricklayer", category: "QCTO Skills",
    // level: "Occupational", 
    duration: "18 months", fee: 32000, regFee: 500,
    mode: "On campus",
    subjects: [
      getSubject("Construction Theory"),
      getSubject("Practical Skills"),
      getSubject("Workplace Experience"),
      getSubject("Site Safety")
    ]
  },
  {
    id: "supply-chain", image: "/assets/supplychain.jpg",
    name: "Supply Chain Practitioner", category: "Logistics & Transport",
    // level: "Occupational", 
    duration: "12 months", fee: 24000, regFee: 500,
    mode: "Hybrid",
    subjects: [
      getSubject("Procurement"),
      getSubject("Inventory Management"),
      getSubject("Logistics"),
      getSubject("Supply Chain Systems")
    ]
  },
  {
    id: "matric", image: "/assets/matric.jpg", name: "Matric Rewrite & Upgrade",
    category: "Matric Rewrite",
    // level: "Grade 12", 
    duration: "6 months", fee: 8500,
    regFee: 500, mode: "On campus",
    subjects: [getSubject("Mathematics"), getSubject("Physical Science"), getSubject("Life Science"), getSubject("English"), getSubject("Accounting")]
  },
  {
    id: "solar", image: "/assets/solar.jpg", name: "Solar Panel Installation",
    category: "Short Course",
    // level: "Skills", 
    duration: "2 months", fee: 7500,
    regFee: 2500, monthly: 2500, mode: "On campus",
    subjects: [getSubject("Solar Theory"), getSubject("Panel Installation"), getSubject("Wiring & Testing")]
  },
  {
    id: "mechinical", image: "/assets/mechanical.jpg", name: "Mechanical Engineering",
    category: "Engineering Studies",
    // level: "N1–N6", 
    duration: "3 months", fee: 8500,
    regFee: 2500, monthly: 2500, mode: "On campus",
    subjects: [
      getSubject("Engineering Science"),
      getSubject("Mathematics"),
      getSubject("Engineering Drawing"),
      getSubject("Fitting and Machining"),
      getSubject("Diesel Trade Theory"),
      getSubject("Motor Trade Theory"),
      getSubject("Motor Electrical Theory"),
      getSubject("Platers Theory"),
      getSubject("Platers and Structural Steel Drawing"),
      getSubject("Mechanotechnics"),
      getSubject("Mechanical Drafting"),
      getSubject("Supervisory Management"),
      getSubject("Power Machines"),
      getSubject("Physics"),
      getSubject("Strength Of Material & Structures"),
      getSubject("Fluid Mechanics"),
      getSubject("Mechanical Drawing & Design"),
      getSubject("Welders Theory"),
      getSubject("Rigging Theory"),
      getSubject("Loss Control")
    ]
  },
  {
    id: "civil", image: "/assets/mechanical.jpg", name: "Civil Engineering",
    category: "Engineering Studies",
    // level: "N1–N6", 
    duration: "3 months", fee: 8500,
    regFee: 2500, monthly: 2500, mode: "On campus",
    subjects: [
      getSubject("Mathematics"),
      getSubject("Building Science"),
      getSubject("Building Drawing"),
      getSubject("Plumbing Theory"),
      getSubject("Woodworkers"),
      getSubject("Bricklaying"),
      getSubject("Carpentry & Roofing Theory"),
      getSubject("Building & Civil Technology"),
      getSubject("Building Construction"),
      getSubject("Building Administration"),
      getSubject("Building & Structure Surveying"),
      getSubject("Quantity Surveying"),
      getSubject("Building & Structure Construction"),
      getSubject("Supervisory Management")
    ]
  },
  {
    id: "wt&ch", image: "/assets/mechanical.jpg", name: "Water & Chemical Engineering",
    category: "Engineering Studies",
    // level: "N1–N6", 
    duration: "3 months", fee: 8500,
    regFee: 2500, monthly: 2500, mode: "On campus",
    subjects: [
      getSubject("Engineering Science"),
      getSubject("Mathematics"),
      getSubject("Foundary Theory"),
      getSubject("Plant Operation Theory"),
      getSubject("Water & Wastewater Treatment Practice"),
      getSubject("Chemical Plant Operations"),
      getSubject("Chemistry"),
      getSubject("Production & Quantity Control"),
      getSubject("Power Machines"),
      getSubject("Engineering Physics"),
      getSubject("Supervisory Management"),
      getSubject("Loss Control")
    ]
  },
  {
    id: "hr", image: "/assets/mechanical.jpg", name: "Human Resource Management",
    category: "Humane Resource",
    // level: "N1–N6",
    duration: "3 months", fee: 8500,
    regFee: 2500, monthly: 2500, mode: "On campus",
    subjects: [
      getSubject("Personnel Management"),
      getSubject("Computer Practice"),
      getSubject("Entrepreneuriship & Business Management"),
      getSubject("Management Communication"),
      getSubject("Personnel Management"),
      getSubject("Labour Relations"),
      getSubject("Personnel Training"),
      getSubject("computer Practice")
    ]
  },
  {
    id: "fm", image: "/assets/mechanical.jpg", name: "Financial Management",
    category: "Accounting",
    // level: "N1–N6",
    duration: "3 months", fee: 8500,
    regFee: 2500, monthly: 2500, mode: "On campus",
    subjects: [
      getSubject("Entrepreneuriship & Business Management"),
      getSubject("Management Communication"),
      getSubject("Labour Relations"),
      getSubject("Personnel Training"),
      getSubject("Financial Accounting"),
      getSubject("Computerized Financial Systems"),
      getSubject("Cost & Management Accounting"),
      getSubject("Mercantile Law"),
      getSubject("Income Tax"),
    ]
  },
  {
    id: "bsm", image: "/assets/mechanical.jpg", name: "Management Assistant",
    category: "management & assistant",
    // level: "N1–N6",
    duration: "3 months", fee: 8500,
    regFee: 2500, monthly: 2500, mode: "On campus",
    subjects: [
      getSubject("Information Processing"),
      getSubject("Introductory Information Processing"),
      getSubject("Computer Practice"),
      getSubject("Office Practice"),
      getSubject("Communication")
    ]
  },
  {
    id: "mds", image: "/assets/mechanical.jpg", name: "Medical Secretary",
    category: "medicine & secretary",
    // level: "N1–N6",
    duration: "3 months", fee: 8500,
    regFee: 2500, monthly: 2500, mode: "On campus",
    subjects: [
      getSubject("Information Processing"),
      getSubject("Office Practice"),
      getSubject("Communication"),
      getSubject("Medical Practice")
    ]
  },
  {
    id: "ls", image: "/assets/mechanical.jpg", name: "Legal Secretary",
    category: "legal & secretary",
    // level: "N1–N6",
    duration: "3 months", fee: 8500,
    regFee: 2500, monthly: 2500, mode: "On campus",
    subjects: [
      getSubject("Information Processing"),
      getSubject("Office Practice"),
      getSubject("Communication"),
      getSubject("Mercantile Law"),
      getSubject("Legal Practice")
    ]
  },
  {
    id: "pm", image: "/assets/mechanical.jpg", name: "Public Management",
    category: "legal & secretary",
    // level: "N1–N6",
    duration: "3 months", fee: 8500,
    regFee: 2500, monthly: 2500, mode: "On campus",
    subjects: [
      getSubject("Public Administration"),
      getSubject("Management Communication"),
      getSubject("Computer Practice"),
      getSubject("Entrepreneurship & Business Management"),
      getSubject("Public Finance"),
      getSubject("Municipal Administration")
    ]
  },
  {
    id: "edu", image: "/assets/mechanical.jpg", name: "Educare",
    category: "educare",
    // level: "N1–N6",
    duration: "3 months", fee: 8500,
    regFee: 2500, monthly: 2500, mode: "On campus",
    subjects: [
      getSubject("Day care Personnel Development"),
      getSubject("Education Didactics: Theory & Practice"),
      getSubject("Education"),
      getSubject("Child Health"),
      getSubject("Entrepreneurship & Business Management"),
      getSubject("Day Care Communication"),
      getSubject("Day Care Management"),
      getSubject("Educational Psychology"),
    ]
  },
  {
    id: "hsp", image: "/assets/mechanical.jpg", name: "Hospitality & Catering Services",
    category: "hospitality",
    // level: "N1–N6",
    duration: "3 months", fee: 8500,
    regFee: 2500, monthly: 2500, mode: "On campus",
    subjects: [
      getSubject("Applied Management"),
      getSubject("Sanitation & Safety"),
      getSubject("Nutrition & Menu Planning"),
      getSubject("Catering: Theory & Practical"),
      getSubject("Entrepreneurship & Business Management"),
      getSubject("Food & Beverage Services"),
      getSubject("Communication & Human Relations"),
      getSubject("Computer Practice"),
    ]
  },
  {
    id: "tour", image: "/assets/mechanical.jpg", name: "Tourism",
    category: "tourism",
    // level: "N1–N6",
    duration: "3 months", fee: 8500,
    regFee: 2500, monthly: 2500, mode: "On campus",
    subjects: [
      getSubject("Travel Office Procedures"),
      getSubject("Tourism Communication"),
      getSubject("Travel Services"),
      getSubject("Tourism Destination"),
      getSubject("Hotel Reception")
    ]
  },
  {
    id: "art", image: "/assets/mechanical.jpg", name: "Art & Design",
    category: "art",
    // level: "N1–N6",
    duration: "3 months", fee: 8500,
    regFee: 2500, monthly: 2500, mode: "On campus",
    subjects: [
      getSubject("Drawing"),
      getSubject("Entrepreneurship & Business Management"),
      getSubject("Jewellery Design"),
      getSubject("Jewellery Manufacturing"),
      getSubject("History Of Art")
    ]
  },
];

export const shortCourses = [
  ["A+ PC Technician", "2 months", 2500, 3000, 8500],
  ["N+ Networking", "2 months", 2500, 2500, 7500],
  ["Programming (C++, HTML, VB)", "2 months", 2500, 3000, 8500],
  ["Beautician", "2 months", 2500, 3000, 8500],
  ["Solar Panel", "2 months", 2500, 2500, 7500],
  ["Computer Literacy", "2 months", 2500, 3000, 8500],
  ["Data Capture", "2 months", 2500, 3000, 8500],
  ["Computerized Cashier / Bookkeeping", "2 months", 2500, 2500, 7500],
  ["Bookkeeping", "2 months", 2500, 3000, 8500],
  ["Pastel Accounting", "2 months", 2500, 3000, 8500],
  ["Pastel Payroll", "2 months", 2500, 3000, 8500],
  ["Call Center Agent", "2 months", 2500, 2500, 7500],
  ["Chef", "2 months", 3000, 3000, 9000],
  ["Hair Dressing", "2 months", 2500, 3000, 8500],
  ["Sewing", "2 months", 2500, 3000, 8500],
  ["HIV/AIDS Counselling & Mentoring", "2 months", 2500, 2500, 7500],
  ["Supervisory Management", "2 months", 2500, 2500, 7500],
  ["Customer Care", "2 months", 2500, 2500, 7500],
  ["Community Development", "2 months", 2500, 2500, 7500],
  ["Nails Technician", "2 months", 2500, 2000, 6500],
  ["First Aid / Fire", "5 days", 0, 0, 2800],
] as const;

export const machineCourses = [
  ["Dump Truck (ADT)", 4800],
  ["Dump Truck (777D)", 5800],
  ["Mobile Crane (50 Tones)", 5800],
  ["Mobile Crane (150 Tones)", 6800],
  ["Mobile Crane (250 Tones)", 7800],
  ["Drill Rig", 7800],
  ["Basic Rigging", 4800],
  ["Advanced Rigging", 10000],
  ["Excavator", 5800],
  ["TLB", 5800],
  ["Grader", 5800],
  ["Forklift F1", 2500],
  ["Forklift F2", 2200],
  ["Forklift F3", 2900],
  ["Front End Loader", 2800],
  ["Bulldozer", 5800],
  ["Tower Crane Remote", 6800],
  ["Crawler Crane", 6800],
  ["Overhead Crane", 6800],
  ["Truck Mounted Crane", 6800],
  ["Roller", 5800],
  ["Welding", 14500],
  ["Reach Stacker", 7500],
  ["Reach Truck", 4800],
  ["Bobcat", 4500],
  ["Plant Operator", 32500],
  ["Lamps Man", 12750],
  ["Blasting", 32000],
  ["Competency A", 16550],
  ["Competency B", 16550]
] as const;

export const artisanFields = [
  ["Diesel Mechanics", 20000],
  ["Boilermaker", 20000],
  ["Rigging & Fitting", 20000],
  ["Electrical", 20000],
  ["Auto-Electrical", 20000],
  ["Panel Beater & Body Spray", 20000],
  ["Plumber", 20000],
  ["Instrumentation", 20000],
  ["Brick Laying", 20500],
  ["Carpentry", 20500]
] as const;

export const firstClassFields = [
  ["Artificial Intelligence", 10000],
  ["Drone Engineering & Design", 45000],
  ["Robotics Engineering", 45000]
] as const;

export const weldingFields = [
  ["Arc Welding", 25000],
  ["C02 Welding", 25000],
  ["Gas Metal Arc Welding", 25000],
  ["Tungsten Gas Welding", 25250]
] as const;

export const subNum = ["Sub-5", "Sub-4", "Sub-3", "Sub-2", "Sub-1"] as const;
export const monNum = ["12-Months", "18-Months", "24-Months"] as const;

export const feeRows = {
  "engineering": [
    ["Deposit & Admin", "R2,000", "R2,000", "R1,800", "R1,600", "R1,400"],
    ["Monthly Installments", "R1,800 × 2 = R3,600", "R1,500 × 2 = R3,000", "R1,200 × 2 = R2,400", "R900 × 2 = R1,800", "R600 × 2 = R1,200"],
    ["Total", "R6,100", "R5,500", "R4,700", "R3,900", "R3,100"],
    ["Cash savings", "Save R610 · Now R5,490", "Save R550 · Now R4,950", "Save R470 · Now R4,230", "Save R390 · Now R3,510", "Save R310 · Now R2,790"]
  ],
  "business": [
    ["Deposit & Admin", "R2,000", "R2,000", "R1,800", "R1,600", "R1,400"],
    ["Monthly Installments", "R1,300 × 5 = R6,500", "R1,100 × 5 = R5,500", "R900 × 5 = R1,800", "R750 × 5 =R3,750", "R600 × 2 = R1,200"],
    ["Total", "R9,000", "R8,000", "R5,800", "R5,850", "R4,900"],
    ["Cash savings", "Save R900 · Now R8,100", "Save R800 · Now R7,200", "Save R680 · Now R6,120", "Save R585 · Now R5,265", "Save R490 · Now R4,410"]
  ],
  "occupational": [
    ["Registration Fees", "R500", "R500", "R500"],
    ["Deposit & Admin", "R2,000", "R2,000", "R2,000"],
    ["Monthly Installments", "R1,800 × 11 = R19,800", "R18,000 × 17 = R30,600", "R1,800 × 23 = R41,400"],
    ["Total", "R22,300", "R33,100", "R43,900"],
    ["Cash savings", "Save R2,230 · Now R20,070", "Save R3,310 · Now R29,790", "Save R4,390 · Now R39,510"]
  ],
  "matric": [
    ["Deposit & Admin", "R1,300", "R1,300", "R1,300", "R1,300", "R1,300", "R1,300"],
    ["Monthly Installments", `"R1,000 × 6 = R6,000" "R1,000 × 10 = R10,000"`, `"R800 × 6 = R4,800" "R800 × 10 = R R8,000"`, `"R700 × 6 = R4,200" "R700 × 10 = R7,000"`, `"R650 × 6 = R3,900" "R650 × 10 = R6,500"`, `"R550 × 6 = R3,300" "R550 × 10 = R5,500"`, `"R500 × 6 = R3,000" "R500 × 10 = R5,000"`],
    ["Total", `"R7,800 - 6 Mon" "R11,800 - 10 Mon"`, `"R6,600 - 6 Mon" "R88,000 - 10 Mon"`, `"R5,700 - 6 Mon" "R8,300 - 10 Mon"`, `"R5,100 - 6 Mon" "R7,300 - 10 Mon"`, `"R4,800 - 6 Mon" "R6,800 - 10 Mon"`],
    ["Cash savings", `"Save R7800-6M · Now R7,020-6M" "Save R1,180-10M · Now R10,620-10M"`, `"Save R660-6M · Now R5,940" "Save R980-10M · Now R8,820"`, `"Save R600-6M · Now R5,400-6M" "Save R880-10M · Now R7,920-10M"`, `"Save R570-6M · Now R5,130-6M" "Save R830-10M · Now R7,470-10M"`, `"Save R510-6M · Now R4,590-6M" "Save R630-10M · Now R4,570-10M"`, `"Save R480-6M · Now R4,320-6M" "Save R680-10M · Now R6,120-10M"`]
  ]
};

export const academicFields = [
  "Engineering Studies",
  "Business / Management / Teaching",
  "Information Technology",
  "Mine & Construction Machines",
  "Artisan / Trade Testing",
  "GCC Plant Factories / Mining",
  "Health and Safety",
  "Matric Rewrite & Upgrade",
  "QCTO Occupational Qualifications",
  "QCTO Skills Programs"
];

export const accreditationBodies = [
  { code: "DHET", name: "Department of Higher Education", logo: "/assets/dhet.png", description: "Nationally recognised higher education standards and oversight for public skills pathways." },
  { code: "QCTO", name: "Quality Council for Trades & Occupations", logo: "/assets/QCTO.jpg", description: "Occupational programmes aligned to practical, work-ready competence and trade standards." },
  { code: "HWSETA", name: "Health & Welfare SETA", logo: "/assets/hwseta.png", description: "Health, safety and welfare programmes built for care, compliance and workplace readiness." },
  { code: "AGRISETA", name: "Agriculture SETA", logo: "/assets/agriseta.png", description: "Agri-focused training and rural enterprise pathways that support productivity and growth." },
  { code: "CETA", name: "Construction SETA", logo: "/assets/ceta.png", description: "Construction and built-environment training connected to site-based labour demand." },
  { code: "ETDP SETA", name: "Education, Training & Development", logo: "/assets/etdpseta.png", description: "Training aligned to teaching, learning support and developmental practice." },
  { code: "SERVICES SETA", name: "Services SETA", logo: "/assets/serviceseta.jpg", description: "Service-sector programmes that strengthen customer care, operations and entrepreneurship." },
  { code: "LG SETA", name: "Local Government SETA", logo: "/assets/lgseta.png", description: "Public service and local government capacity-building for community impact." },
  { code: "TETA SETA", name: "Transport Education & Training", logo: "/assets/tetaseta.jpg", description: "Logistics and transport pathways designed for real mobility and operational efficiency." },
  { code: "WRSETA", name: "Wholesale & Retail SETA", logo: "/assets/wrseta.png", description: "Retail and trade readiness aligned to customer-facing, fast-moving operations." },
  { code: "FASSETA", name: "Finance & Accounting SETA", logo: "/assets/fasseta.jpg", description: "Financial literacy, office systems and business support training for workplace confidence." },
  { code: "INSETA", name: "Insurance SETA", logo: "/assets/inseta.png", description: "Insurance, risk and service skills for a modern, regulated financial environment." },
  { code: "FP&M SETA", name: "Fibre, Paper & Manufacturing", logo: "/assets/fp&mseta.jpg", description: "Manufacturing and value-chain skills connected to industrial relevance and productivity." }
] as const;

export const occupationalColleges = [
  ["College of Construction", "CETA", ["Occupational Certificate: Bricklayer", "Plumbing, Hot- and Cold-Water Systems Installer", "Domestic Water and Drainage Pipe Repairer"]],
  ["College of Health Science", "HWSETA", ["Occupational Certificate: Health Promotion Officer", "Occupational Certificate: Safety Officer", "Occupational Skills Program: First Aid"]],
  ["College of Agriculture", "AGRISETA", ["Occupational Certificate: Poultry Farmer", "Occupational Certificate: Livestock", "Occupational Certificate: Pest Management Officer", "Occupational Certificate: Landscape Gardener"]],
  ["College of Education and Teaching", "ETDP SETA", ["Occupational Certificate: Early Childhood Development", "Occupational Certificate: School Principal", "Occupational Skills Program: Assessment Practitioner"]],
  ["College of Local Government", "LG SETA", ["Occupational Certificate: Municipal Property Valuer", "Occupational Certificate: Municipal Environmental Science", "Occupational Certificate: Public Administrator", "Occupational Skills Program: Community Counsellor", "Occupational Skills Program: Community Development Facilitator", "Occupational Skills Program: Auxiliary Community Development"]],
  ["College of Wholesale and Retail", "WRSETA", ["Occupational Certificate: Retail Supervisor", "Occupational Certificate: Retail Store Manager", "Occupational Certificate: Check-Out Operator", "Occupational Certificate: Planner"]],
  ["College of Fashion & Manufacturing", "FP & M SETA", ["Occupational Skills Program: Sewer"]],
  ["College of Services", "SERVICES SETA", ["Occupational Certificate: Office Administration", "Occupational Certificate: Project Manager", "Occupational Certificate: Real Estate Agent", "Occupational Skills Program: Hairstylist", "Occupational Skills Program: New Venture"]],
  ["College of Logistics and Transport", "TETA SETA", ["Occupational Certificate: Supply Chain Practitioner", "Occupational Certificate: Supply Chain Manager", "Occupational Certificate: Procurement Officer", "Occupational Certificate: Truck Driver"]],
  ["College of Accounting and Finance", "FASSETA", ["Occupational Certificate: Management Accountant"]],
  ["College of Insurance & Wealth Management", "INSETA", ["Occupational Certificate: Financial Advisor", "Occupational Certificate: Investment Advisor"]]
] as const;

export const departmentCatalog = [
  ["Engineering Studies (N2–N6)", [["Electrical Engineering", ["Mathematics", "Supervisory Management / Installation Rules", "Engineering Science / Physics", "Logic Systems", "Control Systems", "Industrial Electronics", "Electrical Trade Theory / Instrument Trade Theory", "Electro Technology"]], ["Mechanical Engineering", ["Mathematics", "Diesel Trade Theory", "Engineering Science / Physics", "Engineering Drawing / Steel Drawing", "Fitting and Machining", "Plating and Structural Steel Drawing", "Fluid Mechanics / Strength of Materials", "Mechanical Draughting", "Mechanotechnics", "Power Machines"]], ["Chemical Engineering", ["Mathematics", "Chemistry", "Water Treatment", "Engineering Science", "Chemical Plant Operation", "Waste Water Treatment Practice", "Plant Operation Theory", "Chemical Technology", "Power Machines"]], ["Civil Engineering", ["Mathematics", "Quantity Surveying", "Building Drawing", "Building & Civil Technology", "Building Administration", "Building & Structural Surveying", "Supervisory Management", "Plumbing Theory", "Building Science"]]]],
  ["Management & Business Studies (N4–N6)", [["Marketing Management", ["Entrepreneurship & Business Management", "Management Communication", "Marketing Research", "Marketing Communication", "Sales Management", "Computer Practice", "Market Research"]], ["Business Management", ["Entrepreneurship & Business Management", "Management Communication", "Economics", "Cost & Management Accounting", "Financial Accounting", "Sales Management", "Computer Practice"]], ["Public Management", ["Computer Practice", "Management Communication", "Municipal Administration", "Public Administration", "Public Law", "Public Finance"]], ["Financial Management", ["Computer Practice", "Management Communication", "Entrepreneurship & Business Management", "Financial Accounting", "Cost and Management Accounting"]], ["Human Resource Management", ["Computer Practice", "Management Communication", "Entrepreneurship & Business Management", "Personnel Management", "Labor Relations", "Personnel Training"]], ["Other Courses", ["Tourism / Hospitality & Catering", "Legal Secretary / Medical Secretary", "Municipal Finance Management", "Entrepreneur Development", "Security / Agriculture"]]]],
  ["Matric Re-Write & Extra Classes", [["Subject support", ["Physical Science", "Life Science", "Agriculture Science", "Accounting", "Economics", "Business Studies", "Geography", "Mathematics", "Math’s Literacy", "English", "Afrikaans and Languages"]]]]
] as const;

export const salesItems = [
  ["AI-ready laptops", "Study-ready devices with optional sponsorship support", "From R6,000", "/assets/laptopsale.jpg"],
  ["Textbooks", "Engineering, business, matric and occupational course texts", "From R150", "/assets/booksale.jpg"],
  ["Drawing boards", "Durable technical drawing boards for workshop and studio work", "From R1,800", "/assets/boardsale.jpg"],
  ["Study guides", "Past exam question and answer papers, revision packs and practical guides", "From R150", "/assets/studyguidesale.jpg"]
] as const;

export const partnerServices = [
  {
    id: "tax-exemption",
    label: "Tax exemption",
    title: "Taxation, accounting & business compliance",
    kicker: "03 · Finance and compliance",
    summary: "Build a compliant finance foundation through registered practitioners and specialist partners. NSTC supports tax readiness, accounting systems and evidence-led business compliance.",
    who: "Companies, SMEs, NPOs, NPCs and public-interest organisations.",
    deliverables: ["Annual financial statements and management accounts", "Income Tax, VAT and PAYE preparation and compliance reviews", "SARS verification, audit and dispute-support preparation", "CIPC, company-secretarial and governance administration"],
    guardrail: "Tax advice and submissions must be performed by appropriately registered practitioners; this service is advisory and implementation support, not a substitute for statutory professional registration."
  },
  {
    id: "bbbee",
    label: "B-BBEE Score Card",
    title: "B-BBEE advisory & transformation",
    kicker: "01 · Transformation",
    summary: "Move from scorecard anxiety to a defensible transformation roadmap that connects ownership, management control, skills, procurement and socio-economic development.",
    who: "Large enterprises, SMEs, public entities, multinationals and supply-chain participants.",
    deliverables: ["B-BBEE diagnostic and gap analysis", "Scorecard scenario modelling and annual roadmap", "Skills, procurement, enterprise and supplier-development planning", "Evidence file review, mock verification and executive dashboard"],
    guardrail: "NSTC provides advisory, implementation and verification readiness; it is not presented as an independent SANAS verification agency."
  },
  {
    id: "wsp-atr",
    label: "WSP / ATR",
    title: "Skills audit, WSP/ATR & levy services",
    kicker: "05 · Workforce capability",
    summary: "Turn workforce data into a compliant, fundable and measurable training plan that supports SETA submissions, scarce-skills planning and absorption.",
    who: "Levy-paying employers, HR teams, SDFs, training committees and project employers.",
    deliverables: ["Organisation-wide skills audit and competency-gap analysis", "Workplace Skills Plan and Annual Training Report compilation", "PIVOTAL and mandatory-grant submission support where applicable", "Skills Development Levy strategy and grant tracking"],
    guardrail: "SETA and grant outcomes depend on the applicable scheme, employer profile, evidence quality and statutory deadlines."
  },
  {
    id: "sdl-grant",
    label: "SDL grant",
    title: "Skills development funding readiness",
    kicker: "05 · Funding and evidence",
    summary: "Strengthen the link between the Skills Development Levy, training priorities, compliant evidence and fundable workplace programmes.",
    who: "Employers, training providers and organisations planning learnerships, internships, apprenticeships or bursaries.",
    deliverables: ["Training-needs and critical-skills mapping", "Learnership, internship, apprenticeship and bursary programme selection", "Attendance, agreements, invoices, completion and absorption evidence controls", "Quarterly spend, points and impact tracking"],
    guardrail: "Funding is not guaranteed; submissions remain subject to SETA rules, approved scope and review by the relevant authority."
  },
  {
    id: "csi",
    label: "CSI",
    title: "Socio-economic development & CSI",
    kicker: "02 · Community impact",
    summary: "Design CSI and socio-economic development portfolios that align with applicable codes, community needs and measurable outcomes.",
    who: "Corporate foundations, CSI/ESG teams, mines, manufacturers, NPOs, NGOs and community programmes.", deliverables: ["SED strategy and annual portfolio plan", "Beneficiary due diligence and programme contracting", "Education, bursary, food-security, youth and disability initiatives", "Board, ESG and CSI reporting with beneficiary-impact data"], guardrail: "Targets depend on the applicable B-BBEE code and entity profile; programme claims should be supported by evidence."
  },
  {
    id: "social-labour-plan",
    label: "Social labour plan",
    title: "Mining, SLP & community solutions",
    kicker: "07 · Project and community solutions",
    summary: "Connect mining and infrastructure commitments to practical local skills, supplier development, community participation and transparent evidence.",
    who: "Mines, energy companies, infrastructure partners, municipalities and community-development stakeholders.",
    deliverables: ["Social and Labour Plan implementation support", "Community needs assessment and beneficiary registers", "Local procurement, supplier-development and skills pipelines", "Progress dashboards, stakeholder reporting and evidence packs"],
    guardrail: "Statutory plans and regulated submissions should be reviewed by appropriately qualified specialists and the responsible authority."
  },
  {
    id: "enterprise-development",
    label: "Enterprise development",
    title: "Enterprise & supplier development",
    kicker: "02 · Inclusive value chains",
    summary: "Build stronger suppliers and inclusive value chains by linking beneficiary support to real procurement opportunities instead of treating development as a points exercise.",
    who: "Large buyers, mines, manufacturers, municipalities, SMEs and supplier-development beneficiaries.",
    deliverables: ["Supplier segmentation and diversity mapping", "Beneficiary eligibility and due-diligence support", "Business diagnostics, compliance, finance readiness and operations support", "Mentorship, technical assistance, procurement conversion and impact measurement"],
    guardrail: "Beneficiary eligibility, contribution recognition and procurement outcomes remain subject to the applicable code and documented evidence."
  },
  {
    id: "employment-equity",
    label: "Employment Equity",
    title: "Management control & Employment Equity",
    kicker: "01.2 · Workforce transformation",
    summary: "Translate workforce data and the 2025–2030 sector framework into annual recruitment, promotion, succession and development actions.",
    who: "Employers, HR leadership, transformation committees and public-sector entities.",
    deliverables: ["EE gap analysis and workforce-profile dashboard", "EEA12 analysis and EEA13 five-year plan support", "Numerical goals, targets and progress tracking", "Succession, recruitment, retention and leadership-development actions"],
    guardrail: "Implementation should preserve merit, role requirements, operational continuity and the requirements of the applicable Employment Equity framework."
  },
  {
    id: "hr-staffing",
    label: "HR & staffing",
    title: "Human resources, staffing & placement",
    kicker: "04 · Workforce solutions",
    summary: "Recruit, place, mobilise and develop people through compliant workforce solutions and registered employment-services partners where required.",
    who: "Project employers, manufacturers, mines, SMEs, public entities and candidates.",
    deliverables: ["Permanent and temporary staff sourcing, screening and placement", "Workforce planning and project manpower mobilisation", "Onboarding, contracts, timesheets and workforce reporting", "Candidate database, job matching and employment-relations support"],
    guardrail: "PEA/TES services should only be delivered under required registration or through appropriately registered partners."
  },
  {
    id: "quality-systems",
    label: "ISO systems",
    title: "ISO quality, environment & safety systems",
    kicker: "11 · Management systems",
    summary: "Build practical management systems for quality, environmental responsibility and occupational health and safety with evidence-ready documentation.",
    who: "Industrial firms, mines, construction companies, schools, municipalities and service businesses.",
    deliverables: ["ISO 9001 quality-management system support", "ISO 14001 environmental-management system support", "ISO 45001 occupational-health-and-safety system support", "Policy, procedure, internal-audit and continual-improvement registers"],
    guardrail: "Certification is performed by an independent accredited certification body; NSTC provides preparation and implementation support."
  },
  {
    id: "npo-governance",
    label: "NPO / NPC governance",
    title: "NPO, NPC governance & funding readiness",
    kicker: "14 · Non-profit solutions",
    summary: "Strengthen governance, registration readiness, board systems, proposal quality and donor evidence for organisations delivering public benefit.",
    who: "NPOs, NPCs, NGOs, foundations, community organisations and development agencies.",
    deliverables: ["NPO registration-readiness and NPC/CIPC coordination", "Board charter, conflict-of-interest and delegation frameworks", "Risk registers, policy toolkits and organisational scorecards", "Concept notes, proposals, logframes, budgets and sustainability plans"],
    guardrail: "NPO/NPC registration does not automatically create tax exemption or Section 18A status; regulated applications require appropriately qualified specialists."
  },
  {
    id: "international-trade",
    label: "International trade",
    title: "International partnerships & trade",
    kicker: "16 · Market access",
    summary: "Support responsible South Africa–Africa and international partnership development, trade readiness and market-access pathways.",
    who: "Exporters, manufacturers, investors, development agencies, municipalities and strategic partners.",
    deliverables: ["Market and partner-readiness diagnostics", "Trade and investment opportunity mapping", "Partnership, capability and implementation documentation", "AfCFTA and China–Africa insight briefings with referral support"],
    guardrail: "Customs, legal and regulated trade matters require appropriately qualified professionals and should not be presented as guaranteed market access."
  }
] as const;

export const serviceBorderPalettes = [
  ["#d4af37", "#63a6a6"],
  ["#e07a5f", "#81b29a"],
  ["#6fa3d2", "#d9b44a"],
  ["#c08497", "#72a98f"],
  ["#e09f3e", "#6c91bf"],
  ["#b8a1d9", "#d49a5b"]
] as const;

export const corporateReferences = [
  ["the dtic – B-BBEE Codes, Acts, Strategies & Policies", "https://www.thedtic.gov.za/sectors-and-services-2/industrial-development/b-bbee/"],
  ["B-BBEE Commission – Guidelines", "https://www.bbbeecommission.co.za/"],
  ["SANAS – Accredited Facilities", "https://home.sanas.co.za/"],
  ["Department of Employment and Labour – Employment Equity", "https://www.labour.gov.za/"],
  ["SARS – Register as a Tax Practitioner", "https://www.sars.gov.za/types-of-tax/tax-practitioners/"],
  ["DMRE – Social and Labour Plan guidance", "https://www.dmre.gov.za/"],
  ["Department of Social Development – NPO Directorate", "https://www.dsd.gov.za/"],
  ["CIPC – Non-Profit Company registration", "https://www.cipc.co.za/"],
  ["SARS – Public Benefit Organisations / Section 18A", "https://www.sars.gov.za/types-of-tax/individuals/section-18a/"],
  ["ISO – Management system standards", "https://www.iso.org/standards.html"],
  ["the dtic – AfCFTA", "https://www.thedtic.gov.za/afcfta/"],
  ["FOCAC – Beijing Action Plan", "https://www.focac.org.cn/eng/"]
] as const;

export const partners = [
  ["Stevetshwete", "/assets/stevetshwete.jpg"],
  ["Nkangala", "/assets/nkangala.png"],
  ["Seriti", "/assets/seriti.png"],
  ["Victor Khanye", "/assets/victorkhanye.jpg"],
  ["Thembisile Hani", "/assets/thembisilehani.png"],
  ["Exxaro", "/assets/exxaro.png"],
  ["Eskom", "/assets/eskom.png"],
  ["Transnet", "/assets/transner.jpg"],
  ["MICT SETA", "/assets/mictseta.jpg"],
  ["Thungela", "/assets/thungela.jpg"],
  ["Anglo American", "/assets/angloamerican.png"],
  ["Mafube", "/assets/mafube.jpg"],
  ["Columbus", "/assets/columbus.jpg"],
  ["Samancor", "/assets/samancor.jpg"],
  ["Mwelase", "/assets/mwelasemining.jpg"],
  ["Two Rivers", "/assets/tworivers.png"],
  ["SBV", "/assets/sbv.jpg"]
] as const;

export const qcto = [
  "Bricklayer",
  "Plumbing",
  "Health Promotion Officer",
  "Safety Officer",
  "First Aid",
  "Poultry Farmer",
  "Landscape Gardener",
  "Early Childhood Development",
  "School Principal",
  "Public Administrator",
  "Community Counsellor",
  "Retail Supervisor",
  "Office Administration",
  "Project Manager",
  "Supply Chain Practitioner",
  "Management Accountant",
  "Financial Advisor",
  "Investment Advisor",
  "Sewer"
];

export const seedData: AppData = {
  students: [
    { id: "s1", name: "Thabo Mokoena", email: "thabo.mokoena@example.com", phone: "+27 71 234 8821", studentNo: "NSTC-26-0014", campus: "Wynberg Johannesburg", course: "Electrical Engineering N1–N6", status: "Active", startDate: "2026-02-03", attendance: 94, balance: 0, termAverage: 82, initials: "TM", guardian: "Lerato Mokoena", remarks: "Consistent practical work and strong participation.", subjects: ["Engineering Science", "Mathematics", "Electrical Trade Theory"], courseSubjects: { "Electrical Engineering N1–N6": ["Engineering Science", "Mathematics", "Electrical Trade Theory"] } },
    { id: "s2", name: "Naledi Dlamini", email: "naledi.dlamini@example.com", phone: "+27 82 441 6072", studentNo: "NSTC-26-0027", campus: "Middelburg", course: "Business Management N4–N6", status: "Active", startDate: "2026-02-03", attendance: 88, balance: 4500, termAverage: 76, initials: "ND", guardian: "Mandla Dlamini", remarks: "Shows promise in accounting; follow up on outstanding fees.", subjects: ["Financial Accounting", "Management Communication"], courseSubjects: { "Business Management N4–N6": ["Financial Accounting", "Management Communication"] } },
    { id: "s3", name: "Kagiso Ndlovu", email: "kagiso.ndlovu@example.com", phone: "+27 79 884 1260", studentNo: "NSTC-25-0188", campus: "Wynberg Johannesburg", course: "Occupational Certificate: Bricklayer", status: "Completed", startDate: "2025-01-13", attendance: 91, balance: 0, termAverage: 79, initials: "KN", guardian: "Mpho Ndlovu", remarks: "Eligible for transcript and graduate directory.", subjects: ["Construction Theory", "Bricklaying Practice"], courseSubjects: { "Occupational Certificate: Bricklayer": ["Construction Theory", "Bricklaying Practice"] } },
    { id: "s4", name: "Ayanda Khumalo", email: "ayanda.khumalo@example.com", phone: "+27 76 510 4318", studentNo: "NSTC-24-0092", campus: "Middelburg", course: "Health & Safety Officer", status: "Alumni", startDate: "2024-02-05", attendance: 96, balance: 0, termAverage: 88, initials: "AK", guardian: "Sibusiso Khumalo", remarks: "Alumni mentor for current Health & Safety cohort.", subjects: ["Risk Assessment", "Safety Legislation"], courseSubjects: { "Health & Safety Officer": ["Risk Assessment", "Safety Legislation"] } },
    { id: "s5", name: "Bongani Maseko", email: "bongani.maseko@example.com", phone: "+27 73 119 5524", studentNo: "NSTC-26-0049", campus: "Wynberg Johannesburg", course: "Information Technology", status: "Suspended", startDate: "2026-02-03", attendance: 41, balance: 6800, termAverage: 53, initials: "BM", guardian: "Zanele Maseko", remarks: "Suspended pending attendance and finance review.", subjects: ["Networking", "Technical Support"], courseSubjects: { "Information Technology": ["Networking", "Technical Support"] } },
  ],
  announcements: [
    { id: "a1", title: "Trimester 2 registration is open", body: "Secure your place in the next learning cycle. Registration closes 30 June.", date: "2026-05-18", audience: "All students" },
    { id: "a2", title: "Practical assessment week", body: "Engineering and artisan cohorts should review their published workshop schedules.", date: "2026-05-11", audience: "Engineering & Artisan" },
    { id: "a3", title: "AI Laptop sponsorship drive", body: "Corporate partners can sponsor a learner device through the NSTC office.", date: "2026-04-28", audience: "Partners" },
  ],
  assignments: [
    { id: "as1", title: "Electrical installation rules case study", course: "Electrical Engineering", due: "2026-06-12", status: "Submitted", score: 86 },
    { id: "as2", title: "Management communication presentation", course: "Business Management", due: "2026-06-16", status: "In progress" },
    { id: "as3", title: "Workshop risk assessment", course: "Health & Safety", due: "2026-06-20", status: "Not started" },
  ],
  schedules: [
    { id: "sc1", title: "Engineering Science", kind: "Class", date: "2026-06-08", time: "09:00 – 11:00", location: "Workshop 2 · Wynberg" },
    { id: "sc2", title: "Mathematics N2", kind: "Class", date: "2026-06-09", time: "13:00 – 15:00", location: "Room 4 · Online" },
    { id: "sc3", title: "Trimester 2 examinations", kind: "Exam", date: "2026-06-22", time: "08:30 – 12:30", location: "Main Hall · Wynberg" },
  ],
  payments: [
    { id: "p1", label: "Registration fee", amount: 500, date: "2026-02-01", status: "Paid" },
    { id: "p2", label: "February tuition", amount: 3000, date: "2026-02-03", status: "Paid" },
    { id: "p3", label: "March tuition", amount: 3000, date: "2026-03-03", status: "Paid" },
  ],

  graduateRequests: [],
  suggestions: [],

  apprenticeships: [
    { id: "ap1", title: "Electrical Engineering Apprentice", employer: "Mokoena Power Services", location: "Johannesburg, Gauteng", type: "Apprenticeship · 12 months", closing: "30 Jun 2026", description: "Join a supervised electrical maintenance team while completing workplace experience." },
    { id: "ap2", title: "Junior Boilermaker Internship", employer: "Ubuntu Industrial Works", location: "Middelburg, Mpumalanga", type: "Internship · 6 months", closing: "12 Jul 2026", description: "A practical placement for emerging welders and boilermakers with workshop exposure." },
    { id: "ap3", title: "IT Support Intern", employer: "CivicTech South Africa", location: "Hybrid · Gauteng", type: "Internship · 12 months", closing: "24 Jul 2026", description: "Support internal users, document systems and build real-world technical confidence." }
  ],

  complaints: [
    { id: "cmp1", subject: "Workshop access concern", category: "Complaint", message: "The practical workshop was locked during the scheduled session.", status: "Open", date: "2026-06-08", time: "09:15", name: "Thabo Mokoena", email: "thabo.mokoena@example.com", phone: "+27 71 234 8821" },
    { id: "cmp2", subject: "Anonymous finance concern", category: "Finance support", message: "I need clarification on a payment allocation and prefer not to disclose my identity.", status: "Investigating", date: "2026-06-07", time: "14:40", anonymous: true },
    { id: "cmp3", subject: "Certificate collection query", category: "Query", message: "Please confirm when the completed certificate will be available for collection.", status: "Resolved", date: "2026-06-05", time: "11:05", name: "Kagiso Ndlovu", email: "kagiso.ndlovu@example.com", phone: "+27 79 884 1260" },
    { id: "lcmp1", source: "Lecturer", subject: "Workshop equipment maintenance", category: "Lecturer complaint", message: "The practical bench supply in Workshop 2 has been intermittently unavailable for my morning class.", status: "Acted upon", date: "2026-06-06", time: "10:20", name: "Siyabonga Radebe", email: "lecturer@nstc.example", phone: "+27 71 000 0000", reply: "Maintenance has been scheduled for Workshop 2 before the next practical block.", repliedBy: "Admin · Nomsa Dlamini", repliedAt: "2026-06-07T09:10:00Z" },
    { id: "lcmp2", source: "Lecturer", subject: "Request for updated marking rubric", category: "Lecturer complaint", message: "Please provide the latest marking rubric for the Electrical Trade Theory assignment.", status: "Open", date: "2026-06-08", time: "08:45", name: "Siyabonga Radebe", email: "lecturer@nstc.example", phone: "+27 71 000 0000" }
  ],
  resources: [
    { id: "res1", title: "Electrical installation rules", course: "Electrical Engineering N1–N6", subject: "Engineering Science", fileType: "PDF", published: true, uploaded: "2026-06-02" },
    { id: "res2", title: "Workshop safety checklist", course: "Electrical Engineering N1–N6", subject: "Electrical Trade Theory", fileType: "PDF", published: true, uploaded: "2026-05-28" },
    { id: "res3", title: "Trimester 2 learner guide", course: "Electrical Engineering N1–N6", subject: "Mathematics N2", fileType: "PDF", published: false, uploaded: "2026-06-05" }
  ],
  lecturerNotifications: [
    { id: "ln1", title: "Two submissions need marking", body: "Electrical installation rules has new work from your class.", date: "2026-06-08", read: false },
    { id: "ln2", title: "Attendance reminder", body: "Engineering Science starts at 09:00 in Workshop 2.", date: "2026-06-08", read: false },
    { id: "ln3", title: "Resource published", body: "The learner guide is ready for review.", date: "2026-06-07", read: false },
    { id: "ln4", title: "Timetable updated", body: "The examination hall has been confirmed.", date: "2026-06-06", read: true }
  ],
  lecturers: [
    { id: "lec1", name: "Siyabonga Radebe", email: "siyabonga.radebe@nstc.example", phone: "+27 72 555 0188", employeeNo: "NSTC-L-001", campus: "Wynberg Johannesburg", courses: ["Electrical Engineering N1–N6", "Information Technology"], subjects: ["Engineering Science", "Electrical Trade Theory", "Networking"], status: "Active" },
    { id: "lec2", name: "Mpho Nkosi", email: "mpho.nkosi@nstc.example", phone: "+27 79 222 9011", employeeNo: "NSTC-L-002", campus: "Middelburg", courses: ["Business Management N4–N6"], subjects: ["Financial Accounting", "Management Communication"], status: "Active" }
  ],
  tutors: [
    { name: "Siyabonga Radebe", initials: "SR", email: "siyabonga.radebe@nstc.example", phone: "+27 72 555 0188", courses: ["Electrical Engineering N1–N6", "Engineering Science", "Electrical Trade Theory"] }
  ]
};