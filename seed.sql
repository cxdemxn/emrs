-- ============================================================
-- EMRS Seed Data — Real-World University Structure
-- University of Port Harcourt (fictional instance)
-- Run against your existing migrated PostgreSQL database.
-- Does NOT include Student or User (Admin) inserts.
-- ============================================================

-- Clear existing data in dependency order
TRUNCATE TABLE "Notification"  CASCADE;
TRUNCATE TABLE "ExamSlot"      CASCADE;
TRUNCATE TABLE "Timetable"     CASCADE;
TRUNCATE TABLE "Course"        CASCADE;
TRUNCATE TABLE "Student"       CASCADE;
TRUNCATE TABLE "Department"    CASCADE;
TRUNCATE TABLE "Faculty"       CASCADE;

-- ============================================================
-- FACULTIES
-- ============================================================
-- 4-year faculties
INSERT INTO "Faculty" (id, name, duration, "createdAt", "updatedAt") VALUES
  ('fac-eng-001', 'Faculty of Engineering',                    4, NOW(), NOW()),
  ('fac-sci-001', 'Faculty of Science',                        4, NOW(), NOW()),
  ('fac-law-001', 'Faculty of Law',                            4, NOW(), NOW()),
  ('fac-med-001', 'Faculty of Medicine and Health Sciences',   4, NOW(), NOW()),
  ('fac-mgt-001', 'Faculty of Management Sciences',            4, NOW(), NOW());

-- 3-year faculties
INSERT INTO "Faculty" (id, name, duration, "createdAt", "updatedAt") VALUES
  ('fac-art-001', 'Faculty of Arts and Humanities',            3, NOW(), NOW()),
  ('fac-soc-001', 'Faculty of Social Sciences',                3, NOW(), NOW()),
  ('fac-edu-001', 'Faculty of Education',                      3, NOW(), NOW());


-- ============================================================
-- DEPARTMENTS
-- ============================================================

-- Faculty of Engineering (4-year)
INSERT INTO "Department" (id, name, "facultyId", "registrationCode", "createdAt", "updatedAt") VALUES
  ('dep-csc-001', 'Computer Science',                    'fac-eng-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-ele-001', 'Electrical and Electronics Engineering','fac-eng-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-mec-001', 'Mechanical Engineering',               'fac-eng-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-civ-001', 'Civil Engineering',                    'fac-eng-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-che-001', 'Chemical Engineering',                 'fac-eng-001', gen_random_uuid(), NOW(), NOW());

-- Faculty of Science (4-year)
INSERT INTO "Department" (id, name, "facultyId", "registrationCode", "createdAt", "updatedAt") VALUES
  ('dep-phy-001', 'Physics',                              'fac-sci-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-chm-001', 'Chemistry',                            'fac-sci-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-mth-001', 'Mathematics',                          'fac-sci-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-bio-001', 'Biology',                              'fac-sci-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-geo-001', 'Geology',                              'fac-sci-001', gen_random_uuid(), NOW(), NOW());

-- Faculty of Law (4-year)
INSERT INTO "Department" (id, name, "facultyId", "registrationCode", "createdAt", "updatedAt") VALUES
  ('dep-law-001', 'Law',                                  'fac-law-001', gen_random_uuid(), NOW(), NOW());

-- Faculty of Medicine and Health Sciences (4-year)
INSERT INTO "Department" (id, name, "facultyId", "registrationCode", "createdAt", "updatedAt") VALUES
  ('dep-mbbs-001', 'Medicine and Surgery',                'fac-med-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-nur-001',  'Nursing Science',                     'fac-med-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-phr-001',  'Pharmacy',                            'fac-med-001', gen_random_uuid(), NOW(), NOW());

-- Faculty of Management Sciences (4-year)
INSERT INTO "Department" (id, name, "facultyId", "registrationCode", "createdAt", "updatedAt") VALUES
  ('dep-acc-001', 'Accounting',                           'fac-mgt-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-bus-001', 'Business Administration',              'fac-mgt-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-eco-001', 'Economics',                            'fac-mgt-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-fin-001', 'Finance',                              'fac-mgt-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-mkt-001', 'Marketing',                            'fac-mgt-001', gen_random_uuid(), NOW(), NOW());

-- Faculty of Arts and Humanities (3-year)
INSERT INTO "Department" (id, name, "facultyId", "registrationCode", "createdAt", "updatedAt") VALUES
  ('dep-eng-001', 'English and Literary Studies',         'fac-art-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-his-001', 'History and Diplomatic Studies',       'fac-art-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-phi-001', 'Philosophy',                           'fac-art-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-fla-001', 'Foreign Languages',                    'fac-art-001', gen_random_uuid(), NOW(), NOW());

-- Faculty of Social Sciences (3-year)
INSERT INTO "Department" (id, name, "facultyId", "registrationCode", "createdAt", "updatedAt") VALUES
  ('dep-psc-001', 'Political Science',                    'fac-soc-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-soc-001', 'Sociology',                            'fac-soc-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-mas-001', 'Mass Communication',                   'fac-soc-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-psy-001', 'Psychology',                           'fac-soc-001', gen_random_uuid(), NOW(), NOW());

-- Faculty of Education (3-year)
INSERT INTO "Department" (id, name, "facultyId", "registrationCode", "createdAt", "updatedAt") VALUES
  ('dep-edu-001', 'Education Administration and Planning', 'fac-edu-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-ged-001', 'Guidance and Counselling',              'fac-edu-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-spe-001', 'Special Education',                     'fac-edu-001', gen_random_uuid(), NOW(), NOW());


