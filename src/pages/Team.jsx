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
      avatarBg: 'bg-[#0071e3] text-white',
      accentColor: 'text-[#0071e3]',
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
      avatarBg: 'bg-[#ea580c] text-white',
      accentColor: 'text-[#ea580c]',
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
      avatarBg: 'bg-[#059669] text-white',
      accentColor: 'text-[#059669]',
      description:
        'Responsible for backend functionality, database architecture, data management, API integration, and the underlying application logic.',
      competencies: 'Relational Schema · REST APIs · Simulation Pipeline',
    },
  ];

  const workstreams = [
    {
      id: '01 / FRONTEND',
      owner: 'Furqan Bagwan',
      title: 'Frontend Development (FSD-1)',
      summary:
        'Engineering an accessible, research-grade analytical dashboard interface conforming to strict academic readability standards.',
      checkColor: 'text-[#0071e3]',
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
      owner: 'Aman Shaikh',
      title: 'Exploratory Data Analysis & Visualization',
      summary:
        'Translating high-dimensional simulated temperature data into structured thermal correlations and actionable visual matrices.',
      checkColor: 'text-[#ea580c]',
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
      owner: 'Bhavin Shankur',
      title: 'Database Management & Backend (DBMS)',
      summary:
        'Structuring 150,000 synthetic microclimate spatial records into a performant relational repository with resilient API pipelines.',
      checkColor: 'text-[#059669]',
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
      color: 'text-[#0071e3]',
      title: 'Synthetic Dataset',
      desc: '150k spatial records generated with microclimate parameters.',
      output: 'Output: CSV / GeoJSON',
    },
    {
      num: 'STAGE 02',
      icon: 'storage',
      color: 'text-[#059669]',
      title: 'Database & APIs',
      desc: 'PostgreSQL schema, indexed coordinates, REST endpoints.',
      output: 'Output: Structured SQL / API',
    },
    {
      num: 'STAGE 03',
      icon: 'analytics',
      color: 'text-[#ea580c]',
      title: 'EDA & Analytics',
      desc: 'Pandas, NumPy, statistical distributions, thermal metrics.',
      output: 'Output: Aggregated Metrics',
    },
    {
      num: 'STAGE 04',
      icon: 'dashboard',
      color: 'text-[#0071e3]',
      title: 'Web Dashboard',
      desc: 'React, Tailwind CSS, Leaflet spatial heat maps, Recharts.',
      output: 'Output: Interactive Ledger',
    },
    {
      num: 'STAGE 05',
      icon: 'park',
      color: 'text-[#059669]',
      title: 'Cooling Strategies',
      desc: 'Priority scoring, canopy targeting & reflective surfaces.',
      output: 'Output: Mitigation Scores',
      isAccent: true,
    },
  ];

  const motivations = [
    {
      num: '01',
      color: 'text-[#0071e3]',
      title: 'Understand Urban Heat Patterns',
      desc: 'Explore how temperature distributions, microclimatic variance, and urban characteristics interact within a structured, reproducible academic simulation.',
      tag: 'Microclimate Science',
      span: '',
    },
    {
      num: '02',
      color: 'text-[#059669]',
      title: 'Make Complex Data Easier to Interpret',
      desc: 'Combine statistical methods and interactive visual charts to translate 150,000 spatial observations into intuitive, legible patterns.',
      tag: 'Visual Communication',
      span: '',
    },
    {
      num: '03',
      color: 'text-[#ea580c]',
      title: 'Connect Data to Possible Actions',
      desc: 'Present candidate cooling interventions and modeled priority scores that help researchers and urban planners frame concrete local mitigation hypotheses.',
      tag: 'Planning Strategies',
      span: '',
    },
    {
      num: '04',
      color: 'text-[#0071e3]',
      title: 'Integrate Core Engineering Disciplines',
      desc: 'Demonstrate how modern frontend engineering, asynchronous backend services, relational database schemas, and exploratory scientific analytics converge seamlessly in a single production-grade web system.',
      tag: 'Integrated Curriculum',
      span: 'lg:col-span-2',
    },
    {
      num: '05',
      color: 'text-[#1d1d1f]',
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
      badgeBg: 'bg-[#0071e3]/10 text-[#0071e3]',
      titleColor: 'text-[#0071e3]',
      desc: 'Component-driven architecture prioritizing spatial layout rigor, tabular data density, and sub-100ms user interaction responses.',
      tags: ['React 18', 'Vite', 'JavaScript ES6+', 'Tailwind CSS', 'Leaflet GIS', 'Recharts'],
    },
    {
      num: 'Pillar 02',
      icon: 'database',
      title: 'Database & Backend',
      badgeBg: 'bg-[#059669]/10 text-[#059669]',
      titleColor: 'text-[#059669]',
      desc: 'Relational modeling designed for geographic indexing, parametric query execution, and high-efficiency JSON streaming.',
      tags: ['Relational Schema', 'REST API Layer', 'Validation Pipeline', 'Node.js', 'Python FastAPI', 'SQL Indexing'],
    },
    {
      num: 'Pillar 03',
      icon: 'insights',
      title: 'EDA & Data Visualization',
      badgeBg: 'bg-[#ea580c]/10 text-[#ea580c]',
      titleColor: 'text-[#ea580c]',
      desc: 'Mathematical data exploration examining thermal variations, spatial regressions, and multi-factor urban surface indices.',
      tags: ['Python 3.11', 'Pandas', 'NumPy', 'Scientific Plotting', 'GeoPandas', 'Spatial Aggregation'],
    },
  ];

  return (
    <div className="flex flex-col w-full pb-24 bg-[#fafafc]">
      
      {/* Hero Header */}
      <section className="w-full px-6 pt-12 pb-10 border-b border-black/[0.04]">
        <div className="max-w-[1340px] mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 text-[12px]">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[980px] bg-[#0071e3]/10 text-[#0071e3] font-mono font-medium uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]"></span>
                TF-141 • INTEGRATED SEMESTER PROJECT
              </span>
              <span className="font-mono text-[#86868b]">ACADEMIC YEAR 2024–2025</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[#86868b] text-[11px]">
              <span>17.6599° N, 75.9064° E</span>
              <span>•</span>
              <span>EPSG:4326</span>
            </div>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-[38px] md:text-[50px] font-semibold tracking-[-0.03em] text-[#1d1d1f] leading-[1.1]">
              Meet the Team Behind HeatShield
            </h1>
            <p className="text-[17px] text-[#86868b] leading-relaxed">
              An interdisciplinary academic project combining full-stack development, database management, and data analytics to explore urban heat exposure and support informed cooling strategies for Solapur, Maharashtra.
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="bg-white rounded-[20px] p-4 border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-1">
              <span className="text-[11px] font-medium text-[#86868b] uppercase tracking-wider block">Project Identifier</span>
              <span className="text-[15px] font-semibold text-[#1d1d1f]">HeatShield</span>
              <span className="text-[11px] font-mono text-[#86868b] block">v2.4 Synthetic Model</span>
            </div>
            <div className="bg-white rounded-[20px] p-4 border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-1">
              <span className="text-[11px] font-medium text-[#86868b] uppercase tracking-wider block">Task Force</span>
              <span className="text-[15px] font-semibold text-[#1d1d1f]">TF-141</span>
              <span className="text-[11px] text-[#0071e3] font-medium block">3 Investigators</span>
            </div>
            <div className="bg-white rounded-[20px] p-4 border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-1">
              <span className="text-[11px] font-medium text-[#86868b] uppercase tracking-wider block">Target Domain</span>
              <span className="text-[15px] font-semibold text-[#1d1d1f]">Solapur, MH</span>
              <span className="text-[11px] text-[#86868b] block">Semi-Arid Canopy</span>
            </div>
            <div className="bg-white rounded-[20px] p-4 border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-1">
              <span className="text-[11px] font-medium text-[#86868b] uppercase tracking-wider block">Disciplines Synthesized</span>
              <span className="text-[15px] font-semibold text-[#1d1d1f]">FSD • DBMS • EDA</span>
              <span className="text-[11px] text-[#059669] font-medium block">Integrated Project</span>
            </div>
          </div>
        </div>
      </section>

      {/* Team Cards Section */}
      <section className="w-full px-6 py-16">
        <div className="max-w-[1340px] mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0071e3] block">
                Contributors &amp; Engineering Roles
              </span>
              <h2 className="text-[28px] md:text-[34px] font-semibold text-[#1d1d1f] tracking-[-0.02em]">
                The People Behind the Project
              </h2>
            </div>
            <p className="text-[14px] text-[#86868b] max-w-md leading-relaxed">
              Three contributors. Three complementary responsibilities. One integrated platform for computational thermal resilience.
            </p>
          </div>

          {/* 3 Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.studentId}
                className="bg-white rounded-[28px] p-8 flex flex-col justify-between shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-black/[0.06] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-[980px] ${member.avatarBg} flex items-center justify-center text-[18px] font-semibold shadow-xs`}>
                      {member.initials}
                    </div>
                    <span className="px-3 py-1 rounded-[980px] bg-[#f5f5f7] font-mono text-[11px] text-[#1d1d1f] font-medium">
                      {member.studentId}
                    </span>
                  </div>
                  <div className="mb-3">
                    <span className={`text-[11px] uppercase tracking-wider font-semibold ${member.accentColor} block mb-1`}>
                      {member.roleCategory} • {member.role}
                    </span>
                    <h3 className="text-[22px] font-semibold text-[#1d1d1f] tracking-tight">
                      {member.name}
                    </h3>
                  </div>
                  <p className="text-[14px] text-[#86868b] leading-relaxed mb-6">
                    {member.description}
                  </p>
                </div>
                
                <div className="pt-4 bg-[#f5f5f7] -mx-8 -mb-8 p-6 rounded-b-[28px] flex flex-col gap-1 border-t border-black/[0.04]">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#86868b]">Core Competencies</span>
                  <span className={`font-mono text-[11px] ${member.accentColor} font-medium`}>
                    {member.competencies}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Distribution Section */}
      <section className="w-full px-6 py-16 bg-white border-y border-black/[0.04]">
        <div className="max-w-[1340px] mx-auto space-y-10">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0071e3] block">
              Modular Task Architecture
            </span>
            <h2 className="text-[28px] md:text-[34px] font-semibold text-[#1d1d1f] tracking-[-0.02em]">
              How We Divide the Work
            </h2>
            <p className="text-[14px] text-[#86868b]">
              Each workstream contributes to a single integrated computational platform.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {workstreams.map((ws) => (
              <div
                key={ws.id}
                className="bg-[#fafafc] rounded-[28px] p-8 shadow-xs border border-black/[0.06] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-black/[0.04]">
                    <span className="font-mono text-[11px] font-semibold text-[#1d1d1f]">
                      {ws.id}
                    </span>
                    <span className="text-[11px] text-[#86868b] font-medium">
                      Owner: {ws.owner}
                    </span>
                  </div>
                  <h3 className="text-[18px] text-[#1d1d1f] font-semibold mb-2">
                    {ws.title}
                  </h3>
                  <p className="text-[13px] text-[#86868b] leading-relaxed mb-5">
                    {ws.summary}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] block mb-1">
                      Key Responsibilities
                    </span>
                    <ul className="space-y-2 text-[13px] text-[#1d1d1f]">
                      {ws.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className={`material-symbols-outlined text-[16px] ${ws.checkColor} mt-0.5 shrink-0`}>
                            check_circle
                          </span>
                          <span className="leading-snug">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-[18px] border border-black/[0.04]">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#86868b] block mb-1">
                    Formal Deliverable
                  </span>
                  <p className="text-[12px] text-[#1d1d1f] font-medium leading-relaxed">
                    {ws.deliverable}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Research Inquiries & Pipeline */}
      <section className="w-full px-6 py-16">
        <div className="max-w-[1340px] mx-auto space-y-12">
          
          {/* Research Questions Bento */}
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0071e3] block">
                Research Formulation
              </span>
              <h2 className="text-[28px] md:text-[34px] font-semibold text-[#1d1d1f] tracking-[-0.02em]">
                Core Research Inquiries
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className={`bg-white p-6 rounded-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-black/[0.06] ${inq.span}`}
                >
                  <span className="font-mono text-[11px] text-[#0071e3] font-semibold block mb-1.5">
                    {inq.id}
                  </span>
                  <h4 className="text-[16px] text-[#1d1d1f] font-semibold mb-1.5">
                    {inq.title}
                  </h4>
                  <p className="text-[13px] text-[#86868b] leading-relaxed">
                    {inq.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* End-to-End Pipeline */}
          <div className="bg-white rounded-[28px] p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-black/[0.06] space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">System Workflow</span>
                <h3 className="text-[20px] font-semibold text-[#1d1d1f]">
                  End-to-End Data Processing Pipeline
                </h3>
              </div>
              <span className="font-mono text-[11px] text-[#0071e3] bg-[#0071e3]/10 px-3 py-1 rounded-[980px] font-medium self-start md:self-auto">
                150,000 SENSORY OBSERVATIONS
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {pipelineStages.map((stg) => (
                <div
                  key={stg.num}
                  className="p-5 rounded-[20px] bg-[#f5f5f7] flex flex-col justify-between border border-black/[0.04]"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-semibold text-[#86868b]">
                        {stg.num}
                      </span>
                      <span className={`material-symbols-outlined text-[18px] ${stg.color}`}>
                        {stg.icon}
                      </span>
                    </div>
                    <span className="text-[14px] font-semibold text-[#1d1d1f] block">
                      {stg.title}
                    </span>
                    <p className="text-[12px] text-[#86868b] leading-relaxed">
                      {stg.desc}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-black/[0.04]">
                    <span className="text-[10px] font-mono text-[#86868b] uppercase block">
                      {stg.output}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7 Objectives Ledger */}
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0071e3] block">
                Measurable Milestones
              </span>
              <h2 className="text-[28px] md:text-[34px] font-semibold text-[#1d1d1f] tracking-[-0.02em]">
                Project Objectives
              </h2>
            </div>

            <div className="bg-white rounded-[28px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-black/[0.06]">
              <div className="divide-y divide-black/[0.04]">
                {objectives.map((obj) => (
                  <div
                    key={obj.num}
                    className="p-4 md:px-6 flex items-center justify-between hover:bg-[#fafafc] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[12px] font-semibold text-[#0071e3] w-6 shrink-0">
                        {obj.num}
                      </span>
                      <div>
                        <h4 className="text-[14px] font-semibold text-[#1d1d1f]">
                          {obj.title}
                        </h4>
                        <p className="text-[12px] text-[#86868b]">
                          {obj.desc}
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#059669] text-[18px] shrink-0 ml-4">
                      check_circle
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Technology Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {techPillars.map((p) => (
              <div
                key={p.num}
                className="bg-white rounded-[28px] p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-black/[0.06] flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-[12px] ${p.badgeBg} flex items-center justify-center mb-4 font-bold`}>
                    <span className="material-symbols-outlined text-[20px]">{p.icon}</span>
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] block mb-1">
                    {p.num}
                  </span>
                  <h3 className="text-[18px] font-semibold text-[#1d1d1f] mb-2">
                    {p.title}
                  </h3>
                  <p className="text-[13px] text-[#86868b] mb-6 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-[#f5f5f7] rounded-[980px] font-mono text-[11px] text-[#1d1d1f] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Academic Transparency Callout */}
          <div className="p-8 bg-white rounded-[28px] border border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-3">
            <div className="flex items-center gap-2 text-[#0071e3] font-medium text-[12px]">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span className="font-mono uppercase tracking-wider">PROVENANCE DISCLOSURE • SOLAPUR STUDY</span>
            </div>
            <p className="text-[14px] text-[#1d1d1f] leading-relaxed max-w-3xl">
              HeatShield uses a synthetic academic microclimate simulation dataset for Solapur, Maharashtra. The results are intended for educational analysis and demonstration and must not be interpreted as official meteorological measurements or verified real-world observations.
            </p>
            <p className="text-[13px] text-[#86868b] leading-relaxed max-w-3xl">
              Modeled cooling-priority scores and intervention rankings are analytical outputs of the project's methodology, not official government recommendations.
            </p>
          </div>

          {/* Closing Editorial CTA Card */}
          <div className="bg-[#1d1d1f] text-white rounded-[32px] p-10 md:p-14 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#0071e3] font-semibold block">
                EXPLORE THE PLATFORM
              </span>
              <h2 className="text-[30px] md:text-[38px] font-semibold text-white tracking-[-0.025em] leading-tight">
                One Team. One Platform. A Clearer View of Urban Heat.
              </h2>
              <p className="text-[15px] text-[#86868b] leading-relaxed">
                HeatShield brings together software engineering, data management, and analytical thinking to explore urban heat patterns and communicate possible cooling strategies.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
              <Link
                to="/heat-map"
                className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-[980px] bg-[#0071e3] text-white font-medium text-[14px] hover:bg-[#0077ed] transition-colors shadow-[0_2px_8px_rgba(0,113,227,0.3)]"
              >
                <span className="material-symbols-outlined text-[18px]">map</span>
                <span>Explore Heat Map</span>
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-[980px] bg-white/10 hover:bg-white/15 text-white font-medium text-[14px] transition-colors"
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
