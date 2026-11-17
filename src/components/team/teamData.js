/**
 * Team member data — single source of truth for the
 * "The People Behind the Project" section.
 *
 * IMPORTANT: names, PRNs, roles and contribution bullets are the officially
 * assigned project responsibilities. Do not edit without consulting the
 * project documentation.
 */

export const TEAM_SECTION = {
  eyebrow: 'Contributors & Engineering Roles',
  title: 'The People Behind the Project',
  description:
    'Meet the team responsible for bringing HeatShield to life. Each member contributes to a different part of the project, from data analysis and application development to database management.',
};

export const teamMembers = [
  {
    id: 'furqan-bagwan',
    name: 'Furqan Bagwan',
    prn: 'SCFU425004',
    role: 'Frontend Developer',
    accentLight: '#0071e3',
    accentDark: '#2997ff',
    contributions: [
      'Developed the frontend interface of the HeatShield platform.',
      'Worked on the user interface and page layouts.',
      'Implemented frontend components and visual elements.',
      'Contributed to the overall user experience and responsive design.',
      'Worked on integrating the frontend with the other project components.',
    ],
  },
  {
    id: 'aman-shaikh',
    name: 'Aman Shaikh',
    prn: 'SCFU425013',
    role: 'Exploratory Data Analysis and Data Visualization (EDADV)',
    accentLight: '#ea580c',
    accentDark: '#f97316',
    contributions: [
      'Worked on Exploratory Data Analysis of the HeatShield dataset.',
      'Performed data exploration and statistical analysis.',
      'Worked with Python libraries such as NumPy and Pandas.',
      'Created data visualizations to understand environmental patterns.',
      'Analysed relationships between temperature, vegetation, and built-up indices.',
      'Contributed to interpreting the results and identifying important insights.',
    ],
  },
  {
    id: 'bhavin-shankur',
    name: 'Bhavin Shankur',
    prn: 'SCFU425014',
    role: 'Backend Developer and Database Management',
    accentLight: '#059669',
    accentDark: '#10b981',
    contributions: [
      'Designed and implemented the backend architecture.',
      'Worked on database design and data management.',
      'Developed backend functionality and application logic.',
      'Worked on database integration and data handling.',
      "Contributed to connecting the project's data and application components.",
    ],
  },
];