-- ============================================================
-- COURSES — Computer Science (4-year)
-- ============================================================
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  -- 100 Level
  (gen_random_uuid(), 'CSC101', 'Introduction to Computer Science',         100, 'dep-csc-001', NOW(), NOW()),
  (gen_random_uuid(), 'CSC102', 'Computer Programming I',                   100, 'dep-csc-001', NOW(), NOW()),
  (gen_random_uuid(), 'CSC103', 'Introduction to Information Technology',   100, 'dep-csc-001', NOW(), NOW()),
  (gen_random_uuid(), 'CSC104', 'Logic and Critical Thinking',              100, 'dep-csc-001', NOW(), NOW()),
  (gen_random_uuid(), 'CSC105', 'Digital Electronics',                      100, 'dep-csc-001', NOW(), NOW()),
  (gen_random_uuid(), 'CSC106', 'Discrete Mathematics',                     100, 'dep-csc-001', NOW(), NOW()),
  -- 200 Level
  (gen_random_uuid(), 'CSC201', 'Computer Programming II',                  200, 'dep-csc-001', NOW(), NOW()),
  (gen_random_uuid(), 'CSC202', 'Data Structures and Algorithms',           200, 'dep-csc-001', NOW(), NOW()),
  (gen_random_uuid(), 'CSC203', 'Computer Architecture',                    200, 'dep-csc-001', NOW(), NOW()),
  (gen_random_uuid(), 'CSC204', 'Operating Systems I',                      200, 'dep-csc-001', NOW(), NOW()),
  (gen_random_uuid(), 'CSC205', 'Database Management Systems',              200, 'dep-csc-001', NOW(), NOW()),
  (gen_random_uuid(), 'CSC206', 'Numerical Methods',                        200, 'dep-csc-001', NOW(), NOW()),
  (gen_random_uuid(), 'CSC207', 'Web Technologies I',                       200, 'dep-csc-001', NOW(), NOW()),
  -- 300 Level
  (gen_random_uuid(), 'CSC301', 'Software Engineering I',                   300, 'dep-csc-001', NOW(), NOW()),
  (gen_random_uuid(), 'CSC302', 'Computer Networks',                        300, 'dep-csc-001', NOW(), NOW()),
  (gen_random_uuid(), 'CSC303', 'Theory of Computation',                    300, 'dep-csc-001', NOW(), NOW()),
  (gen_random_uuid(), 'CSC304', 'Compiler Construction',                    300, 'dep-csc-001', NOW(), NOW()),
  (gen_random_uuid(), 'CSC305', 'Artificial Intelligence',                  300, 'dep-csc-001', NOW(), NOW()),
  (gen_random_uuid(), 'CSC306', 'Human-Computer Interaction',               300, 'dep-csc-001', NOW(), NOW()),
  (gen_random_uuid(), 'CSC307', 'Information Security',                     300, 'dep-csc-001', NOW(), NOW()),
  -- 400 Level
  (gen_random_uuid(), 'CSC401', 'Software Engineering II',                  400, 'dep-csc-001', NOW(), NOW()),
  (gen_random_uuid(), 'CSC402', 'Machine Learning',                         400, 'dep-csc-001', NOW(), NOW()),
  (gen_random_uuid(), 'CSC403', 'Cloud Computing',                          400, 'dep-csc-001', NOW(), NOW()),
  (gen_random_uuid(), 'CSC404', 'Distributed Systems',                      400, 'dep-csc-001', NOW(), NOW()),
  (gen_random_uuid(), 'CSC405', 'Capstone Project I',                       400, 'dep-csc-001', NOW(), NOW()),
  (gen_random_uuid(), 'CSC406', 'Capstone Project II',                      400, 'dep-csc-001', NOW(), NOW());

-- ============================================================
-- COURSES — Electrical and Electronics Engineering (4-year)
-- ============================================================
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'EEE101', 'Introduction to Electrical Engineering',   100, 'dep-ele-001', NOW(), NOW()),
  (gen_random_uuid(), 'EEE102', 'Circuit Theory I',                         100, 'dep-ele-001', NOW(), NOW()),
  (gen_random_uuid(), 'EEE103', 'Engineering Mathematics I',                100, 'dep-ele-001', NOW(), NOW()),
  (gen_random_uuid(), 'EEE104', 'Workshop Practice',                        100, 'dep-ele-001', NOW(), NOW()),
  (gen_random_uuid(), 'EEE105', 'Technical Drawing',                        100, 'dep-ele-001', NOW(), NOW()),
  (gen_random_uuid(), 'EEE201', 'Circuit Theory II',                        200, 'dep-ele-001', NOW(), NOW()),
  (gen_random_uuid(), 'EEE202', 'Electronics I',                            200, 'dep-ele-001', NOW(), NOW()),
  (gen_random_uuid(), 'EEE203', 'Electromagnetics',                         200, 'dep-ele-001', NOW(), NOW()),
  (gen_random_uuid(), 'EEE204', 'Engineering Mathematics II',               200, 'dep-ele-001', NOW(), NOW()),
  (gen_random_uuid(), 'EEE205', 'Digital Logic Design',                     200, 'dep-ele-001', NOW(), NOW()),
  (gen_random_uuid(), 'EEE206', 'Signals and Systems',                      200, 'dep-ele-001', NOW(), NOW()),
  (gen_random_uuid(), 'EEE301', 'Microprocessors and Microcontrollers',     300, 'dep-ele-001', NOW(), NOW()),
  (gen_random_uuid(), 'EEE302', 'Control Systems I',                        300, 'dep-ele-001', NOW(), NOW()),
  (gen_random_uuid(), 'EEE303', 'Power Systems I',                          300, 'dep-ele-001', NOW(), NOW()),
  (gen_random_uuid(), 'EEE304', 'Electronics II',                           300, 'dep-ele-001', NOW(), NOW()),
  (gen_random_uuid(), 'EEE305', 'Communication Systems',                    300, 'dep-ele-001', NOW(), NOW()),
  (gen_random_uuid(), 'EEE306', 'Instrumentation and Measurement',         300, 'dep-ele-001', NOW(), NOW()),
  (gen_random_uuid(), 'EEE401', 'Power Electronics',                        400, 'dep-ele-001', NOW(), NOW()),
  (gen_random_uuid(), 'EEE402', 'Embedded Systems',                         400, 'dep-ele-001', NOW(), NOW()),
  (gen_random_uuid(), 'EEE403', 'Advanced Signal Processing',               400, 'dep-ele-001', NOW(), NOW()),
  (gen_random_uuid(), 'EEE404', 'Renewable Energy Systems',                 400, 'dep-ele-001', NOW(), NOW()),
  (gen_random_uuid(), 'EEE405', 'Engineering Project I',                    400, 'dep-ele-001', NOW(), NOW()),
  (gen_random_uuid(), 'EEE406', 'Engineering Project II',                   400, 'dep-ele-001', NOW(), NOW());

