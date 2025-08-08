import { Book, FileText, BotMessageSquare, GraduationCap } from 'lucide-react';
import type { Exam, Resource } from './types';

export const exams: Exam[] = [
  { id: 'jee', name: 'JEE (Main and Advanced)' },
  { id: 'neet', name: 'NEET' },
  { id: 'upsc', name: 'UPSC Civil Services' },
  { id: 'cat', name: 'CAT' },
  { id: 'gate', name: 'GATE' },
];

export const resources: Resource[] = [
  {
    title: 'Study Materials',
    description: 'Access curated notes and guides.',
    icon: Book,
    href: '#',
  },
  {
    title: 'Sample Papers',
    description: 'Practice with model question papers.',
    icon: FileText,
    href: '/sample-papers',
  },
  {
    title: 'Previous Year Questions',
    description: 'Analyze past trends with PYQs.',
    icon: GraduationCap,
    href: '/pyq',
  },
  {
    title: 'AI Trainer',
    description: 'Get your doubts cleared instantly.',
    icon: BotMessageSquare,
    href: '/trainer',
  },
];

type Chapter = string;
type Subject = Record<string, Chapter[]>;
type Topics = Record<string, Subject>;


export const topics: Topics = {
    jee: {
        "Physics": [
            "Units and Measurements",
            "Kinematics",
            "Laws of Motion",
            "Work, Energy and Power",
            "Rotational Motion",
            "Gravitation",
            "Properties of Solids and Liquids",
            "Thermodynamics",
            "Kinetic Theory of Gases",
            "Oscillations and Waves",
            "Electrostatics",
            "Current Electricity",
            "Magnetic Effects of Current and Magnetism",
            "Electromagnetic Induction and Alternating Currents",
            "Electromagnetic Waves",
            "Optics",
            "Dual Nature of Matter and Radiation",
            "Atoms and Nuclei",
            "Electronic Devices"
        ],
        "Chemistry": [
            "Some Basic Concepts in Chemistry",
            "States of Matter",
            "Atomic Structure",
            "Chemical Bonding and Molecular Structure",
            "Chemical Thermodynamics",
            "Solutions",
            "Equilibrium",
            "Redox Reactions and Electrochemistry",
            "Chemical Kinetics",
            "Surface Chemistry",
            "Classification of Elements and Periodicity in Properties",
            "p-Block Elements",
            "d- and f-Block Elements",
            "Coordination Compounds",
            "Environmental Chemistry",
            "Purification and Characterisation of Organic Compounds",
            "Some Basic Principles of Organic Chemistry",
            "Hydrocarbons",
            "Organic Compounds Containing Halogens",
            "Organic Compounds Containing Oxygen",
            "Organic Compounds Containing Nitrogen",
            "Polymers",
            "Biomolecules",
            "Chemistry in Everyday Life"
        ],
        "Maths": [
            "Sets, Relations, and Functions",
            "Complex Numbers and Quadratic Equations",
            "Matrices and Determinants",
            "Permutations and Combinations",
            "Binomial Theorem and Its Simple Applications",
            "Sequence and Series",
            "Limit, Continuity and Differentiability",
            "Integral Calculus",
            "Differential Equations",
            "Co-ordinate Geometry",
            "Three Dimensional Geometry",
            "Vector Algebra",
            "Statistics and Probability",
            "Trigonometry",
            "Mathematical Reasoning"
        ]
    },
    neet: {
        "Biology": [
            "Diversity in Living World",
            "Structural Organisation in Animals and Plants",
            "Cell Structure and Function",
            "Plant Physiology",
            "Human Physiology",
            "Reproduction",
            "Genetics and Evolution",
            "Biology and Human Welfare",
            "Biotechnology and Its Applications",
            "Ecology and Environment"
        ],
        "Physics": [
            "Physical World and Measurement",
            "Kinematics",
            "Laws of Motion",
            "Work, Energy, and Power",
            "Motion of System of Particles and Rigid Body",
            "Gravitation",
            "Properties of Bulk Matter",
            "Thermodynamics",
            "Behaviour of Perfect Gas and Kinetic Theory",
            "Oscillations and Waves",
            "Electrostatics",
            "Current Electricity",
            "Magnetic Effects of Current and Magnetism",
            "Electromagnetic Induction and Alternating Currents",
            "Electromagnetic Waves",
            "Optics",
            "Dual Nature of Matter and Radiation",
            "Atoms and Nuclei",
            "Electronic Devices"
        ],
        "Chemistry": [
            "Some Basic Concepts of Chemistry",
            "Structure of Atom",
            "Classification of Elements and Periodicity in Properties",
            "Chemical Bonding and Molecular Structure",
            "States of Matter: Gases and Liquids",
            "Thermodynamics",
            "Equilibrium",
            "Redox Reactions",
            "Hydrogen",
            "s-Block Element (Alkali and Alkaline earth metals)",
            "Some p-Block Elements",
            "Organic Chemistry- Some Basic Principles and Techniques",
            "Hydrocarbons",
            "Environmental Chemistry",
            "Solid State",
            "Solutions",
            "Electrochemistry",
            "Chemical Kinetics",
            "Surface Chemistry",
            "General Principles and Processes of Isolation of Elements",
            "p-Block Elements",
            "d and f Block Elements",
            "Coordination Compounds",
            "Haloalkanes and Haloarenes",
            "Alcohols, Phenols and Ethers",
            "Aldehydes, Ketones and Carboxylic Acids",
            "Organic Compounds Containing Nitrogen",
            "Biomolecules",
            "Polymers",
            "Chemistry in Everyday Life"
        ]
    },
    upsc: {
        "History": [
            "Ancient India",
            "Medieval India",
            "Modern India",
            "World History"
        ],
        "Culture": [
            "Indian Heritage and Culture"
        ],
        "Geography": [
            "Physical Geography",
            "Indian Geography",
            "World Geography"
        ],
        "Polity": [
            "Indian Constitution",
            "Governance",
            "Social Justice",
            "International Relations"
        ],
        "Economy": [
            "Indian Economy",
            "Economic Development"
        ],
        "Environment": [
            "Environment and Ecology"
        ],
        "Science & Tech": [
            "Science and Technology"
        ],
        "Current Affairs": [
            "Recent Events"
        ]
    },
    cat: {
        "Quantitative Aptitude": [
            "Number System",
            "Algebra",
            "Geometry",
            "Modern Math",
            "Arithmetic"
        ],
        "Verbal Ability": [
            "Reading Comprehension",
            "Para-jumbles",
            "Para-summary",
            "Odd one out",
            "Grammar"
        ],
        "Data Interpretation": [
            "Tables",
            "Bar Graphs",
            "Line Charts",
            "Pie Charts",
            "Caselets"
        ],
        "Logical Reasoning": [
            "Seating Arrangement",
            "Blood Relations",
            "Syllogisms",
            "Puzzles"
        ]
    },
    gate: {
        "Computer Science": [
            "Engineering Mathematics",
            "Digital Logic",
            "Computer Organization and Architecture",
            "Programming and Data Structures",
            "Algorithms",
            "Theory of Computation",
            "Compiler Design",
            "Operating System",
            "Databases",
            "Computer Networks"
        ],
        "Mechanical Engineering": [
            "Engineering Mathematics",
            "Applied Mechanics and Design",
            "Fluid Mechanics and Thermal Sciences",
            "Materials, Manufacturing and Industrial Engineering"
        ],
        "Electronics and Communication": [
            "Engineering Mathematics",
            "Networks, Signals and Systems",
            "Electronic Devices",
            "Analog Circuits",
            "Digital Circuits",
            "Control Systems",
            "Communications",
            "Electromagnetics"
        ],
        "Civil Engineering": [
            "Engineering Mathematics",
            "Structural Engineering",
            "Geotechnical Engineering",
            "Water Resources Engineering",
            "Environmental Engineering",
            "Transportation Engineering",
            "Geomatics Engineering"
        ]
    },
}
