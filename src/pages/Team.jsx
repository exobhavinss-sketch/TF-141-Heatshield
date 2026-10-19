import React from 'react';
import { Link } from 'react-router-dom';

export default function Team() {
  const teamMembers = [
    {
      initials: 'FB',
      name: 'Furqan Bagwan',
      studentId: 'SCFU425004',
      role: 'Frontend Development',
      roleCategory: 'FSD-1',
      avatarBg: 'bg-primary-container text-on-primary',
      idBadge: 'bg-primary-fixed text-on-primary-fixed',
      accentColor: 'text-secondary',
      description:
        "Responsible for building the user interface, page layouts, reusable components, and navigation that make HeatShield's analytical capabilities accessible.",
      competencies: 'UI Architecture · Reusable Components · Responsive Views',
    },
    {
      initials: 'AS',
      name: 'Aman Shaikh',
      studentId: 'SCFU425013',
      role: 'EDA & Data Visualization',
      roleCategory: 'EDA & DV',
      avatarBg: 'bg-tertiary-container text-on-tertiary',
      idBadge: 'bg-tertiary-fixed text-on-tertiary-fixed',
      accentColor: 'text-tertiary',
      description:
        'Responsible for exploring the dataset, conducting analytical investigations, developing visualizations, and communicating patterns found in the simulated data.',
      competencies: 'Statistical EDA · Thermal Correlation · Interactive Charts',
    },
    {
      initials: 'BS',
      name: 'Bhavin Shankur',
      studentId: 'SCFU425014',
      role: 'Backend Development & Database',
      roleCategory: 'DBMS',
      avatarBg: 'bg-secondary text-on-secondary',
      idBadge: 'bg-secondary-fixed text-on-secondary-fixed',
      accentColor: 'text-secondary',
      description:
        'Responsible for backend functionality, database architecture, data management, API integration, and the underlying application logic.',
      competencies: 'Relational Schema · REST APIs · Simulation Pipeline',
    },
  ];

  const workstreams = [
    {
      id: '01 / FRONTEND',
      badgeClass: 'bg-surface-container text-primary',
      owner: 'Furqan Bagwan',
      title: 'Frontend Development (FSD-1)',
      titleColor: 'text-primary',
      summary:
        'Engineering an accessible, research-grade analytical dashboard interface conforming to strict academic readability standards.',
      checkColor: 'text-secondary',
      responsibilities: [
        'User interface engineering & responsive page layouts',
        'Reusable React components & spatial UI architecture',
        'Navigation paradigms and telemetry viewports',
        'Presentation of complex urban heat indices and findings',
        'Direct integration with backend query services & endpoints',
      ],
      deliverable:
        'A cohesive, responsive web interface for the complete HeatShield spatial analytics platform.',
    },
    {
      id: '02 / EDA & DV',
      badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
      owner: 'Aman Shaikh',
      title: 'Exploratory Data Analysis & Visualization',
      titleColor: 'text-tertiary',
      summary:
        'Translating high-dimensional simulated temperature data into structured thermal correlations and actionable visual matrices.',
      checkColor: 'text-tertiary',
      responsibilities: [
        'Dataset inspection, null value handling & data cleaning',
        'Exploratory analysis and descriptive spatial statistics',
        'Identification of thermal anomalies & canopy correlations',
        'Chart generation, microclimate heat index plots & histograms',
        'Interpretation and narrative synthesis of scientific findings',
      ],
      deliverable:
        'An organized analytical workflow and meaningful visualizations of the simulated urban heat dataset.',
    },
    {
      id: '03 / DBMS & BACKEND',
      badgeClass: 'bg-secondary-fixed text-on-secondary-fixed-variant',
      owner: 'Bhavin Shankur',
      title: 'Database Management & Backend (DBMS)',
      titleColor: 'text-secondary',
      summary:
        'Structuring 150,000 synthetic microclimate spatial records into a performant relational repository with resilient API pipelines.',
      checkColor: 'text-secondary',
      responsibilities: [
        'Relational database design, normalization & schema indices',
        'Data integrity constraints, coordinates & spatial partitioning',
        'Backend query optimization, filtering & REST routing',
        'High-throughput JSON retrieval for front-facing ledger views',
        'Simulation pipeline synchronization across project modules',
      ],
      deliverable:
        'A structured data layer and backend services supporting the HeatShield application.',
    },
  ];

  const inquiries = [
    {
      id: 'INQUIRY 01',
      title: 'Air vs. Surface Temperature',
      text: 'How do ambient 2-meter air temperature and radiometric land surface temperature (LST) diverge across high-density residential and open basalt plains?',
      span: '',
    },
    {
      id: 'INQUIRY 02',
      title: 'Canopy & Impervious Correlation',
      text: 'How are Normalized Difference Vegetation Index (NDVI), built-up surface fractions, and diurnal peak heating correlated in the modeled Solapur grid?',
      span: '',
    },
    {
      id: 'INQUIRY 03',
      title: 'Spatio-Temporal Variance',
      text: 'How do modeled heat-risk scores vary between pre-monsoon heatwaves (March–May) and winter baseline conditions across administrative wards?',
      span: '',
    },
    {
      id: 'INQUIRY 04',
      title: 'Cooling Priority Scoring',
      text: 'Which locations receive elevated cooling-priority weights based on synthetic demographic density and extreme thermal exposure metrics?',
      span: '',
    },
    {
      id: 'INQUIRY 05',
      title: 'Targeted Urban Interventions',
      text: 'What specific mitigation typologies—such as cool roofs (high albedo), linear roadside tree canopies, or shaded pedestrian promenades—produce the highest modeled temperature reduction per square meter?',
      span: 'md:col-span-2 lg:col-span-2',
    },
  ];

  const pipelineStages = [
    {
      num: 'STAGE 01',
      icon: 'database',
      color: 'text-primary',
      title: 'Synthetic Dataset',
      desc: '150k spatial records generated with microclimate parameters.',
      output: 'Output: CSV / GeoJSON',
      cardBg: 'bg-surface-container',
    },
    {
      num: 'STAGE 02',
      icon: 'storage',
      color: 'text-secondary',
      title: 'Database & APIs',
      desc: 'PostgreSQL schema, indexed coordinates, REST endpoints.',
      output: 'Output: Structured SQL / API',
      cardBg: 'bg-surface-container',
    },
    {
      num: 'STAGE 03',
      icon: 'analytics',
      color: 'text-tertiary',
      title: 'EDA & Analytics',
      desc: 'Pandas, NumPy, statistical distributions, thermal metrics.',
      output: 'Output: Aggregated Metrics',
      cardBg: 'bg-surface-container',
    },
    {
      num: 'STAGE 04',
      icon: 'dashboard',
      color: 'text-primary-container',
      title: 'Web Dashboard',
      desc: 'React, Tailwind CSS, Leaflet spatial heat maps, Recharts.',
      output: 'Output: Interactive Ledger',
      cardBg: 'bg-surface-container',
    },
    {
      num: 'STAGE 05',
      icon: 'park',
      color: 'text-secondary-fixed',
      title: 'Cooling Strategies',
      desc: 'Priority scoring, canopy targeting & reflective surfaces.',
      output: 'Output: Mitigation Scores',
      cardBg: 'bg-primary-container text-on-primary',
      isAccent: true,
    },
  ];

  const motivations = [
    {
      num: '01',
      color: 'text-primary',
      title: 'Understand Urban Heat Patterns',
      desc: 'Explore how temperature distributions, microclimatic variance, and urban characteristics interact within a structured, reproducible academic simulation.',
      tag: 'Microclimate Science',
      span: '',
    },
    {
      num: '02',
      color: 'text-secondary',
      title: 'Make Complex Data Easier to Interpret',
      desc: 'Combine statistical methods and interactive visual charts to translate 150,000 spatial observations into intuitive, legible patterns.',
      tag: 'Visual Communication',
      span: '',
    },
    {
      num: '03',
      color: 'text-tertiary',
      title: 'Connect Data to Possible Actions',
      desc: 'Present candidate cooling interventions and modeled priority scores that help researchers and urban planners frame concrete local mitigation hypotheses.',
      tag: 'Planning Strategies',
      span: '',
    },
    {
      num: '04',
      color: 'text-primary-container',
      title: 'Integrate Core Engineering Disciplines',
      desc: 'Demonstrate how modern frontend engineering, asynchronous backend services, relational database schemas, and exploratory scientific analytics converge seamlessly in a single production-grade web system.',
      tag: 'Integrated Curriculum',
      span: 'lg:col-span-2',
    },
    {
      num: '05',
      color: 'text-on-surface',
      title: 'Build Practical Technical Skills',
      desc: 'Apply rigorous software engineering principles, normalized database architectures, data cleansing pipelines, and spatial cartography in a team capstone.',
      tag: 'Engineering Rigor',
      span: '',
    },
  ];

  const objectives = [
    {
      num: '01',
      title: 'Organize Simulated Dataset',
      desc: "Clean and curate the project's simulated environmental dataset for systematic, queryable analysis.",
    },
    {
      num: '02',
      title: 'Structured Relational Database',
      desc: 'Develop a normalized relational schema and supporting backend endpoints for sub-millisecond data retrieval.',
    },
    {
      num: '03',
      title: 'Exploratory Correlation Analysis',
      desc: 'Explore temperature patterns, vegetative indices, and density variables through rigorous Python EDA workflows.',
    },
    {
      num: '04',
      title: 'Comparative Visualization Suite',
      desc: 'Create clear visualizations, thermal distribution charts, and spatial comparative plots for heat indicators.',
    },
    {
      num: '05',
      title: 'Candidate Cooling Priority Engine',
      desc: 'Present modeled heat-risk clusters and algorithmic cooling-priority recommendations across wards.',
    },
    {
      num: '06',
      title: 'Integrated Interactive Web Platform',
      desc: 'Integrate analytical data, database engines, and cartographic layers into an accessible responsive web interface.',
    },
    {
      num: '07',
      title: 'Transparent Scientific Documentation',
      desc: 'Document the underlying methodology, simulation assumptions, data limitations, and findings transparently.',
    },
  ];

  const techPillars = [
    {
      num: 'Pillar 01',
      icon: 'devices',
      title: 'Frontend Development',
      badgeBg: 'bg-primary-fixed text-on-primary-fixed',
      titleColor: 'text-primary',
      desc: 'Component-driven architecture prioritizing spatial layout rigor, tabular data density, and sub-100ms user interaction responses.',
      tags: ['React 18', 'Vite', 'JavaScript ES6+', 'Tailwind CSS', 'Leaflet GIS', 'Recharts'],
    },
    {
      num: 'Pillar 02',
      icon: 'database',
      title: 'Database & Backend',
      badgeBg: 'bg-secondary-fixed text-on-secondary-fixed',
      titleColor: 'text-secondary',
      desc: 'Relational modeling designed for geographic indexing, parametric query execution, and high-efficiency JSON streaming.',
      tags: ['Relational Schema', 'REST API Layer', 'Validation Pipeline', 'Node.js', 'Python FastAPI', 'SQL Indexing'],
    },
    {
      num: 'Pillar 03',
      icon: 'insights',
      title: 'EDA & Data Visualization',
      badgeBg: 'bg-tertiary-fixed text-on-tertiary-fixed',
      titleColor: 'text-tertiary',
      desc: 'Mathematical data exploration examining thermal variations, spatial regressions, and multi-factor urban surface indices.',
      tags: ['Python 3.11', 'Pandas', 'NumPy', 'Scientific Plotting', 'GeoPandas', 'Spatial Aggregation'],
    },
  ];

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* SECTION B: HERO */}
      <section className="w-full bg-surface py-space-xl border-b border-outline-variant/30">
        <div className="max-w-[1400px] mx-auto px-margin">
          {/* Top Eyebrow & Coordinate Metadata Pill Bar */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
            <div className="flex flex-wrap items-center gap-space-xs">
              <span className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-DEFAULT bg-primary-container text-on-primary font-label-code text-label-code uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed"></span>
                TF-141 | INTEGRATED SEMESTER PROJECT
              </span>
              <span className="inline-flex items-center px-space-sm py-1 rounded-DEFAULT bg-surface-container font-label-code text-label-code text-on-surface-variant">
                ACADEMIC YEAR 2024–2025
              </span>
            </div>
            <div className="flex items-center gap-space-xs px-space-sm py-1 rounded-DEFAULT bg-surface-container-high font-label-code text-label-code text-on-surface">
              <span className="material-symbols-outlined text-secondary text-[14px]">grid_4x4</span>
              <span>17.6599° N, 75.9064° E</span>
              <span className="text-outline">·</span>
              <span className="text-on-surface-variant">EPSG:4326 (WGS 84)</span>
            </div>
          </div>

          {/* Main Headline & Subtitle */}
          <div className="max-w-4xl space-y-space-md mb-space-lg">
            <h1 className="font-headline-xl text-headline-xl text-primary font-semibold tracking-tight">
              Meet the Team Behind HeatShield
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              An interdisciplinary academic project combining full-stack development, database management, and data analytics to explore urban heat exposure and support informed cooling strategies for Solapur, Maharashtra.
            </p>
          </div>

          {/* Metadata Pill Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter pt-space-md bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30">
            <div className="flex flex-col">
              <span className="font-caption-caps text-caption-caps uppercase text-outline mb-1">Project Identifier</span>
              <span className="font-headline-md text-headline-md text-primary font-bold">HeatShield</span>
              <span className="font-label-code text-label-code text-on-surface-variant">v2.4 Synthetic Model</span>
            </div>
            <div className="flex flex-col">
              <span className="font-caption-caps text-caption-caps uppercase text-outline mb-1">Task Force Allocation</span>
              <span className="font-headline-md text-headline-md text-primary font-bold">TF-141</span>
              <span className="font-label-code text-label-code text-on-surface-variant">3 Investigators</span>
            </div>
            <div className="flex flex-col">
              <span className="font-caption-caps text-caption-caps uppercase text-outline mb-1">Target Study Domain</span>
              <span className="font-headline-md text-headline-md text-primary font-bold">Solapur, MH</span>
              <span className="font-label-code text-label-code text-on-surface-variant">Semi-Arid Urban Canopy</span>
            </div>
            <div className="flex flex-col">
              <span className="font-caption-caps text-caption-caps uppercase text-outline mb-1">Disciplines Synthesized</span>
              <span className="font-headline-md text-headline-md text-primary font-bold">FSD · DBMS · EDA</span>
              <span className="font-label-code text-label-code text-secondary font-medium">Cross-Disciplinary Integration</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: TEAM INFORMATION */}
      <section className="w-full bg-surface-container-low py-space-xl border-b border-outline-variant/30">
        <div className="max-w-[1400px] mx-auto px-margin">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-lg gap-space-sm">
            <div>
              <span className="font-caption-caps text-caption-caps uppercase text-secondary font-semibold tracking-wider block mb-space-xs">
                Contributors &amp; Engineering Roles
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                The People Behind the Project
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Three contributors. Three complementary responsibilities. One integrated platform for computational thermal resilience.
            </p>
          </div>

          {/* 3 Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {teamMembers.map((member) => (
              <div
                key={member.studentId}
                className="bg-surface-container-lowest rounded-xl p-space-lg flex flex-col justify-between shadow-sm border border-outline-variant/30 transition-transform duration-200 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-space-md">
                    <div
                      className={`w-14 h-14 rounded-full ${member.avatarBg} flex items-center justify-center font-headline-md text-headline-md font-bold shadow-sm`}
                    >
                      {member.initials}
                    </div>
                    <span
                      className={`px-space-sm py-1 rounded-DEFAULT ${member.idBadge} font-label-code text-label-code font-semibold uppercase tracking-wider`}
                    >
                      {member.studentId}
                    </span>
                  </div>
                  <div className="mb-space-sm">
                    <span className={`font-caption-caps text-caption-caps uppercase ${member.accentColor} font-semibold tracking-widest block mb-0.5`}>
                      {member.role}
                    </span>
                    <h3 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                      {member.name}
                    </h3>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-md">
                    {member.description}
                  </p>
                </div>
                <div className="pt-space-md mt-space-sm bg-surface-container-low -mx-space-lg -mb-space-lg p-space-md rounded-b-xl flex flex-col gap-1.5 border-t border-outline-variant/20">
                  <span className="font-caption-caps text-caption-caps uppercase text-outline">Core Competencies</span>
                  <span className={`font-label-code text-label-code ${member.accentColor} font-medium`}>
                    {member.competencies}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION D: WORK DISTRIBUTION */}
      <section className="w-full bg-surface py-space-xl border-b border-outline-variant/30">
        <div className="max-w-[1400px] mx-auto px-margin">
          <div className="mb-space-lg">
            <span className="font-caption-caps text-caption-caps uppercase text-secondary font-semibold tracking-wider block mb-space-xs">
              Modular Task Architecture
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold mb-space-xs">
              How We Divide the Work
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Each workstream contributes to a single integrated computational platform.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            {workstreams.map((ws) => (
              <div
                key={ws.id}
                className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-space-sm mb-space-md border-b border-outline-variant/20">
                    <span className={`font-label-code text-label-code font-semibold px-2 py-0.5 rounded-DEFAULT ${ws.badgeClass}`}>
                      {ws.id}
                    </span>
                    <span className="font-caption-caps text-caption-caps uppercase text-outline">
                      Owner: {ws.owner}
                    </span>
                  </div>
                  <h3 className={`font-headline-md text-headline-md ${ws.titleColor} font-semibold mb-space-xs`}>
                    {ws.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                    {ws.summary}
                  </p>
                  <div className="space-y-space-xs mb-space-md">
                    <span className="font-caption-caps text-caption-caps uppercase text-outline block mb-1">
                      Key Responsibilities
                    </span>
                    <ul className="space-y-2 font-body-sm text-body-sm text-on-surface">
                      {ws.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className={`material-symbols-outlined text-[16px] ${ws.checkColor} mt-0.5 shrink-0`}>
                            check_circle
                          </span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="p-space-md bg-surface-container rounded-lg mt-space-md border border-outline-variant/20">
                  <span className="font-caption-caps text-caption-caps uppercase text-outline block mb-1">
                    Formal Deliverable
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface font-medium leading-relaxed">
                    {ws.deliverable}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION E: PROJECT TOPIC AND EXPLANATION */}
      <section className="w-full bg-surface-container-low py-space-xl border-b border-outline-variant/30">
        <div className="max-w-[1400px] mx-auto px-margin">
          {/* Section Intro */}
          <div className="max-w-3xl mb-space-xl">
            <span className="font-caption-caps text-caption-caps uppercase text-secondary font-semibold tracking-wider block mb-space-xs">
              Domain Explanation &amp; Rationale
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold mb-space-xs">
              What Is HeatShield?
            </h2>
            <p className="font-headline-md text-headline-md text-primary font-semibold mb-space-md">
              Understanding Urban Heat. Visualizing Risk. Exploring Cooling Strategies.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-space-sm">
              HeatShield is an academic investigation into how dense urban typologies, localized vegetation variations, and built-up land covers amplify surface temperatures across Solapur, Maharashtra. Designed as a unified semester capstone across Full Stack Development, Relational Databases, and Exploratory Data Analysis, the platform transforms a synthetic 150,000-point microclimate dataset into an accessible urban planning support tool.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              By combining spatial models with empirical climate resilience rubrics, HeatShield calculates priority cooling zones and estimates the theoretical mitigation value of reflective surfaces, urban tree canopies, and ventilation corridors.
            </p>
          </div>

          {/* Core Research Questions Bento */}
          <div className="mb-space-xl">
            <h3 className="font-headline-md text-headline-md text-on-surface font-semibold mb-space-md flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">psychology_alt</span>
              Core Research Inquiries
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className={`bg-surface-container-lowest p-space-md rounded-xl shadow-sm border border-outline-variant/30 ${inq.span}`}
                >
                  <span className="font-label-code text-label-code text-secondary block mb-1 font-semibold">
                    {inq.id}
                  </span>
                  <h4 className="font-headline-md text-headline-md text-on-surface font-semibold mb-1">
                    {inq.title}
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {inq.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture Pipeline Diagram */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-space-lg gap-space-xs">
              <div>
                <span className="font-caption-caps text-caption-caps uppercase text-outline">System Workflow</span>
                <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  End-to-End Data Processing Pipeline
                </h3>
              </div>
              <span className="font-label-code text-label-code text-secondary bg-surface-container px-space-sm py-1 rounded-DEFAULT font-semibold">
                150,000 SYNTHETIC SENSORY RECORDS
              </span>
            </div>

            {/* Flow Visual */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-space-sm">
              {pipelineStages.map((stg) => (
                <div
                  key={stg.num}
                  className={`p-space-md rounded-lg flex flex-col justify-between border border-outline-variant/20 ${stg.cardBg}`}
                >
                  <div className="flex items-center justify-between mb-space-sm">
                    <span
                      className={`font-label-code text-label-code font-semibold ${
                        stg.isAccent ? 'text-secondary-fixed' : 'text-outline'
                      }`}
                    >
                      {stg.num}
                    </span>
                    <span className={`material-symbols-outlined text-[18px] ${stg.color}`}>
                      {stg.icon}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`font-headline-md text-headline-md block mb-0.5 font-semibold ${
                        stg.isAccent ? 'text-on-primary' : stg.color
                      }`}
                    >
                      {stg.title}
                    </span>
                    <p
                      className={`font-body-sm text-body-sm ${
                        stg.isAccent ? 'text-on-primary-container' : 'text-on-surface-variant'
                      }`}
                    >
                      {stg.desc}
                    </p>
                  </div>
                  <div className="mt-space-sm pt-space-xs border-t border-outline-variant/10">
                    <span
                      className={`font-caption-caps text-caption-caps uppercase ${
                        stg.isAccent ? 'text-primary-fixed' : 'text-outline'
                      }`}
                    >
                      {stg.output}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION F: PURPOSE AND MOTIVATION */}
      <section className="w-full bg-surface py-space-xl border-b border-outline-variant/30">
        <div className="max-w-[1400px] mx-auto px-margin">
          <div className="mb-space-lg">
            <span className="font-caption-caps text-caption-caps uppercase text-secondary font-semibold tracking-wider block mb-space-xs">
              Academic Rationale
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold mb-space-xs">
              Why We Are Building HeatShield
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Five core principles shaping our computational inquiry and design choices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {motivations.map((item) => (
              <div
                key={item.num}
                className={`bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col justify-between ${item.span}`}
              >
                <div>
                  <div className={`w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center ${item.color} mb-space-md font-label-code text-label-code font-bold`}>
                    {item.num}
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-semibold mb-space-xs">
                    {item.title}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <span className="font-caption-caps text-caption-caps uppercase text-outline mt-space-md pt-space-sm border-t border-outline-variant/20 block">
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION G: PROJECT OBJECTIVES */}
      <section className="w-full bg-surface-container-low py-space-xl border-b border-outline-variant/30">
        <div className="max-w-[1400px] mx-auto px-margin">
          <div className="mb-space-lg">
            <span className="font-caption-caps text-caption-caps uppercase text-secondary font-semibold tracking-wider block mb-space-xs">
              Measurable Milestones
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold mb-space-xs">
              What We Aim to Achieve
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Seven systematic objectives delivering an end-to-end academic simulation.
            </p>
          </div>

          {/* Clean 7-point Structured Ledger */}
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/30">
            <div className="divide-y divide-outline-variant/20">
              {objectives.map((obj) => (
                <div
                  key={obj.num}
                  className="p-space-md flex items-center justify-between hover:bg-surface-container-low transition-colors"
                >
                  <div className="flex items-center gap-space-md">
                    <span className="font-label-code text-label-code font-bold text-secondary w-8 shrink-0">
                      {obj.num}
                    </span>
                    <div>
                      <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">
                        {obj.title}
                      </h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {obj.desc}
                      </p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 ml-space-sm">
                    check_circle
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION H: TECHNOLOGY AND ACADEMIC INTEGRATION */}
      <section className="w-full bg-surface py-space-xl border-b border-outline-variant/30">
        <div className="max-w-[1400px] mx-auto px-margin">
          <div className="mb-space-lg">
            <span className="font-caption-caps text-caption-caps uppercase text-secondary font-semibold tracking-wider block mb-space-xs">
              Technical Stack &amp; Stack Architecture
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold mb-space-xs">
              Where Engineering Meets Data
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              A synchronized stack across the three academic specializations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {techPillars.map((p) => (
              <div
                key={p.num}
                className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-lg ${p.badgeBg} flex items-center justify-center mb-space-md font-bold`}>
                    <span className="material-symbols-outlined text-[20px]">{p.icon}</span>
                  </div>
                  <span className="font-caption-caps text-caption-caps uppercase text-outline block mb-1">
                    {p.num}
                  </span>
                  <h3 className={`font-headline-md text-headline-md ${p.titleColor} font-semibold mb-space-sm`}>
                    {p.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-space-xs">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-surface-container rounded-DEFAULT font-label-code text-label-code text-on-surface font-medium border border-outline-variant/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION I: ACADEMIC SCOPE AND DATA TRANSPARENCY */}
      <section className="w-full bg-surface-container-low py-space-xl border-b border-outline-variant/30">
        <div className="max-w-[1400px] mx-auto px-margin">
          <div className="mb-space-md">
            <span className="font-caption-caps text-caption-caps uppercase text-outline block mb-space-xs">
              Research Integrity &amp; Limitations
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-semibold">
              An Academic Simulation, Clearly Documented
            </h2>
          </div>

          {/* Prominent Disclosure Panel */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30">
            <div className="flex flex-col sm:flex-row items-start gap-space-md">
              <div className="w-12 h-12 rounded-lg bg-surface-container-high flex-shrink-0 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[26px]">verified</span>
              </div>
              <div className="space-y-space-sm max-w-4xl">
                <div className="flex flex-wrap items-center gap-space-xs">
                  <span className="font-label-code text-label-code px-2 py-0.5 rounded-DEFAULT bg-surface-container font-semibold uppercase text-primary">
                    PROVENANCE DISCLOSURE · SOLAPUR STUDY
                  </span>
                  <span className="font-caption-caps text-caption-caps text-outline uppercase">
                    Peer-Review Version 2.4
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                  HeatShield uses a synthetic academic microclimate simulation dataset for Solapur, Maharashtra. The results are intended for educational analysis and demonstration and must not be interpreted as official meteorological measurements or verified real-world observations.
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Modeled cooling-priority scores and intervention rankings are analytical outputs of the project's methodology, not official government recommendations. Real-world civic cooling interventions require field thermography, localized environmental impact assessments, and municipal stakeholder approvals.
                </p>
                <div className="pt-space-xs flex flex-wrap items-center gap-space-md font-label-code text-label-code text-outline">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">school</span>
                    MIT Vishwaprayag University
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">folder</span>
                    Dept. of Computer Science &amp; Engineering
                  </span>
                  <span>·</span>
                  <span>Academic Simulation Model 2021–2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION J: CLOSING CTA */}
      <section className="w-full bg-surface-container-high py-space-xl">
        <div className="max-w-[1400px] mx-auto px-margin">
          <div className="bg-primary text-on-primary rounded-xl p-space-lg md:p-space-xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-space-lg">
            <div className="max-w-2xl space-y-space-sm">
              <span className="font-caption-caps text-caption-caps uppercase text-secondary-fixed tracking-widest block font-semibold">
                EXPLORE THE PLATFORM
              </span>
              <h2 className="font-headline-xl text-headline-xl text-on-primary font-semibold tracking-tight">
                One Team. One Platform. A Clearer View of Urban Heat.
              </h2>
              <p className="font-body-lg text-body-lg text-inverse-on-surface leading-relaxed">
                HeatShield brings together software engineering, data management, and analytical thinking to explore urban heat patterns and communicate possible cooling strategies through an integrated academic project.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-space-sm flex-shrink-0">
              <Link
                to="/heat-map"
                className="inline-flex items-center justify-center gap-space-xs px-space-lg h-11 rounded-lg bg-secondary-fixed text-on-secondary-fixed font-headline-md text-headline-md font-semibold hover:bg-secondary-fixed-dim transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">map</span>
                <span>Explore Heat Map</span>
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-space-xs px-space-lg h-11 rounded-lg bg-surface-container-lowest/10 text-on-primary font-headline-md text-headline-md font-semibold hover:bg-surface-container-lowest/20 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">analytics</span>
                <span>Open Heat Analytics</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