-- ============================================================
-- COURSES — Mechanical Engineering (4-year)
-- ============================================================
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'MEE101', 'Introduction to Mechanical Engineering',   100, 'dep-mec-001', NOW(), NOW()),
  (gen_random_uuid(), 'MEE102', 'Engineering Drawing',                      100, 'dep-mec-001', NOW(), NOW()),
  (gen_random_uuid(), 'MEE103', 'Statics',                                  100, 'dep-mec-001', NOW(), NOW()),
  (gen_random_uuid(), 'MEE104', 'Workshop Technology I',                    100, 'dep-mec-001', NOW(), NOW()),
  (gen_random_uuid(), 'MEE201', 'Dynamics',                                 200, 'dep-mec-001', NOW(), NOW()),
  (gen_random_uuid(), 'MEE202', 'Thermodynamics I',                         200, 'dep-mec-001', NOW(), NOW()),
  (gen_random_uuid(), 'MEE203', 'Strength of Materials',                    200, 'dep-mec-001', NOW(), NOW()),
  (gen_random_uuid(), 'MEE204', 'Fluid Mechanics I',                        200, 'dep-mec-001', NOW(), NOW()),
  (gen_random_uuid(), 'MEE205', 'Engineering Materials',                    200, 'dep-mec-001', NOW(), NOW()),
  (gen_random_uuid(), 'MEE301', 'Heat Transfer',                            300, 'dep-mec-001', NOW(), NOW()),
  (gen_random_uuid(), 'MEE302', 'Machine Design',                           300, 'dep-mec-001', NOW(), NOW()),
  (gen_random_uuid(), 'MEE303', 'Manufacturing Processes',                  300, 'dep-mec-001', NOW(), NOW()),
  (gen_random_uuid(), 'MEE304', 'Control Engineering',                      300, 'dep-mec-001', NOW(), NOW()),
  (gen_random_uuid(), 'MEE305', 'Fluid Mechanics II',                       300, 'dep-mec-001', NOW(), NOW()),
  (gen_random_uuid(), 'MEE401', 'Finite Element Analysis',                  400, 'dep-mec-001', NOW(), NOW()),
  (gen_random_uuid(), 'MEE402', 'Turbomachinery',                           400, 'dep-mec-001', NOW(), NOW()),
  (gen_random_uuid(), 'MEE403', 'Robotics and Automation',                  400, 'dep-mec-001', NOW(), NOW()),
  (gen_random_uuid(), 'MEE404', 'Engineering Project',                      400, 'dep-mec-001', NOW(), NOW());

-- ============================================================
-- COURSES — Civil Engineering (4-year)
-- ============================================================
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'CVE101', 'Introduction to Civil Engineering',        100, 'dep-civ-001', NOW(), NOW()),
  (gen_random_uuid(), 'CVE102', 'Engineering Drawing and CAD',              100, 'dep-civ-001', NOW(), NOW()),
  (gen_random_uuid(), 'CVE103', 'Surveying I',                              100, 'dep-civ-001', NOW(), NOW()),
  (gen_random_uuid(), 'CVE104', 'Engineering Mathematics',                  100, 'dep-civ-001', NOW(), NOW()),
  (gen_random_uuid(), 'CVE201', 'Structural Analysis I',                    200, 'dep-civ-001', NOW(), NOW()),
  (gen_random_uuid(), 'CVE202', 'Geotechnical Engineering I',               200, 'dep-civ-001', NOW(), NOW()),
  (gen_random_uuid(), 'CVE203', 'Hydraulics',                               200, 'dep-civ-001', NOW(), NOW()),
  (gen_random_uuid(), 'CVE204', 'Construction Materials',                   200, 'dep-civ-001', NOW(), NOW()),
  (gen_random_uuid(), 'CVE205', 'Surveying II',                             200, 'dep-civ-001', NOW(), NOW()),
  (gen_random_uuid(), 'CVE301', 'Structural Design I',                      300, 'dep-civ-001', NOW(), NOW()),
  (gen_random_uuid(), 'CVE302', 'Transportation Engineering',               300, 'dep-civ-001', NOW(), NOW()),
  (gen_random_uuid(), 'CVE303', 'Environmental Engineering',                300, 'dep-civ-001', NOW(), NOW()),
  (gen_random_uuid(), 'CVE304', 'Geotechnical Engineering II',              300, 'dep-civ-001', NOW(), NOW()),
  (gen_random_uuid(), 'CVE401', 'Structural Design II',                     400, 'dep-civ-001', NOW(), NOW()),
  (gen_random_uuid(), 'CVE402', 'Project Management and Estimation',        400, 'dep-civ-001', NOW(), NOW()),
  (gen_random_uuid(), 'CVE403', 'Engineering Project',                      400, 'dep-civ-001', NOW(), NOW());

-- ============================================================
-- COURSES — Chemical Engineering (4-year)
-- ============================================================
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'CHE101', 'Introduction to Chemical Engineering',     100, 'dep-che-001', NOW(), NOW()),
  (gen_random_uuid(), 'CHE102', 'General Chemistry I',                      100, 'dep-che-001', NOW(), NOW()),
  (gen_random_uuid(), 'CHE103', 'Engineering Mathematics',                  100, 'dep-che-001', NOW(), NOW()),
  (gen_random_uuid(), 'CHE201', 'Chemical Engineering Thermodynamics',      200, 'dep-che-001', NOW(), NOW()),
  (gen_random_uuid(), 'CHE202', 'Fluid Flow and Heat Transfer',             200, 'dep-che-001', NOW(), NOW()),
  (gen_random_uuid(), 'CHE203', 'Material and Energy Balances',             200, 'dep-che-001', NOW(), NOW()),
  (gen_random_uuid(), 'CHE204', 'Process Instrumentation',                  200, 'dep-che-001', NOW(), NOW()),
  (gen_random_uuid(), 'CHE301', 'Mass Transfer Operations',                 300, 'dep-che-001', NOW(), NOW()),
  (gen_random_uuid(), 'CHE302', 'Chemical Reaction Engineering',            300, 'dep-che-001', NOW(), NOW()),
  (gen_random_uuid(), 'CHE303', 'Process Control',                          300, 'dep-che-001', NOW(), NOW()),
  (gen_random_uuid(), 'CHE304', 'Petroleum Refining',                       300, 'dep-che-001', NOW(), NOW()),
  (gen_random_uuid(), 'CHE401', 'Plant Design and Economics',               400, 'dep-che-001', NOW(), NOW()),
  (gen_random_uuid(), 'CHE402', 'Environmental Chemical Engineering',       400, 'dep-che-001', NOW(), NOW()),
  (gen_random_uuid(), 'CHE403', 'Engineering Project',                      400, 'dep-che-001', NOW(), NOW());

-- ============================================================
-- COURSES — Physics (4-year)
-- ============================================================
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'PHY101', 'General Physics I (Mechanics)',            100, 'dep-phy-001', NOW(), NOW()),
  (gen_random_uuid(), 'PHY102', 'General Physics II (Electromagnetism)',    100, 'dep-phy-001', NOW(), NOW()),
  (gen_random_uuid(), 'PHY103', 'Mathematical Methods for Physics I',       100, 'dep-phy-001', NOW(), NOW()),
  (gen_random_uuid(), 'PHY201', 'Classical Mechanics',                      200, 'dep-phy-001', NOW(), NOW()),
  (gen_random_uuid(), 'PHY202', 'Thermodynamics and Statistical Mechanics', 200, 'dep-phy-001', NOW(), NOW()),
  (gen_random_uuid(), 'PHY203', 'Optics',                                   200, 'dep-phy-001', NOW(), NOW()),
  (gen_random_uuid(), 'PHY204', 'Mathematical Methods for Physics II',      200, 'dep-phy-001', NOW(), NOW()),
  (gen_random_uuid(), 'PHY301', 'Quantum Mechanics I',                      300, 'dep-phy-001', NOW(), NOW()),
  (gen_random_uuid(), 'PHY302', 'Electrodynamics',                          300, 'dep-phy-001', NOW(), NOW()),
  (gen_random_uuid(), 'PHY303', 'Nuclear Physics',                          300, 'dep-phy-001', NOW(), NOW()),
  (gen_random_uuid(), 'PHY304', 'Solid State Physics',                      300, 'dep-phy-001', NOW(), NOW()),
  (gen_random_uuid(), 'PHY401', 'Quantum Mechanics II',                     400, 'dep-phy-001', NOW(), NOW()),
  (gen_random_uuid(), 'PHY402', 'Astrophysics',                             400, 'dep-phy-001', NOW(), NOW()),
  (gen_random_uuid(), 'PHY403', 'Research Methods in Physics',              400, 'dep-phy-001', NOW(), NOW()),
  (gen_random_uuid(), 'PHY404', 'Physics Project',                          400, 'dep-phy-001', NOW(), NOW());

-- ============================================================
-- COURSES — Mathematics (4-year)
-- ============================================================
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'MTH101', 'Calculus I',                               100, 'dep-mth-001', NOW(), NOW()),
  (gen_random_uuid(), 'MTH102', 'Algebra and Number Theory',                100, 'dep-mth-001', NOW(), NOW()),
  (gen_random_uuid(), 'MTH103', 'Introduction to Statistics',               100, 'dep-mth-001', NOW(), NOW()),
  (gen_random_uuid(), 'MTH201', 'Calculus II',                              200, 'dep-mth-001', NOW(), NOW()),
  (gen_random_uuid(), 'MTH202', 'Linear Algebra',                           200, 'dep-mth-001', NOW(), NOW()),
  (gen_random_uuid(), 'MTH203', 'Differential Equations',                   200, 'dep-mth-001', NOW(), NOW()),
  (gen_random_uuid(), 'MTH204', 'Probability Theory',                       200, 'dep-mth-001', NOW(), NOW()),
  (gen_random_uuid(), 'MTH301', 'Real Analysis',                            300, 'dep-mth-001', NOW(), NOW()),
  (gen_random_uuid(), 'MTH302', 'Abstract Algebra',                         300, 'dep-mth-001', NOW(), NOW()),
  (gen_random_uuid(), 'MTH303', 'Complex Analysis',                         300, 'dep-mth-001', NOW(), NOW()),
  (gen_random_uuid(), 'MTH304', 'Numerical Analysis',                       300, 'dep-mth-001', NOW(), NOW()),
  (gen_random_uuid(), 'MTH401', 'Functional Analysis',                      400, 'dep-mth-001', NOW(), NOW()),
  (gen_random_uuid(), 'MTH402', 'Topology',                                 400, 'dep-mth-001', NOW(), NOW()),
  (gen_random_uuid(), 'MTH403', 'Operations Research',                      400, 'dep-mth-001', NOW(), NOW()),
  (gen_random_uuid(), 'MTH404', 'Mathematics Project',                      400, 'dep-mth-001', NOW(), NOW());

-- ============================================================
-- COURSES — Accounting (4-year)
-- ============================================================
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'ACC101', 'Introduction to Accounting',               100, 'dep-acc-001', NOW(), NOW()),
  (gen_random_uuid(), 'ACC102', 'Business Mathematics',                     100, 'dep-acc-001', NOW(), NOW()),
  (gen_random_uuid(), 'ACC103', 'Principles of Economics',                  100, 'dep-acc-001', NOW(), NOW()),
  (gen_random_uuid(), 'ACC201', 'Financial Accounting I',                   200, 'dep-acc-001', NOW(), NOW()),
  (gen_random_uuid(), 'ACC202', 'Cost Accounting',                          200, 'dep-acc-001', NOW(), NOW()),
  (gen_random_uuid(), 'ACC203', 'Business Law',                             200, 'dep-acc-001', NOW(), NOW()),
  (gen_random_uuid(), 'ACC204', 'Introduction to Taxation',                 200, 'dep-acc-001', NOW(), NOW()),
  (gen_random_uuid(), 'ACC205', 'Quantitative Methods',                     200, 'dep-acc-001', NOW(), NOW()),
  (gen_random_uuid(), 'ACC301', 'Financial Accounting II',                  300, 'dep-acc-001', NOW(), NOW()),
  (gen_random_uuid(), 'ACC302', 'Management Accounting',                    300, 'dep-acc-001', NOW(), NOW()),
  (gen_random_uuid(), 'ACC303', 'Auditing and Assurance',                   300, 'dep-acc-001', NOW(), NOW()),
  (gen_random_uuid(), 'ACC304', 'Advanced Taxation',                        300, 'dep-acc-001', NOW(), NOW()),
  (gen_random_uuid(), 'ACC305', 'Financial Management',                     300, 'dep-acc-001', NOW(), NOW()),
  (gen_random_uuid(), 'ACC401', 'Advanced Financial Reporting',             400, 'dep-acc-001', NOW(), NOW()),
  (gen_random_uuid(), 'ACC402', 'Public Sector Accounting',                 400, 'dep-acc-001', NOW(), NOW()),
  (gen_random_uuid(), 'ACC403', 'Forensic Accounting',                      400, 'dep-acc-001', NOW(), NOW()),
  (gen_random_uuid(), 'ACC404', 'Research Project in Accounting',           400, 'dep-acc-001', NOW(), NOW());

-- ============================================================
-- COURSES — Business Administration (4-year)
-- ============================================================
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'BUS101', 'Introduction to Business',                 100, 'dep-bus-001', NOW(), NOW()),
  (gen_random_uuid(), 'BUS102', 'Business Communication',                   100, 'dep-bus-001', NOW(), NOW()),
  (gen_random_uuid(), 'BUS103', 'Principles of Management',                 100, 'dep-bus-001', NOW(), NOW()),
  (gen_random_uuid(), 'BUS201', 'Organisational Behaviour',                 200, 'dep-bus-001', NOW(), NOW()),
  (gen_random_uuid(), 'BUS202', 'Marketing Management',                     200, 'dep-bus-001', NOW(), NOW()),
  (gen_random_uuid(), 'BUS203', 'Human Resource Management',                200, 'dep-bus-001', NOW(), NOW()),
  (gen_random_uuid(), 'BUS204', 'Business Statistics',                      200, 'dep-bus-001', NOW(), NOW()),
  (gen_random_uuid(), 'BUS301', 'Strategic Management',                     300, 'dep-bus-001', NOW(), NOW()),
  (gen_random_uuid(), 'BUS302', 'Entrepreneurship and Innovation',          300, 'dep-bus-001', NOW(), NOW()),
  (gen_random_uuid(), 'BUS303', 'Operations Management',                    300, 'dep-bus-001', NOW(), NOW()),
  (gen_random_uuid(), 'BUS304', 'Corporate Governance',                     300, 'dep-bus-001', NOW(), NOW()),
  (gen_random_uuid(), 'BUS401', 'International Business',                   400, 'dep-bus-001', NOW(), NOW()),
  (gen_random_uuid(), 'BUS402', 'Business Research Methods',                400, 'dep-bus-001', NOW(), NOW()),
  (gen_random_uuid(), 'BUS403', 'Business Project',                         400, 'dep-bus-001', NOW(), NOW());

-- ============================================================
-- COURSES — Economics (4-year)
-- ============================================================
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'ECO101', 'Principles of Microeconomics',             100, 'dep-eco-001', NOW(), NOW()),
  (gen_random_uuid(), 'ECO102', 'Principles of Macroeconomics',             100, 'dep-eco-001', NOW(), NOW()),
  (gen_random_uuid(), 'ECO103', 'Mathematics for Economists I',             100, 'dep-eco-001', NOW(), NOW()),
  (gen_random_uuid(), 'ECO201', 'Intermediate Microeconomics',              200, 'dep-eco-001', NOW(), NOW()),
  (gen_random_uuid(), 'ECO202', 'Intermediate Macroeconomics',              200, 'dep-eco-001', NOW(), NOW()),
  (gen_random_uuid(), 'ECO203', 'Statistics for Economists',                200, 'dep-eco-001', NOW(), NOW()),
  (gen_random_uuid(), 'ECO204', 'Development Economics',                    200, 'dep-eco-001', NOW(), NOW()),
  (gen_random_uuid(), 'ECO301', 'Econometrics I',                           300, 'dep-eco-001', NOW(), NOW()),
  (gen_random_uuid(), 'ECO302', 'Public Finance',                           300, 'dep-eco-001', NOW(), NOW()),
  (gen_random_uuid(), 'ECO303', 'International Economics',                  300, 'dep-eco-001', NOW(), NOW()),
  (gen_random_uuid(), 'ECO304', 'Labour Economics',                         300, 'dep-eco-001', NOW(), NOW()),
  (gen_random_uuid(), 'ECO401', 'Econometrics II',                          400, 'dep-eco-001', NOW(), NOW()),
  (gen_random_uuid(), 'ECO402', 'Monetary Economics',                       400, 'dep-eco-001', NOW(), NOW()),
  (gen_random_uuid(), 'ECO403', 'Research Project in Economics',            400, 'dep-eco-001', NOW(), NOW());

-- ============================================================
-- COURSES — Mass Communication (3-year)
-- ============================================================
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'MAS101', 'Introduction to Mass Communication',       100, 'dep-mas-001', NOW(), NOW()),
  (gen_random_uuid(), 'MAS102', 'Communication Theory',                     100, 'dep-mas-001', NOW(), NOW()),
  (gen_random_uuid(), 'MAS103', 'Writing for the Media',                    100, 'dep-mas-001', NOW(), NOW()),
  (gen_random_uuid(), 'MAS104', 'Introduction to Broadcasting',             100, 'dep-mas-001', NOW(), NOW()),
  (gen_random_uuid(), 'MAS201', 'Broadcast Journalism',                     200, 'dep-mas-001', NOW(), NOW()),
  (gen_random_uuid(), 'MAS202', 'Print Journalism',                         200, 'dep-mas-001', NOW(), NOW()),
  (gen_random_uuid(), 'MAS203', 'Public Relations',                         200, 'dep-mas-001', NOW(), NOW()),
  (gen_random_uuid(), 'MAS204', 'Media Law and Ethics',                     200, 'dep-mas-001', NOW(), NOW()),
  (gen_random_uuid(), 'MAS205', 'Photography and Photojournalism',          200, 'dep-mas-001', NOW(), NOW()),
  (gen_random_uuid(), 'MAS301', 'Digital Media and Online Journalism',      300, 'dep-mas-001', NOW(), NOW()),
  (gen_random_uuid(), 'MAS302', 'Advertising and Campaign Management',      300, 'dep-mas-001', NOW(), NOW()),
  (gen_random_uuid(), 'MAS303', 'Media Management',                         300, 'dep-mas-001', NOW(), NOW()),
  (gen_random_uuid(), 'MAS304', 'Research Methods in Communication',        300, 'dep-mas-001', NOW(), NOW()),
  (gen_random_uuid(), 'MAS305', 'Final Year Project',                       300, 'dep-mas-001', NOW(), NOW());

-- ============================================================
-- COURSES — Political Science (3-year)
-- ============================================================
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'PSC101', 'Introduction to Political Science',        100, 'dep-psc-001', NOW(), NOW()),
  (gen_random_uuid(), 'PSC102', 'Nigerian Government and Politics',         100, 'dep-psc-001', NOW(), NOW()),
  (gen_random_uuid(), 'PSC103', 'Introduction to International Relations',  100, 'dep-psc-001', NOW(), NOW()),
  (gen_random_uuid(), 'PSC201', 'Comparative Politics',                     200, 'dep-psc-001', NOW(), NOW()),
  (gen_random_uuid(), 'PSC202', 'Political Theory',                         200, 'dep-psc-001', NOW(), NOW()),
  (gen_random_uuid(), 'PSC203', 'African Politics',                         200, 'dep-psc-001', NOW(), NOW()),
  (gen_random_uuid(), 'PSC204', 'Public Administration',                    200, 'dep-psc-001', NOW(), NOW()),
  (gen_random_uuid(), 'PSC301', 'International Law and Organisation',       300, 'dep-psc-001', NOW(), NOW()),
  (gen_random_uuid(), 'PSC302', 'Foreign Policy Analysis',                  300, 'dep-psc-001', NOW(), NOW()),
  (gen_random_uuid(), 'PSC303', 'Conflict Resolution and Peace Studies',    300, 'dep-psc-001', NOW(), NOW()),
  (gen_random_uuid(), 'PSC304', 'Research Methods in Political Science',    300, 'dep-psc-001', NOW(), NOW()),
  (gen_random_uuid(), 'PSC305', 'Long Essay/Project',                       300, 'dep-psc-001', NOW(), NOW());

-- ============================================================
-- COURSES — English and Literary Studies (3-year)
-- ============================================================
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'ENG101', 'Use of English I',                         100, 'dep-eng-001', NOW(), NOW()),
  (gen_random_uuid(), 'ENG102', 'Introduction to Literature',               100, 'dep-eng-001', NOW(), NOW()),
  (gen_random_uuid(), 'ENG103', 'Introduction to Linguistics',              100, 'dep-eng-001', NOW(), NOW()),
  (gen_random_uuid(), 'ENG104', 'Oral Communication Skills',                100, 'dep-eng-001', NOW(), NOW()),
  (gen_random_uuid(), 'ENG201', 'The Novel',                                200, 'dep-eng-001', NOW(), NOW()),
  (gen_random_uuid(), 'ENG202', 'Phonetics and Phonology',                  200, 'dep-eng-001', NOW(), NOW()),
  (gen_random_uuid(), 'ENG203', 'African Literature',                       200, 'dep-eng-001', NOW(), NOW()),
  (gen_random_uuid(), 'ENG204', 'Old and Middle English',                   200, 'dep-eng-001', NOW(), NOW()),
  (gen_random_uuid(), 'ENG205', 'Stylistics',                               200, 'dep-eng-001', NOW(), NOW()),
  (gen_random_uuid(), 'ENG301', 'Modern English Grammar',                   300, 'dep-eng-001', NOW(), NOW()),
  (gen_random_uuid(), 'ENG302', 'Shakespeare',                              300, 'dep-eng-001', NOW(), NOW()),
  (gen_random_uuid(), 'ENG303', 'Creative Writing',                         300, 'dep-eng-001', NOW(), NOW()),
  (gen_random_uuid(), 'ENG304', 'Research Methods in Literature',           300, 'dep-eng-001', NOW(), NOW()),
  (gen_random_uuid(), 'ENG305', 'Long Essay',                               300, 'dep-eng-001', NOW(), NOW());

-- ============================================================
-- COURSES — Sociology (3-year)
-- ============================================================
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'SOC101', 'Introduction to Sociology',                100, 'dep-soc-001', NOW(), NOW()),
  (gen_random_uuid(), 'SOC102', 'Social Anthropology',                      100, 'dep-soc-001', NOW(), NOW()),
  (gen_random_uuid(), 'SOC103', 'Social Psychology',                        100, 'dep-soc-001', NOW(), NOW()),
  (gen_random_uuid(), 'SOC201', 'Sociological Theory',                      200, 'dep-soc-001', NOW(), NOW()),
  (gen_random_uuid(), 'SOC202', 'Research Methods in Sociology',            200, 'dep-soc-001', NOW(), NOW()),
  (gen_random_uuid(), 'SOC203', 'Gender and Society',                       200, 'dep-soc-001', NOW(), NOW()),
  (gen_random_uuid(), 'SOC204', 'Sociology of Development',                 200, 'dep-soc-001', NOW(), NOW()),
  (gen_random_uuid(), 'SOC301', 'Criminology and Deviance',                 300, 'dep-soc-001', NOW(), NOW()),
  (gen_random_uuid(), 'SOC302', 'Urban Sociology',                          300, 'dep-soc-001', NOW(), NOW()),
  (gen_random_uuid(), 'SOC303', 'Sociology of Education',                   300, 'dep-soc-001', NOW(), NOW()),
  (gen_random_uuid(), 'SOC304', 'Long Essay',                               300, 'dep-soc-001', NOW(), NOW());

-- ============================================================
-- COURSES — Law (4-year)
-- ============================================================
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'LAW101', 'Nigerian Legal System',                    100, 'dep-law-001', NOW(), NOW()),
  (gen_random_uuid(), 'LAW102', 'Introduction to Law of Contract',          100, 'dep-law-001', NOW(), NOW()),
  (gen_random_uuid(), 'LAW103', 'Constitutional Law I',                     100, 'dep-law-001', NOW(), NOW()),
  (gen_random_uuid(), 'LAW104', 'Legal Methods',                            100, 'dep-law-001', NOW(), NOW()),
  (gen_random_uuid(), 'LAW201', 'Law of Contract II',                       200, 'dep-law-001', NOW(), NOW()),
  (gen_random_uuid(), 'LAW202', 'Criminal Law',                             200, 'dep-law-001', NOW(), NOW()),
  (gen_random_uuid(), 'LAW203', 'Constitutional Law II',                    200, 'dep-law-001', NOW(), NOW()),
  (gen_random_uuid(), 'LAW204', 'Law of Torts',                             200, 'dep-law-001', NOW(), NOW()),
  (gen_random_uuid(), 'LAW205', 'Law of Property',                          200, 'dep-law-001', NOW(), NOW()),
  (gen_random_uuid(), 'LAW301', 'Commercial Law',                           300, 'dep-law-001', NOW(), NOW()),
  (gen_random_uuid(), 'LAW302', 'Administrative Law',                       300, 'dep-law-001', NOW(), NOW()),
  (gen_random_uuid(), 'LAW303', 'Evidence',                                 300, 'dep-law-001', NOW(), NOW()),
  (gen_random_uuid(), 'LAW304', 'Family Law',                               300, 'dep-law-001', NOW(), NOW()),
  (gen_random_uuid(), 'LAW305', 'Equity and Trusts',                        300, 'dep-law-001', NOW(), NOW()),
  (gen_random_uuid(), 'LAW401', 'International Law',                        400, 'dep-law-001', NOW(), NOW()),
  (gen_random_uuid(), 'LAW402', 'Jurisprudence',                            400, 'dep-law-001', NOW(), NOW()),
  (gen_random_uuid(), 'LAW403', 'Civil Procedure',                          400, 'dep-law-001', NOW(), NOW()),
  (gen_random_uuid(), 'LAW404', 'Research Project',                         400, 'dep-law-001', NOW(), NOW());

-- ============================================================
-- COURSES — Education Administration and Planning (3-year)
-- ============================================================
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'EDU101', 'Foundations of Education',                 100, 'dep-edu-001', NOW(), NOW()),
  (gen_random_uuid(), 'EDU102', 'Educational Psychology',                   100, 'dep-edu-001', NOW(), NOW()),
  (gen_random_uuid(), 'EDU103', 'Introduction to Curriculum Studies',       100, 'dep-edu-001', NOW(), NOW()),
  (gen_random_uuid(), 'EDU201', 'Educational Administration',               200, 'dep-edu-001', NOW(), NOW()),
  (gen_random_uuid(), 'EDU202', 'Educational Planning and Policy',          200, 'dep-edu-001', NOW(), NOW()),
  (gen_random_uuid(), 'EDU203', 'Measurement and Evaluation',               200, 'dep-edu-001', NOW(), NOW()),
  (gen_random_uuid(), 'EDU204', 'Philosophy of Education',                  200, 'dep-edu-001', NOW(), NOW()),
  (gen_random_uuid(), 'EDU301', 'School Management and Supervision',        300, 'dep-edu-001', NOW(), NOW()),
  (gen_random_uuid(), 'EDU302', 'Comparative Education',                    300, 'dep-edu-001', NOW(), NOW()),
  (gen_random_uuid(), 'EDU303', 'Research Methods in Education',            300, 'dep-edu-001', NOW(), NOW()),
  (gen_random_uuid(), 'EDU304', 'Long Essay',                               300, 'dep-edu-001', NOW(), NOW());


-- ============================================================
-- TIMETABLE — 2024/2025 First Semester (published)
-- ============================================================
INSERT INTO "Timetable" (id, title, "startDate", "endDate", "isPublished", "createdAt", "updatedAt") VALUES
  ('ttb-2425-s1', '2024/2025 First Semester Examinations',
   '2025-01-06 00:00:00', '2025-01-31 00:00:00', true, NOW(), NOW());

-- ============================================================
-- TIMETABLE — 2024/2025 Second Semester (draft)
-- ============================================================
INSERT INTO "Timetable" (id, title, "startDate", "endDate", "isPublished", "createdAt", "updatedAt") VALUES
  ('ttb-2425-s2', '2024/2025 Second Semester Examinations',
   '2025-06-02 00:00:00', '2025-06-27 00:00:00', false, NOW(), NOW());


-- ============================================================
-- EXAM SLOTS — First Semester timetable
-- Sampling courses from several departments across levels.
-- Rules: max 2 exams/day per dept-level, weekdays only,
--        unique (date, timeSlot, timetableId).
-- TimeSlot enum: SLOT_8_10 | SLOT_10_12 | SLOT_1_3 | SLOT_3_5
-- ============================================================

-- Week 1: 06 Jan – 10 Jan 2025
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-06 08:00:00', 'SLOT_8_10',  id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'CSC101' AND "departmentId" = 'dep-csc-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-06 10:00:00', 'SLOT_10_12', id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'EEE101' AND "departmentId" = 'dep-ele-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-06 13:00:00', 'SLOT_1_3',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'ACC101' AND "departmentId" = 'dep-acc-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-06 15:00:00', 'SLOT_3_5',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'LAW101' AND "departmentId" = 'dep-law-001';

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-07 08:00:00', 'SLOT_8_10',  id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'CSC102' AND "departmentId" = 'dep-csc-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-07 10:00:00', 'SLOT_10_12', id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'EEE102' AND "departmentId" = 'dep-ele-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-07 13:00:00', 'SLOT_1_3',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'ACC102' AND "departmentId" = 'dep-acc-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-07 15:00:00', 'SLOT_3_5',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'BUS101' AND "departmentId" = 'dep-bus-001';

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-08 08:00:00', 'SLOT_8_10',  id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'CSC103' AND "departmentId" = 'dep-csc-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-08 10:00:00', 'SLOT_10_12', id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'MEE101' AND "departmentId" = 'dep-mec-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-08 13:00:00', 'SLOT_1_3',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'ECO101' AND "departmentId" = 'dep-eco-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-08 15:00:00', 'SLOT_3_5',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'MAS101' AND "departmentId" = 'dep-mas-001';

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-09 08:00:00', 'SLOT_8_10',  id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'PHY101' AND "departmentId" = 'dep-phy-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-09 10:00:00', 'SLOT_10_12', id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'MTH101' AND "departmentId" = 'dep-mth-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-09 13:00:00', 'SLOT_1_3',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'PSC101' AND "departmentId" = 'dep-psc-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-09 15:00:00', 'SLOT_3_5',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'ENG101' AND "departmentId" = 'dep-eng-001';

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-10 08:00:00', 'SLOT_8_10',  id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'CVE101' AND "departmentId" = 'dep-civ-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-10 10:00:00', 'SLOT_10_12', id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'CHE101' AND "departmentId" = 'dep-che-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-10 13:00:00', 'SLOT_1_3',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'SOC101' AND "departmentId" = 'dep-soc-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-10 15:00:00', 'SLOT_3_5',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'EDU101' AND "departmentId" = 'dep-edu-001';

-- Week 2: 13 Jan – 17 Jan 2025 (200 Level courses)
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-13 08:00:00', 'SLOT_8_10',  id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'CSC201' AND "departmentId" = 'dep-csc-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-13 10:00:00', 'SLOT_10_12', id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'EEE201' AND "departmentId" = 'dep-ele-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-13 13:00:00', 'SLOT_1_3',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'ACC201' AND "departmentId" = 'dep-acc-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-13 15:00:00', 'SLOT_3_5',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'LAW201' AND "departmentId" = 'dep-law-001';

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-14 08:00:00', 'SLOT_8_10',  id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'CSC202' AND "departmentId" = 'dep-csc-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-14 10:00:00', 'SLOT_10_12', id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'MEE201' AND "departmentId" = 'dep-mec-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-14 13:00:00', 'SLOT_1_3',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'ECO201' AND "departmentId" = 'dep-eco-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-14 15:00:00', 'SLOT_3_5',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'BUS201' AND "departmentId" = 'dep-bus-001';

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-15 08:00:00', 'SLOT_8_10',  id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'PHY201' AND "departmentId" = 'dep-phy-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-15 10:00:00', 'SLOT_10_12', id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'MTH201' AND "departmentId" = 'dep-mth-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-15 13:00:00', 'SLOT_1_3',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'MAS201' AND "departmentId" = 'dep-mas-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-15 15:00:00', 'SLOT_3_5',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'PSC201' AND "departmentId" = 'dep-psc-001';

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-16 08:00:00', 'SLOT_8_10',  id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'CVE201' AND "departmentId" = 'dep-civ-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-16 10:00:00', 'SLOT_10_12', id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'CHE201' AND "departmentId" = 'dep-che-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-16 13:00:00', 'SLOT_1_3',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'SOC201' AND "departmentId" = 'dep-soc-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-16 15:00:00', 'SLOT_3_5',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'ENG201' AND "departmentId" = 'dep-eng-001';

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-17 08:00:00', 'SLOT_8_10',  id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'EEE202' AND "departmentId" = 'dep-ele-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-17 10:00:00', 'SLOT_10_12', id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'ACC202' AND "departmentId" = 'dep-acc-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-17 13:00:00', 'SLOT_1_3',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'EDU201' AND "departmentId" = 'dep-edu-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-17 15:00:00', 'SLOT_3_5',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'LAW202' AND "departmentId" = 'dep-law-001';

-- Week 3: 20 Jan – 24 Jan 2025 (300 Level courses)
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-20 08:00:00', 'SLOT_8_10',  id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'CSC301' AND "departmentId" = 'dep-csc-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-20 10:00:00', 'SLOT_10_12', id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'EEE301' AND "departmentId" = 'dep-ele-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-20 13:00:00', 'SLOT_1_3',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'ACC301' AND "departmentId" = 'dep-acc-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-20 15:00:00', 'SLOT_3_5',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'LAW301' AND "departmentId" = 'dep-law-001';

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-21 08:00:00', 'SLOT_8_10',  id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'CSC302' AND "departmentId" = 'dep-csc-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-21 10:00:00', 'SLOT_10_12', id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'MEE301' AND "departmentId" = 'dep-mec-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-21 13:00:00', 'SLOT_1_3',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'ECO301' AND "departmentId" = 'dep-eco-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-21 15:00:00', 'SLOT_3_5',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'BUS301' AND "departmentId" = 'dep-bus-001';

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-22 08:00:00', 'SLOT_8_10',  id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'PHY301' AND "departmentId" = 'dep-phy-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-22 10:00:00', 'SLOT_10_12', id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'MTH301' AND "departmentId" = 'dep-mth-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-22 13:00:00', 'SLOT_1_3',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'MAS301' AND "departmentId" = 'dep-mas-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-22 15:00:00', 'SLOT_3_5',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'PSC301' AND "departmentId" = 'dep-psc-001';

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-23 08:00:00', 'SLOT_8_10',  id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'CVE301' AND "departmentId" = 'dep-civ-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-23 10:00:00', 'SLOT_10_12', id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'CHE301' AND "departmentId" = 'dep-che-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-23 13:00:00', 'SLOT_1_3',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'SOC301' AND "departmentId" = 'dep-soc-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-23 15:00:00', 'SLOT_3_5',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'ENG301' AND "departmentId" = 'dep-eng-001';

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-24 08:00:00', 'SLOT_8_10',  id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'EDU301' AND "departmentId" = 'dep-edu-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-24 10:00:00', 'SLOT_10_12', id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'LAW302' AND "departmentId" = 'dep-law-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-24 13:00:00', 'SLOT_1_3',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'EEE302' AND "departmentId" = 'dep-ele-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-24 15:00:00', 'SLOT_3_5',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'ACC302' AND "departmentId" = 'dep-acc-001';

-- Week 4: 27 Jan – 31 Jan 2025 (400 Level courses)
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-27 08:00:00', 'SLOT_8_10',  id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'CSC401' AND "departmentId" = 'dep-csc-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-27 10:00:00', 'SLOT_10_12', id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'EEE401' AND "departmentId" = 'dep-ele-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-27 13:00:00', 'SLOT_1_3',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'ACC401' AND "departmentId" = 'dep-acc-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-27 15:00:00', 'SLOT_3_5',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'LAW401' AND "departmentId" = 'dep-law-001';

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-28 08:00:00', 'SLOT_8_10',  id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'CSC402' AND "departmentId" = 'dep-csc-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-28 10:00:00', 'SLOT_10_12', id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'MEE401' AND "departmentId" = 'dep-mec-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-28 13:00:00', 'SLOT_1_3',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'ECO401' AND "departmentId" = 'dep-eco-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-28 15:00:00', 'SLOT_3_5',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'BUS401' AND "departmentId" = 'dep-bus-001';

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-29 08:00:00', 'SLOT_8_10',  id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'PHY401' AND "departmentId" = 'dep-phy-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-29 10:00:00', 'SLOT_10_12', id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'MTH401' AND "departmentId" = 'dep-mth-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-29 13:00:00', 'SLOT_1_3',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'CVE401' AND "departmentId" = 'dep-civ-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-29 15:00:00', 'SLOT_3_5',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'CHE401' AND "departmentId" = 'dep-che-001';

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-30 08:00:00', 'SLOT_8_10',  id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'LAW402' AND "departmentId" = 'dep-law-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-30 10:00:00', 'SLOT_10_12', id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'EEE402' AND "departmentId" = 'dep-ele-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-30 13:00:00', 'SLOT_1_3',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'ACC402' AND "departmentId" = 'dep-acc-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-30 15:00:00', 'SLOT_3_5',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'CSC403' AND "departmentId" = 'dep-csc-001';

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-31 08:00:00', 'SLOT_8_10',  id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'MEE402' AND "departmentId" = 'dep-mec-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-31 10:00:00', 'SLOT_10_12', id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'ECO402' AND "departmentId" = 'dep-eco-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-31 13:00:00', 'SLOT_1_3',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'LAW403' AND "departmentId" = 'dep-law-001';
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt")
SELECT gen_random_uuid(), '2025-01-31 15:00:00', 'SLOT_3_5',   id, 'ttb-2425-s1', NOW(), NOW() FROM "Course" WHERE code = 'BUS402' AND "departmentId" = 'dep-bus-001';

-- ============================================================
-- Done.
-- Run with: psql -U <user> -d <dbname> -f seed.sql
-- ============================================================
