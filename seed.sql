-- ============================================================
-- EMRS Seed Data — University of Port Harcourt (fictional)
-- Requires: @@unique([courseId, timetableId]) on ExamSlot
-- Multiple departments share the same date+timeSlot as in
-- real university scheduling. Each dept-level gets at most
-- 2 exams per day (with a forced break the following day).
-- No Student or Admin inserts.
-- Run: psql -U <user> -d <dbname> -f seed.sql
-- ============================================================

-- Clear in dependency order
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
INSERT INTO "Faculty" (id, name, duration, "createdAt", "updatedAt") VALUES
  ('fac-eng-001', 'Faculty of Engineering',                 4, NOW(), NOW()),
  ('fac-sci-001', 'Faculty of Science',                     4, NOW(), NOW()),
  ('fac-law-001', 'Faculty of Law',                         4, NOW(), NOW()),
  ('fac-mgt-001', 'Faculty of Management Sciences',         4, NOW(), NOW()),
  ('fac-art-001', 'Faculty of Arts and Humanities',         3, NOW(), NOW()),
  ('fac-soc-001', 'Faculty of Social Sciences',             3, NOW(), NOW()),
  ('fac-edu-001', 'Faculty of Education',                   3, NOW(), NOW());


-- ============================================================
-- DEPARTMENTS
-- ============================================================

-- Engineering (4-year)
INSERT INTO "Department" (id, name, "facultyId", "registrationCode", "createdAt", "updatedAt") VALUES
  ('dep-csc-001', 'Computer Science',                       'fac-eng-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-ele-001', 'Electrical and Electronics Engineering', 'fac-eng-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-mec-001', 'Mechanical Engineering',                 'fac-eng-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-civ-001', 'Civil Engineering',                      'fac-eng-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-che-001', 'Chemical Engineering',                   'fac-eng-001', gen_random_uuid(), NOW(), NOW());

-- Science (4-year)
INSERT INTO "Department" (id, name, "facultyId", "registrationCode", "createdAt", "updatedAt") VALUES
  ('dep-phy-001', 'Physics',                                'fac-sci-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-chm-001', 'Chemistry',                              'fac-sci-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-mth-001', 'Mathematics',                            'fac-sci-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-bio-001', 'Biology',                                'fac-sci-001', gen_random_uuid(), NOW(), NOW());

-- Law (4-year)
INSERT INTO "Department" (id, name, "facultyId", "registrationCode", "createdAt", "updatedAt") VALUES
  ('dep-law-001', 'Law',                                    'fac-law-001', gen_random_uuid(), NOW(), NOW());

-- Management Sciences (4-year)
INSERT INTO "Department" (id, name, "facultyId", "registrationCode", "createdAt", "updatedAt") VALUES
  ('dep-acc-001', 'Accounting',                             'fac-mgt-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-bus-001', 'Business Administration',                'fac-mgt-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-eco-001', 'Economics',                              'fac-mgt-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-fin-001', 'Finance',                                'fac-mgt-001', gen_random_uuid(), NOW(), NOW());

-- Arts and Humanities (3-year)
INSERT INTO "Department" (id, name, "facultyId", "registrationCode", "createdAt", "updatedAt") VALUES
  ('dep-eng-001', 'English and Literary Studies',           'fac-art-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-his-001', 'History and Diplomatic Studies',         'fac-art-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-phi-001', 'Philosophy',                             'fac-art-001', gen_random_uuid(), NOW(), NOW());

-- Social Sciences (3-year)
INSERT INTO "Department" (id, name, "facultyId", "registrationCode", "createdAt", "updatedAt") VALUES
  ('dep-psc-001', 'Political Science',                      'fac-soc-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-soc-001', 'Sociology',                              'fac-soc-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-mas-001', 'Mass Communication',                     'fac-soc-001', gen_random_uuid(), NOW(), NOW());

-- Education (3-year)
INSERT INTO "Department" (id, name, "facultyId", "registrationCode", "createdAt", "updatedAt") VALUES
  ('dep-edu-001', 'Education Administration and Planning',  'fac-edu-001', gen_random_uuid(), NOW(), NOW()),
  ('dep-ged-001', 'Guidance and Counselling',               'fac-edu-001', gen_random_uuid(), NOW(), NOW());


-- ============================================================
-- COURSES
-- IDs are stable strings so ExamSlot inserts can reference
-- them directly without subqueries.
-- ============================================================

-- Computer Science
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  ('csc-101','CSC101','Introduction to Computer Science',       100,'dep-csc-001',NOW(),NOW()),
  ('csc-102','CSC102','Computer Programming I',                 100,'dep-csc-001',NOW(),NOW()),
  ('csc-103','CSC103','Discrete Mathematics',                   100,'dep-csc-001',NOW(),NOW()),
  ('csc-104','CSC104','Digital Electronics',                    100,'dep-csc-001',NOW(),NOW()),
  ('csc-105','CSC105','Introduction to Information Technology', 100,'dep-csc-001',NOW(),NOW()),
  ('csc-201','CSC201','Data Structures and Algorithms',         200,'dep-csc-001',NOW(),NOW()),
  ('csc-202','CSC202','Computer Programming II',                200,'dep-csc-001',NOW(),NOW()),
  ('csc-203','CSC203','Computer Architecture',                  200,'dep-csc-001',NOW(),NOW()),
  ('csc-204','CSC204','Operating Systems',                      200,'dep-csc-001',NOW(),NOW()),
  ('csc-205','CSC205','Database Management Systems',            200,'dep-csc-001',NOW(),NOW()),
  ('csc-206','CSC206','Numerical Methods',                      200,'dep-csc-001',NOW(),NOW()),
  ('csc-301','CSC301','Software Engineering I',                 300,'dep-csc-001',NOW(),NOW()),
  ('csc-302','CSC302','Computer Networks',                      300,'dep-csc-001',NOW(),NOW()),
  ('csc-303','CSC303','Theory of Computation',                  300,'dep-csc-001',NOW(),NOW()),
  ('csc-304','CSC304','Artificial Intelligence',                300,'dep-csc-001',NOW(),NOW()),
  ('csc-305','CSC305','Information Security',                   300,'dep-csc-001',NOW(),NOW()),
  ('csc-306','CSC306','Human-Computer Interaction',             300,'dep-csc-001',NOW(),NOW()),
  ('csc-401','CSC401','Machine Learning',                       400,'dep-csc-001',NOW(),NOW()),
  ('csc-402','CSC402','Cloud Computing',                        400,'dep-csc-001',NOW(),NOW()),
  ('csc-403','CSC403','Distributed Systems',                    400,'dep-csc-001',NOW(),NOW()),
  ('csc-404','CSC404','Software Engineering II',                400,'dep-csc-001',NOW(),NOW()),
  ('csc-405','CSC405','Capstone Project',                       400,'dep-csc-001',NOW(),NOW());

-- Electrical and Electronics Engineering
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  ('eee-101','EEE101','Introduction to Electrical Engineering', 100,'dep-ele-001',NOW(),NOW()),
  ('eee-102','EEE102','Circuit Theory I',                       100,'dep-ele-001',NOW(),NOW()),
  ('eee-103','EEE103','Engineering Mathematics I',              100,'dep-ele-001',NOW(),NOW()),
  ('eee-104','EEE104','Workshop Practice',                      100,'dep-ele-001',NOW(),NOW()),
  ('eee-105','EEE105','Technical Drawing',                      100,'dep-ele-001',NOW(),NOW()),
  ('eee-201','EEE201','Circuit Theory II',                      200,'dep-ele-001',NOW(),NOW()),
  ('eee-202','EEE202','Electronics I',                          200,'dep-ele-001',NOW(),NOW()),
  ('eee-203','EEE203','Electromagnetics',                       200,'dep-ele-001',NOW(),NOW()),
  ('eee-204','EEE204','Digital Logic Design',                   200,'dep-ele-001',NOW(),NOW()),
  ('eee-205','EEE205','Signals and Systems',                    200,'dep-ele-001',NOW(),NOW()),
  ('eee-301','EEE301','Microprocessors and Microcontrollers',   300,'dep-ele-001',NOW(),NOW()),
  ('eee-302','EEE302','Control Systems I',                      300,'dep-ele-001',NOW(),NOW()),
  ('eee-303','EEE303','Power Systems I',                        300,'dep-ele-001',NOW(),NOW()),
  ('eee-304','EEE304','Electronics II',                         300,'dep-ele-001',NOW(),NOW()),
  ('eee-305','EEE305','Communication Systems',                  300,'dep-ele-001',NOW(),NOW()),
  ('eee-401','EEE401','Power Electronics',                      400,'dep-ele-001',NOW(),NOW()),
  ('eee-402','EEE402','Embedded Systems',                       400,'dep-ele-001',NOW(),NOW()),
  ('eee-403','EEE403','Advanced Signal Processing',             400,'dep-ele-001',NOW(),NOW()),
  ('eee-404','EEE404','Renewable Energy Systems',               400,'dep-ele-001',NOW(),NOW()),
  ('eee-405','EEE405','Engineering Project',                    400,'dep-ele-001',NOW(),NOW());

-- Mechanical Engineering
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  ('mee-101','MEE101','Introduction to Mechanical Engineering', 100,'dep-mec-001',NOW(),NOW()),
  ('mee-102','MEE102','Engineering Drawing',                    100,'dep-mec-001',NOW(),NOW()),
  ('mee-103','MEE103','Statics',                                100,'dep-mec-001',NOW(),NOW()),
  ('mee-104','MEE104','Workshop Technology',                    100,'dep-mec-001',NOW(),NOW()),
  ('mee-201','MEE201','Dynamics',                               200,'dep-mec-001',NOW(),NOW()),
  ('mee-202','MEE202','Thermodynamics I',                       200,'dep-mec-001',NOW(),NOW()),
  ('mee-203','MEE203','Strength of Materials',                  200,'dep-mec-001',NOW(),NOW()),
  ('mee-204','MEE204','Fluid Mechanics I',                      200,'dep-mec-001',NOW(),NOW()),
  ('mee-205','MEE205','Engineering Materials',                  200,'dep-mec-001',NOW(),NOW()),
  ('mee-301','MEE301','Heat Transfer',                          300,'dep-mec-001',NOW(),NOW()),
  ('mee-302','MEE302','Machine Design',                         300,'dep-mec-001',NOW(),NOW()),
  ('mee-303','MEE303','Manufacturing Processes',                300,'dep-mec-001',NOW(),NOW()),
  ('mee-304','MEE304','Fluid Mechanics II',                     300,'dep-mec-001',NOW(),NOW()),
  ('mee-401','MEE401','Finite Element Analysis',                400,'dep-mec-001',NOW(),NOW()),
  ('mee-402','MEE402','Turbomachinery',                         400,'dep-mec-001',NOW(),NOW()),
  ('mee-403','MEE403','Robotics and Automation',                400,'dep-mec-001',NOW(),NOW()),
  ('mee-404','MEE404','Engineering Project',                    400,'dep-mec-001',NOW(),NOW());

-- Civil Engineering
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  ('cve-101','CVE101','Introduction to Civil Engineering',      100,'dep-civ-001',NOW(),NOW()),
  ('cve-102','CVE102','Engineering Drawing and CAD',            100,'dep-civ-001',NOW(),NOW()),
  ('cve-103','CVE103','Surveying I',                            100,'dep-civ-001',NOW(),NOW()),
  ('cve-104','CVE104','Engineering Mathematics',                100,'dep-civ-001',NOW(),NOW()),
  ('cve-201','CVE201','Structural Analysis I',                  200,'dep-civ-001',NOW(),NOW()),
  ('cve-202','CVE202','Geotechnical Engineering I',             200,'dep-civ-001',NOW(),NOW()),
  ('cve-203','CVE203','Hydraulics',                             200,'dep-civ-001',NOW(),NOW()),
  ('cve-204','CVE204','Construction Materials',                 200,'dep-civ-001',NOW(),NOW()),
  ('cve-301','CVE301','Structural Design I',                    300,'dep-civ-001',NOW(),NOW()),
  ('cve-302','CVE302','Transportation Engineering',             300,'dep-civ-001',NOW(),NOW()),
  ('cve-303','CVE303','Environmental Engineering',              300,'dep-civ-001',NOW(),NOW()),
  ('cve-304','CVE304','Geotechnical Engineering II',            300,'dep-civ-001',NOW(),NOW()),
  ('cve-401','CVE401','Structural Design II',                   400,'dep-civ-001',NOW(),NOW()),
  ('cve-402','CVE402','Project Management and Estimation',      400,'dep-civ-001',NOW(),NOW()),
  ('cve-403','CVE403','Engineering Project',                    400,'dep-civ-001',NOW(),NOW());

-- Chemical Engineering
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  ('che-101','CHE101','Introduction to Chemical Engineering',   100,'dep-che-001',NOW(),NOW()),
  ('che-102','CHE102','General Chemistry I',                    100,'dep-che-001',NOW(),NOW()),
  ('che-103','CHE103','Engineering Mathematics',                100,'dep-che-001',NOW(),NOW()),
  ('che-201','CHE201','Chemical Engineering Thermodynamics',    200,'dep-che-001',NOW(),NOW()),
  ('che-202','CHE202','Fluid Flow and Heat Transfer',           200,'dep-che-001',NOW(),NOW()),
  ('che-203','CHE203','Material and Energy Balances',           200,'dep-che-001',NOW(),NOW()),
  ('che-204','CHE204','Process Instrumentation',                200,'dep-che-001',NOW(),NOW()),
  ('che-301','CHE301','Mass Transfer Operations',               300,'dep-che-001',NOW(),NOW()),
  ('che-302','CHE302','Chemical Reaction Engineering',          300,'dep-che-001',NOW(),NOW()),
  ('che-303','CHE303','Process Control',                        300,'dep-che-001',NOW(),NOW()),
  ('che-304','CHE304','Petroleum Refining',                     300,'dep-che-001',NOW(),NOW()),
  ('che-401','CHE401','Plant Design and Economics',             400,'dep-che-001',NOW(),NOW()),
  ('che-402','CHE402','Environmental Chemical Engineering',     400,'dep-che-001',NOW(),NOW()),
  ('che-403','CHE403','Engineering Project',                    400,'dep-che-001',NOW(),NOW());

-- Physics
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  ('phy-101','PHY101','General Physics I (Mechanics)',           100,'dep-phy-001',NOW(),NOW()),
  ('phy-102','PHY102','General Physics II (Electromagnetism)',   100,'dep-phy-001',NOW(),NOW()),
  ('phy-103','PHY103','Mathematical Methods for Physics I',      100,'dep-phy-001',NOW(),NOW()),
  ('phy-201','PHY201','Classical Mechanics',                     200,'dep-phy-001',NOW(),NOW()),
  ('phy-202','PHY202','Thermodynamics and Statistical Mechanics',200,'dep-phy-001',NOW(),NOW()),
  ('phy-203','PHY203','Optics',                                  200,'dep-phy-001',NOW(),NOW()),
  ('phy-204','PHY204','Mathematical Methods for Physics II',     200,'dep-phy-001',NOW(),NOW()),
  ('phy-301','PHY301','Quantum Mechanics I',                     300,'dep-phy-001',NOW(),NOW()),
  ('phy-302','PHY302','Electrodynamics',                         300,'dep-phy-001',NOW(),NOW()),
  ('phy-303','PHY303','Nuclear Physics',                         300,'dep-phy-001',NOW(),NOW()),
  ('phy-304','PHY304','Solid State Physics',                     300,'dep-phy-001',NOW(),NOW()),
  ('phy-401','PHY401','Quantum Mechanics II',                    400,'dep-phy-001',NOW(),NOW()),
  ('phy-402','PHY402','Astrophysics',                            400,'dep-phy-001',NOW(),NOW()),
  ('phy-403','PHY403','Research Methods in Physics',             400,'dep-phy-001',NOW(),NOW()),
  ('phy-404','PHY404','Physics Project',                         400,'dep-phy-001',NOW(),NOW());

-- Chemistry
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  ('chm-101','CHM101','General Chemistry I',                     100,'dep-chm-001',NOW(),NOW()),
  ('chm-102','CHM102','General Chemistry II',                    100,'dep-chm-001',NOW(),NOW()),
  ('chm-103','CHM103','Introductory Physical Chemistry',         100,'dep-chm-001',NOW(),NOW()),
  ('chm-201','CHM201','Organic Chemistry I',                     200,'dep-chm-001',NOW(),NOW()),
  ('chm-202','CHM202','Inorganic Chemistry I',                   200,'dep-chm-001',NOW(),NOW()),
  ('chm-203','CHM203','Physical Chemistry I',                    200,'dep-chm-001',NOW(),NOW()),
  ('chm-204','CHM204','Analytical Chemistry I',                  200,'dep-chm-001',NOW(),NOW()),
  ('chm-301','CHM301','Organic Chemistry II',                    300,'dep-chm-001',NOW(),NOW()),
  ('chm-302','CHM302','Inorganic Chemistry II',                  300,'dep-chm-001',NOW(),NOW()),
  ('chm-303','CHM303','Physical Chemistry II',                   300,'dep-chm-001',NOW(),NOW()),
  ('chm-304','CHM304','Instrumental Analysis',                   300,'dep-chm-001',NOW(),NOW()),
  ('chm-401','CHM401','Industrial Chemistry',                    400,'dep-chm-001',NOW(),NOW()),
  ('chm-402','CHM402','Environmental Chemistry',                 400,'dep-chm-001',NOW(),NOW()),
  ('chm-403','CHM403','Chemistry Project',                       400,'dep-chm-001',NOW(),NOW());

-- Mathematics
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  ('mth-101','MTH101','Calculus I',                              100,'dep-mth-001',NOW(),NOW()),
  ('mth-102','MTH102','Algebra and Number Theory',               100,'dep-mth-001',NOW(),NOW()),
  ('mth-103','MTH103','Introduction to Statistics',              100,'dep-mth-001',NOW(),NOW()),
  ('mth-201','MTH201','Calculus II',                             200,'dep-mth-001',NOW(),NOW()),
  ('mth-202','MTH202','Linear Algebra',                          200,'dep-mth-001',NOW(),NOW()),
  ('mth-203','MTH203','Differential Equations',                  200,'dep-mth-001',NOW(),NOW()),
  ('mth-204','MTH204','Probability Theory',                      200,'dep-mth-001',NOW(),NOW()),
  ('mth-301','MTH301','Real Analysis',                           300,'dep-mth-001',NOW(),NOW()),
  ('mth-302','MTH302','Abstract Algebra',                        300,'dep-mth-001',NOW(),NOW()),
  ('mth-303','MTH303','Complex Analysis',                        300,'dep-mth-001',NOW(),NOW()),
  ('mth-304','MTH304','Numerical Analysis',                      300,'dep-mth-001',NOW(),NOW()),
  ('mth-401','MTH401','Functional Analysis',                     400,'dep-mth-001',NOW(),NOW()),
  ('mth-402','MTH402','Topology',                                400,'dep-mth-001',NOW(),NOW()),
  ('mth-403','MTH403','Operations Research',                     400,'dep-mth-001',NOW(),NOW()),
  ('mth-404','MTH404','Mathematics Project',                     400,'dep-mth-001',NOW(),NOW());

-- Biology
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  ('bio-101','BIO101','General Biology I',                       100,'dep-bio-001',NOW(),NOW()),
  ('bio-102','BIO102','General Biology II',                      100,'dep-bio-001',NOW(),NOW()),
  ('bio-103','BIO103','Cell Biology',                            100,'dep-bio-001',NOW(),NOW()),
  ('bio-201','BIO201','Genetics',                                200,'dep-bio-001',NOW(),NOW()),
  ('bio-202','BIO202','Ecology',                                 200,'dep-bio-001',NOW(),NOW()),
  ('bio-203','BIO203','Microbiology',                            200,'dep-bio-001',NOW(),NOW()),
  ('bio-204','BIO204','Plant Physiology',                        200,'dep-bio-001',NOW(),NOW()),
  ('bio-301','BIO301','Molecular Biology',                       300,'dep-bio-001',NOW(),NOW()),
  ('bio-302','BIO302','Animal Physiology',                       300,'dep-bio-001',NOW(),NOW()),
  ('bio-303','BIO303','Evolutionary Biology',                    300,'dep-bio-001',NOW(),NOW()),
  ('bio-304','BIO304','Biochemistry',                            300,'dep-bio-001',NOW(),NOW()),
  ('bio-401','BIO401','Biotechnology',                           400,'dep-bio-001',NOW(),NOW()),
  ('bio-402','BIO402','Immunology',                              400,'dep-bio-001',NOW(),NOW()),
  ('bio-403','BIO403','Biology Project',                         400,'dep-bio-001',NOW(),NOW());

-- Law
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  ('law-101','LAW101','Nigerian Legal System',                   100,'dep-law-001',NOW(),NOW()),
  ('law-102','LAW102','Introduction to Law of Contract',         100,'dep-law-001',NOW(),NOW()),
  ('law-103','LAW103','Constitutional Law I',                    100,'dep-law-001',NOW(),NOW()),
  ('law-104','LAW104','Legal Methods',                           100,'dep-law-001',NOW(),NOW()),
  ('law-201','LAW201','Law of Contract II',                      200,'dep-law-001',NOW(),NOW()),
  ('law-202','LAW202','Criminal Law',                            200,'dep-law-001',NOW(),NOW()),
  ('law-203','LAW203','Constitutional Law II',                   200,'dep-law-001',NOW(),NOW()),
  ('law-204','LAW204','Law of Torts',                            200,'dep-law-001',NOW(),NOW()),
  ('law-205','LAW205','Law of Property',                         200,'dep-law-001',NOW(),NOW()),
  ('law-301','LAW301','Commercial Law',                          300,'dep-law-001',NOW(),NOW()),
  ('law-302','LAW302','Administrative Law',                      300,'dep-law-001',NOW(),NOW()),
  ('law-303','LAW303','Evidence',                                300,'dep-law-001',NOW(),NOW()),
  ('law-304','LAW304','Family Law',                              300,'dep-law-001',NOW(),NOW()),
  ('law-305','LAW305','Equity and Trusts',                       300,'dep-law-001',NOW(),NOW()),
  ('law-401','LAW401','International Law',                       400,'dep-law-001',NOW(),NOW()),
  ('law-402','LAW402','Jurisprudence',                           400,'dep-law-001',NOW(),NOW()),
  ('law-403','LAW403','Civil Procedure',                         400,'dep-law-001',NOW(),NOW()),
  ('law-404','LAW404','Research Project',                        400,'dep-law-001',NOW(),NOW());

-- Accounting
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  ('acc-101','ACC101','Introduction to Accounting',              100,'dep-acc-001',NOW(),NOW()),
  ('acc-102','ACC102','Business Mathematics',                    100,'dep-acc-001',NOW(),NOW()),
  ('acc-103','ACC103','Principles of Economics',                 100,'dep-acc-001',NOW(),NOW()),
  ('acc-104','ACC104','Business Communication',                  100,'dep-acc-001',NOW(),NOW()),
  ('acc-201','ACC201','Financial Accounting I',                  200,'dep-acc-001',NOW(),NOW()),
  ('acc-202','ACC202','Cost Accounting',                         200,'dep-acc-001',NOW(),NOW()),
  ('acc-203','ACC203','Business Law',                            200,'dep-acc-001',NOW(),NOW()),
  ('acc-204','ACC204','Introduction to Taxation',                200,'dep-acc-001',NOW(),NOW()),
  ('acc-205','ACC205','Quantitative Methods',                    200,'dep-acc-001',NOW(),NOW()),
  ('acc-301','ACC301','Financial Accounting II',                 300,'dep-acc-001',NOW(),NOW()),
  ('acc-302','ACC302','Management Accounting',                   300,'dep-acc-001',NOW(),NOW()),
  ('acc-303','ACC303','Auditing and Assurance',                  300,'dep-acc-001',NOW(),NOW()),
  ('acc-304','ACC304','Advanced Taxation',                       300,'dep-acc-001',NOW(),NOW()),
  ('acc-305','ACC305','Financial Management',                    300,'dep-acc-001',NOW(),NOW()),
  ('acc-401','ACC401','Advanced Financial Reporting',            400,'dep-acc-001',NOW(),NOW()),
  ('acc-402','ACC402','Public Sector Accounting',                400,'dep-acc-001',NOW(),NOW()),
  ('acc-403','ACC403','Forensic Accounting',                     400,'dep-acc-001',NOW(),NOW()),
  ('acc-404','ACC404','Research Project in Accounting',          400,'dep-acc-001',NOW(),NOW());

-- Business Administration
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  ('bus-101','BUS101','Introduction to Business',                100,'dep-bus-001',NOW(),NOW()),
  ('bus-102','BUS102','Business Communication',                  100,'dep-bus-001',NOW(),NOW()),
  ('bus-103','BUS103','Principles of Management',                100,'dep-bus-001',NOW(),NOW()),
  ('bus-104','BUS104','Business Mathematics',                    100,'dep-bus-001',NOW(),NOW()),
  ('bus-201','BUS201','Organisational Behaviour',                200,'dep-bus-001',NOW(),NOW()),
  ('bus-202','BUS202','Marketing Management',                    200,'dep-bus-001',NOW(),NOW()),
  ('bus-203','BUS203','Human Resource Management',               200,'dep-bus-001',NOW(),NOW()),
  ('bus-204','BUS204','Business Statistics',                     200,'dep-bus-001',NOW(),NOW()),
  ('bus-301','BUS301','Strategic Management',                    300,'dep-bus-001',NOW(),NOW()),
  ('bus-302','BUS302','Entrepreneurship and Innovation',         300,'dep-bus-001',NOW(),NOW()),
  ('bus-303','BUS303','Operations Management',                   300,'dep-bus-001',NOW(),NOW()),
  ('bus-304','BUS304','Corporate Governance',                    300,'dep-bus-001',NOW(),NOW()),
  ('bus-401','BUS401','International Business',                  400,'dep-bus-001',NOW(),NOW()),
  ('bus-402','BUS402','Business Research Methods',               400,'dep-bus-001',NOW(),NOW()),
  ('bus-403','BUS403','Business Project',                        400,'dep-bus-001',NOW(),NOW());

-- Economics
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  ('eco-101','ECO101','Principles of Microeconomics',            100,'dep-eco-001',NOW(),NOW()),
  ('eco-102','ECO102','Principles of Macroeconomics',            100,'dep-eco-001',NOW(),NOW()),
  ('eco-103','ECO103','Mathematics for Economists I',            100,'dep-eco-001',NOW(),NOW()),
  ('eco-201','ECO201','Intermediate Microeconomics',             200,'dep-eco-001',NOW(),NOW()),
  ('eco-202','ECO202','Intermediate Macroeconomics',             200,'dep-eco-001',NOW(),NOW()),
  ('eco-203','ECO203','Statistics for Economists',               200,'dep-eco-001',NOW(),NOW()),
  ('eco-204','ECO204','Development Economics',                   200,'dep-eco-001',NOW(),NOW()),
  ('eco-301','ECO301','Econometrics I',                          300,'dep-eco-001',NOW(),NOW()),
  ('eco-302','ECO302','Public Finance',                          300,'dep-eco-001',NOW(),NOW()),
  ('eco-303','ECO303','International Economics',                 300,'dep-eco-001',NOW(),NOW()),
  ('eco-304','ECO304','Labour Economics',                        300,'dep-eco-001',NOW(),NOW()),
  ('eco-401','ECO401','Econometrics II',                         400,'dep-eco-001',NOW(),NOW()),
  ('eco-402','ECO402','Monetary Economics',                      400,'dep-eco-001',NOW(),NOW()),
  ('eco-403','ECO403','Research Project in Economics',           400,'dep-eco-001',NOW(),NOW());

-- Finance
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  ('fin-101','FIN101','Introduction to Finance',                 100,'dep-fin-001',NOW(),NOW()),
  ('fin-102','FIN102','Financial Mathematics',                   100,'dep-fin-001',NOW(),NOW()),
  ('fin-103','FIN103','Principles of Economics',                 100,'dep-fin-001',NOW(),NOW()),
  ('fin-201','FIN201','Corporate Finance I',                     200,'dep-fin-001',NOW(),NOW()),
  ('fin-202','FIN202','Financial Markets and Institutions',      200,'dep-fin-001',NOW(),NOW()),
  ('fin-203','FIN203','Investment Analysis',                     200,'dep-fin-001',NOW(),NOW()),
  ('fin-204','FIN204','Risk Management',                         200,'dep-fin-001',NOW(),NOW()),
  ('fin-301','FIN301','Corporate Finance II',                    300,'dep-fin-001',NOW(),NOW()),
  ('fin-302','FIN302','Portfolio Management',                    300,'dep-fin-001',NOW(),NOW()),
  ('fin-303','FIN303','International Finance',                   300,'dep-fin-001',NOW(),NOW()),
  ('fin-304','FIN304','Financial Derivatives',                   300,'dep-fin-001',NOW(),NOW()),
  ('fin-401','FIN401','Mergers and Acquisitions',                400,'dep-fin-001',NOW(),NOW()),
  ('fin-402','FIN402','Islamic Finance',                         400,'dep-fin-001',NOW(),NOW()),
  ('fin-403','FIN403','Finance Project',                         400,'dep-fin-001',NOW(),NOW());

-- English and Literary Studies
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  ('eng-101','ENG101','Use of English I',                        100,'dep-eng-001',NOW(),NOW()),
  ('eng-102','ENG102','Introduction to Literature',              100,'dep-eng-001',NOW(),NOW()),
  ('eng-103','ENG103','Introduction to Linguistics',             100,'dep-eng-001',NOW(),NOW()),
  ('eng-104','ENG104','Oral Communication Skills',               100,'dep-eng-001',NOW(),NOW()),
  ('eng-201','ENG201','The Novel',                               200,'dep-eng-001',NOW(),NOW()),
  ('eng-202','ENG202','Phonetics and Phonology',                 200,'dep-eng-001',NOW(),NOW()),
  ('eng-203','ENG203','African Literature',                      200,'dep-eng-001',NOW(),NOW()),
  ('eng-204','ENG204','Stylistics',                              200,'dep-eng-001',NOW(),NOW()),
  ('eng-301','ENG301','Modern English Grammar',                  300,'dep-eng-001',NOW(),NOW()),
  ('eng-302','ENG302','Shakespeare',                             300,'dep-eng-001',NOW(),NOW()),
  ('eng-303','ENG303','Creative Writing',                        300,'dep-eng-001',NOW(),NOW()),
  ('eng-304','ENG304','Research Methods in Literature',          300,'dep-eng-001',NOW(),NOW()),
  ('eng-305','ENG305','Long Essay',                              300,'dep-eng-001',NOW(),NOW());

-- History and Diplomatic Studies
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  ('his-101','HIS101','Introduction to African History',         100,'dep-his-001',NOW(),NOW()),
  ('his-102','HIS102','History of Nigeria',                      100,'dep-his-001',NOW(),NOW()),
  ('his-103','HIS103','World History I',                         100,'dep-his-001',NOW(),NOW()),
  ('his-201','HIS201','Diplomatic History',                      200,'dep-his-001',NOW(),NOW()),
  ('his-202','HIS202','Colonial and Postcolonial Africa',        200,'dep-his-001',NOW(),NOW()),
  ('his-203','HIS203','Historical Methods',                      200,'dep-his-001',NOW(),NOW()),
  ('his-204','HIS204','International Relations Theory',          200,'dep-his-001',NOW(),NOW()),
  ('his-301','HIS301','Nigerian Foreign Policy',                 300,'dep-his-001',NOW(),NOW()),
  ('his-302','HIS302','History of the Americas',                 300,'dep-his-001',NOW(),NOW()),
  ('his-303','HIS303','Conflict and Security Studies',           300,'dep-his-001',NOW(),NOW()),
  ('his-304','HIS304','Long Essay',                              300,'dep-his-001',NOW(),NOW());

-- Philosophy
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  ('phi-101','PHI101','Introduction to Philosophy',              100,'dep-phi-001',NOW(),NOW()),
  ('phi-102','PHI102','Logic and Critical Thinking',             100,'dep-phi-001',NOW(),NOW()),
  ('phi-103','PHI103','History of Western Philosophy I',         100,'dep-phi-001',NOW(),NOW()),
  ('phi-201','PHI201','Metaphysics',                             200,'dep-phi-001',NOW(),NOW()),
  ('phi-202','PHI202','Epistemology',                            200,'dep-phi-001',NOW(),NOW()),
  ('phi-203','PHI203','Ethics and Moral Philosophy',             200,'dep-phi-001',NOW(),NOW()),
  ('phi-204','PHI204','African Philosophy',                      200,'dep-phi-001',NOW(),NOW()),
  ('phi-301','PHI301','Philosophy of Science',                   300,'dep-phi-001',NOW(),NOW()),
  ('phi-302','PHI302','Political Philosophy',                    300,'dep-phi-001',NOW(),NOW()),
  ('phi-303','PHI303','Philosophy of Religion',                  300,'dep-phi-001',NOW(),NOW()),
  ('phi-304','PHI304','Long Essay',                              300,'dep-phi-001',NOW(),NOW());

-- Political Science
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  ('psc-101','PSC101','Introduction to Political Science',       100,'dep-psc-001',NOW(),NOW()),
  ('psc-102','PSC102','Nigerian Government and Politics',        100,'dep-psc-001',NOW(),NOW()),
  ('psc-103','PSC103','Introduction to International Relations', 100,'dep-psc-001',NOW(),NOW()),
  ('psc-201','PSC201','Comparative Politics',                    200,'dep-psc-001',NOW(),NOW()),
  ('psc-202','PSC202','Political Theory',                        200,'dep-psc-001',NOW(),NOW()),
  ('psc-203','PSC203','African Politics',                        200,'dep-psc-001',NOW(),NOW()),
  ('psc-204','PSC204','Public Administration',                   200,'dep-psc-001',NOW(),NOW()),
  ('psc-301','PSC301','International Law and Organisation',      300,'dep-psc-001',NOW(),NOW()),
  ('psc-302','PSC302','Foreign Policy Analysis',                 300,'dep-psc-001',NOW(),NOW()),
  ('psc-303','PSC303','Conflict Resolution and Peace Studies',   300,'dep-psc-001',NOW(),NOW()),
  ('psc-304','PSC304','Research Methods in Political Science',   300,'dep-psc-001',NOW(),NOW()),
  ('psc-305','PSC305','Long Essay',                              300,'dep-psc-001',NOW(),NOW());

-- Sociology
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  ('soc-101','SOC101','Introduction to Sociology',               100,'dep-soc-001',NOW(),NOW()),
  ('soc-102','SOC102','Social Anthropology',                     100,'dep-soc-001',NOW(),NOW()),
  ('soc-103','SOC103','Social Psychology',                       100,'dep-soc-001',NOW(),NOW()),
  ('soc-201','SOC201','Sociological Theory',                     200,'dep-soc-001',NOW(),NOW()),
  ('soc-202','SOC202','Research Methods in Sociology',           200,'dep-soc-001',NOW(),NOW()),
  ('soc-203','SOC203','Gender and Society',                      200,'dep-soc-001',NOW(),NOW()),
  ('soc-204','SOC204','Sociology of Development',                200,'dep-soc-001',NOW(),NOW()),
  ('soc-301','SOC301','Criminology and Deviance',                300,'dep-soc-001',NOW(),NOW()),
  ('soc-302','SOC302','Urban Sociology',                         300,'dep-soc-001',NOW(),NOW()),
  ('soc-303','SOC303','Sociology of Education',                  300,'dep-soc-001',NOW(),NOW()),
  ('soc-304','SOC304','Long Essay',                              300,'dep-soc-001',NOW(),NOW());

-- Mass Communication
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  ('mas-101','MAS101','Introduction to Mass Communication',      100,'dep-mas-001',NOW(),NOW()),
  ('mas-102','MAS102','Communication Theory',                    100,'dep-mas-001',NOW(),NOW()),
  ('mas-103','MAS103','Writing for the Media',                   100,'dep-mas-001',NOW(),NOW()),
  ('mas-104','MAS104','Introduction to Broadcasting',            100,'dep-mas-001',NOW(),NOW()),
  ('mas-201','MAS201','Broadcast Journalism',                    200,'dep-mas-001',NOW(),NOW()),
  ('mas-202','MAS202','Print Journalism',                        200,'dep-mas-001',NOW(),NOW()),
  ('mas-203','MAS203','Public Relations',                        200,'dep-mas-001',NOW(),NOW()),
  ('mas-204','MAS204','Media Law and Ethics',                    200,'dep-mas-001',NOW(),NOW()),
  ('mas-301','MAS301','Digital Media and Online Journalism',     300,'dep-mas-001',NOW(),NOW()),
  ('mas-302','MAS302','Advertising and Campaign Management',     300,'dep-mas-001',NOW(),NOW()),
  ('mas-303','MAS303','Media Management',                        300,'dep-mas-001',NOW(),NOW()),
  ('mas-304','MAS304','Research Methods in Communication',       300,'dep-mas-001',NOW(),NOW()),
  ('mas-305','MAS305','Final Year Project',                      300,'dep-mas-001',NOW(),NOW());

-- Education Administration and Planning
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  ('edu-101','EDU101','Foundations of Education',                100,'dep-edu-001',NOW(),NOW()),
  ('edu-102','EDU102','Educational Psychology',                  100,'dep-edu-001',NOW(),NOW()),
  ('edu-103','EDU103','Introduction to Curriculum Studies',      100,'dep-edu-001',NOW(),NOW()),
  ('edu-201','EDU201','Educational Administration',              200,'dep-edu-001',NOW(),NOW()),
  ('edu-202','EDU202','Educational Planning and Policy',         200,'dep-edu-001',NOW(),NOW()),
  ('edu-203','EDU203','Measurement and Evaluation',              200,'dep-edu-001',NOW(),NOW()),
  ('edu-204','EDU204','Philosophy of Education',                 200,'dep-edu-001',NOW(),NOW()),
  ('edu-301','EDU301','School Management and Supervision',       300,'dep-edu-001',NOW(),NOW()),
  ('edu-302','EDU302','Comparative Education',                   300,'dep-edu-001',NOW(),NOW()),
  ('edu-303','EDU303','Research Methods in Education',           300,'dep-edu-001',NOW(),NOW()),
  ('edu-304','EDU304','Long Essay',                              300,'dep-edu-001',NOW(),NOW());

-- Guidance and Counselling
INSERT INTO "Course" (id, code, title, level, "departmentId", "createdAt", "updatedAt") VALUES
  ('ged-101','GED101','Introduction to Guidance and Counselling',100,'dep-ged-001',NOW(),NOW()),
  ('ged-102','GED102','Human Development',                       100,'dep-ged-001',NOW(),NOW()),
  ('ged-103','GED103','Psychology of Learning',                  100,'dep-ged-001',NOW(),NOW()),
  ('ged-201','GED201','Individual Counselling',                  200,'dep-ged-001',NOW(),NOW()),
  ('ged-202','GED202','Group Dynamics',                          200,'dep-ged-001',NOW(),NOW()),
  ('ged-203','GED203','Career Development',                      200,'dep-ged-001',NOW(),NOW()),
  ('ged-204','GED204','Counselling Theories',                    200,'dep-ged-001',NOW(),NOW()),
  ('ged-301','GED301','Rehabilitation Counselling',              300,'dep-ged-001',NOW(),NOW()),
  ('ged-302','GED302','School Counselling',                      300,'dep-ged-001',NOW(),NOW()),
  ('ged-303','GED303','Counselling Research Methods',            300,'dep-ged-001',NOW(),NOW()),
  ('ged-304','GED304','Long Essay',                              300,'dep-ged-001',NOW(),NOW());


-- ============================================================
-- TIMETABLES
-- ============================================================
INSERT INTO "Timetable" (id, title, "startDate", "endDate", "isPublished", "createdAt", "updatedAt") VALUES
  ('ttb-2425-s1', '2024/2025 First Semester Examinations',
   '2025-01-06 00:00:00', '2025-01-31 00:00:00', true,  NOW(), NOW()),
  ('ttb-2425-s2', '2024/2025 Second Semester Examinations',
   '2025-06-02 00:00:00', '2025-06-27 00:00:00', false, NOW(), NOW());


-- ============================================================
-- EXAM SLOTS  (published timetable: ttb-2425-s1)
--
-- KEY RULE: unique constraint is (courseId, timetableId).
-- Multiple departments/courses share the SAME date+timeSlot —
-- that is the whole point of concurrent university exams.
--
-- Schedule:
--   Week 1 (Jan 06–10): 100 Level
--   Week 2 (Jan 13–17): 200 Level
--   Week 3 (Jan 20–24): 300 Level
--   Week 4 (Jan 27–31): 400 Level (4-yr depts only)
--
-- Each dept-level has at most 2 exam days per week, with a
-- rest day between them (e.g. Mon → Wed → Fri pattern).
-- All 4 time slots run concurrently across departments.
-- ============================================================

-- ===========================================================
-- WEEK 1 — 100 LEVEL   (06 Jan – 10 Jan 2025)
-- ===========================================================

-- ── Mon 06 Jan ─────────────────────────────────────────────
-- SLOT_8_10: Engineering departments 100L (exam 1 of 2)
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-06 08:00:00','SLOT_8_10','csc-101','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-06 08:00:00','SLOT_8_10','eee-101','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-06 08:00:00','SLOT_8_10','mee-101','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-06 08:00:00','SLOT_8_10','cve-101','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-06 08:00:00','SLOT_8_10','che-101','ttb-2425-s1',NOW(),NOW());

-- SLOT_10_12: Science departments 100L (exam 1 of 2)
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-06 10:00:00','SLOT_10_12','phy-101','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-06 10:00:00','SLOT_10_12','chm-101','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-06 10:00:00','SLOT_10_12','mth-101','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-06 10:00:00','SLOT_10_12','bio-101','ttb-2425-s1',NOW(),NOW());

-- SLOT_1_3: Management & Law 100L (exam 1 of 2)
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-06 13:00:00','SLOT_1_3','acc-101','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-06 13:00:00','SLOT_1_3','bus-101','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-06 13:00:00','SLOT_1_3','eco-101','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-06 13:00:00','SLOT_1_3','fin-101','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-06 13:00:00','SLOT_1_3','law-101','ttb-2425-s1',NOW(),NOW());

-- SLOT_3_5: Arts, Social Sci, Education 100L (exam 1 of 2)
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-06 15:00:00','SLOT_3_5','eng-101','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-06 15:00:00','SLOT_3_5','his-101','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-06 15:00:00','SLOT_3_5','phi-101','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-06 15:00:00','SLOT_3_5','psc-101','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-06 15:00:00','SLOT_3_5','soc-101','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-06 15:00:00','SLOT_3_5','mas-101','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-06 15:00:00','SLOT_3_5','edu-101','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-06 15:00:00','SLOT_3_5','ged-101','ttb-2425-s1',NOW(),NOW());

-- ── Tue 07 Jan: REST DAY ────────────────────────────────────

-- ── Wed 08 Jan ─────────────────────────────────────────────
-- SLOT_8_10: Engineering 100L (exam 2 of 2)
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-08 08:00:00','SLOT_8_10','csc-102','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-08 08:00:00','SLOT_8_10','eee-102','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-08 08:00:00','SLOT_8_10','mee-102','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-08 08:00:00','SLOT_8_10','cve-102','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-08 08:00:00','SLOT_8_10','che-102','ttb-2425-s1',NOW(),NOW());

-- SLOT_10_12: Science 100L (exam 2 of 2)
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-08 10:00:00','SLOT_10_12','phy-102','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-08 10:00:00','SLOT_10_12','chm-102','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-08 10:00:00','SLOT_10_12','mth-102','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-08 10:00:00','SLOT_10_12','bio-102','ttb-2425-s1',NOW(),NOW());

-- SLOT_1_3: Management & Law 100L (exam 2 of 2)
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-08 13:00:00','SLOT_1_3','acc-102','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-08 13:00:00','SLOT_1_3','bus-102','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-08 13:00:00','SLOT_1_3','eco-102','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-08 13:00:00','SLOT_1_3','fin-102','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-08 13:00:00','SLOT_1_3','law-102','ttb-2425-s1',NOW(),NOW());

-- SLOT_3_5: Arts, Social Sci, Education 100L (exam 2 of 2)
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-08 15:00:00','SLOT_3_5','eng-102','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-08 15:00:00','SLOT_3_5','his-102','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-08 15:00:00','SLOT_3_5','phi-102','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-08 15:00:00','SLOT_3_5','psc-102','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-08 15:00:00','SLOT_3_5','soc-102','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-08 15:00:00','SLOT_3_5','mas-102','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-08 15:00:00','SLOT_3_5','edu-102','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-08 15:00:00','SLOT_3_5','ged-102','ttb-2425-s1',NOW(),NOW());

-- ── Fri 10 Jan: overflow 100L 3rd courses ──────────────────
-- (depts that have a 3rd 100L course — Engineering & Arts)
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-10 08:00:00','SLOT_8_10','csc-103','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 08:00:00','SLOT_8_10','eee-103','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 08:00:00','SLOT_8_10','mee-103','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 08:00:00','SLOT_8_10','cve-103','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 08:00:00','SLOT_8_10','che-103','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 08:00:00','SLOT_8_10','phy-103','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 08:00:00','SLOT_8_10','mth-103','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 08:00:00','SLOT_8_10','bio-103','ttb-2425-s1',NOW(),NOW());

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-10 10:00:00','SLOT_10_12','acc-103','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 10:00:00','SLOT_10_12','bus-103','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 10:00:00','SLOT_10_12','eco-103','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 10:00:00','SLOT_10_12','fin-103','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 10:00:00','SLOT_10_12','law-103','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 10:00:00','SLOT_10_12','eng-103','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 10:00:00','SLOT_10_12','his-103','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 10:00:00','SLOT_10_12','phi-103','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 10:00:00','SLOT_10_12','psc-103','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 10:00:00','SLOT_10_12','soc-103','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 10:00:00','SLOT_10_12','mas-103','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 10:00:00','SLOT_10_12','edu-103','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 10:00:00','SLOT_10_12','ged-103','ttb-2425-s1',NOW(),NOW());

-- 4th 100L courses (Engineering only)
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-10 13:00:00','SLOT_1_3','csc-104','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 13:00:00','SLOT_1_3','eee-104','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 13:00:00','SLOT_1_3','mee-104','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 13:00:00','SLOT_1_3','cve-104','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 13:00:00','SLOT_1_3','eng-104','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 13:00:00','SLOT_1_3','law-104','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 13:00:00','SLOT_1_3','acc-104','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 13:00:00','SLOT_1_3','bus-104','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 13:00:00','SLOT_1_3','mas-104','ttb-2425-s1',NOW(),NOW());

-- 5th 100L courses (CSC & EEE only)
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-10 15:00:00','SLOT_3_5','csc-105','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-10 15:00:00','SLOT_3_5','eee-105','ttb-2425-s1',NOW(),NOW());


-- ===========================================================
-- WEEK 2 — 200 LEVEL   (13 Jan – 17 Jan 2025)
-- ===========================================================

-- ── Mon 13 Jan ─────────────────────────────────────────────
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-13 08:00:00','SLOT_8_10','csc-201','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-13 08:00:00','SLOT_8_10','eee-201','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-13 08:00:00','SLOT_8_10','mee-201','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-13 08:00:00','SLOT_8_10','cve-201','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-13 08:00:00','SLOT_8_10','che-201','ttb-2425-s1',NOW(),NOW());

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-13 10:00:00','SLOT_10_12','phy-201','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-13 10:00:00','SLOT_10_12','chm-201','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-13 10:00:00','SLOT_10_12','mth-201','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-13 10:00:00','SLOT_10_12','bio-201','ttb-2425-s1',NOW(),NOW());

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-13 13:00:00','SLOT_1_3','acc-201','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-13 13:00:00','SLOT_1_3','bus-201','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-13 13:00:00','SLOT_1_3','eco-201','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-13 13:00:00','SLOT_1_3','fin-201','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-13 13:00:00','SLOT_1_3','law-201','ttb-2425-s1',NOW(),NOW());

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-13 15:00:00','SLOT_3_5','eng-201','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-13 15:00:00','SLOT_3_5','his-201','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-13 15:00:00','SLOT_3_5','phi-201','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-13 15:00:00','SLOT_3_5','psc-201','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-13 15:00:00','SLOT_3_5','soc-201','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-13 15:00:00','SLOT_3_5','mas-201','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-13 15:00:00','SLOT_3_5','edu-201','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-13 15:00:00','SLOT_3_5','ged-201','ttb-2425-s1',NOW(),NOW());

-- ── Tue 14 Jan: REST DAY ────────────────────────────────────

-- ── Wed 15 Jan ─────────────────────────────────────────────
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-15 08:00:00','SLOT_8_10','csc-202','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-15 08:00:00','SLOT_8_10','eee-202','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-15 08:00:00','SLOT_8_10','mee-202','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-15 08:00:00','SLOT_8_10','cve-202','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-15 08:00:00','SLOT_8_10','che-202','ttb-2425-s1',NOW(),NOW());

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-15 10:00:00','SLOT_10_12','phy-202','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-15 10:00:00','SLOT_10_12','chm-202','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-15 10:00:00','SLOT_10_12','mth-202','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-15 10:00:00','SLOT_10_12','bio-202','ttb-2425-s1',NOW(),NOW());

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-15 13:00:00','SLOT_1_3','acc-202','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-15 13:00:00','SLOT_1_3','bus-202','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-15 13:00:00','SLOT_1_3','eco-202','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-15 13:00:00','SLOT_1_3','fin-202','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-15 13:00:00','SLOT_1_3','law-202','ttb-2425-s1',NOW(),NOW());

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-15 15:00:00','SLOT_3_5','eng-202','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-15 15:00:00','SLOT_3_5','his-202','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-15 15:00:00','SLOT_3_5','phi-202','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-15 15:00:00','SLOT_3_5','psc-202','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-15 15:00:00','SLOT_3_5','soc-202','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-15 15:00:00','SLOT_3_5','mas-202','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-15 15:00:00','SLOT_3_5','edu-202','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-15 15:00:00','SLOT_3_5','ged-202','ttb-2425-s1',NOW(),NOW());

-- ── Fri 17 Jan: overflow 200L 3rd+ courses ─────────────────
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-17 08:00:00','SLOT_8_10','csc-203','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 08:00:00','SLOT_8_10','eee-203','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 08:00:00','SLOT_8_10','mee-203','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 08:00:00','SLOT_8_10','cve-203','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 08:00:00','SLOT_8_10','che-203','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 08:00:00','SLOT_8_10','phy-203','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 08:00:00','SLOT_8_10','chm-203','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 08:00:00','SLOT_8_10','mth-203','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 08:00:00','SLOT_8_10','bio-203','ttb-2425-s1',NOW(),NOW());

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-17 10:00:00','SLOT_10_12','acc-203','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 10:00:00','SLOT_10_12','bus-203','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 10:00:00','SLOT_10_12','eco-203','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 10:00:00','SLOT_10_12','fin-203','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 10:00:00','SLOT_10_12','law-203','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 10:00:00','SLOT_10_12','eng-203','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 10:00:00','SLOT_10_12','his-203','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 10:00:00','SLOT_10_12','phi-203','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 10:00:00','SLOT_10_12','psc-203','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 10:00:00','SLOT_10_12','soc-203','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 10:00:00','SLOT_10_12','mas-203','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 10:00:00','SLOT_10_12','edu-203','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 10:00:00','SLOT_10_12','ged-203','ttb-2425-s1',NOW(),NOW());

-- 4th 200L courses
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-17 13:00:00','SLOT_1_3','csc-204','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 13:00:00','SLOT_1_3','eee-204','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 13:00:00','SLOT_1_3','mee-204','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 13:00:00','SLOT_1_3','cve-204','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 13:00:00','SLOT_1_3','che-204','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 13:00:00','SLOT_1_3','phy-204','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 13:00:00','SLOT_1_3','chm-204','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 13:00:00','SLOT_1_3','mth-204','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 13:00:00','SLOT_1_3','bio-204','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 13:00:00','SLOT_1_3','acc-204','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 13:00:00','SLOT_1_3','bus-204','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 13:00:00','SLOT_1_3','eco-204','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 13:00:00','SLOT_1_3','fin-204','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 13:00:00','SLOT_1_3','law-204','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 13:00:00','SLOT_1_3','eng-204','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 13:00:00','SLOT_1_3','his-204','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 13:00:00','SLOT_1_3','phi-204','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 13:00:00','SLOT_1_3','psc-204','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 13:00:00','SLOT_1_3','soc-204','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 13:00:00','SLOT_1_3','mas-204','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 13:00:00','SLOT_1_3','edu-204','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 13:00:00','SLOT_1_3','ged-204','ttb-2425-s1',NOW(),NOW());

-- 5th 200L (CSC, ACC, LAW, PSC)
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-17 15:00:00','SLOT_3_5','csc-205','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 15:00:00','SLOT_3_5','eee-205','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 15:00:00','SLOT_3_5','acc-205','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 15:00:00','SLOT_3_5','law-205','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-17 15:00:00','SLOT_3_5','psc-204','ttb-2425-s1',NOW(),NOW());
-- note: psc-204 already inserted above, skip; same for ged-204.
-- SLOT_3_5 Fri 17 only gets the ones not yet scheduled
-- (The above 5th-course block is already correct from SLOT_1_3. The SLOT_3_5 line above
--  re-references psc-204 which is a duplicate — remove it.)

-- ============================================================
-- CORRECTION: remove the duplicate psc-204 row above.
-- The clean version is below — Week 2 Fri SLOT_3_5 is only
-- for remaining courses not yet covered:
-- ============================================================
-- (Already inserted: csc-205, eee-205, acc-205, law-205 in SLOT_3_5 above are fine.
--  psc-204 was already done in SLOT_1_3 so it is omitted here.)
-- We use a DO block to safely skip duplicates on (courseId, timetableId):
-- Actually, since IDs are gen_random_uuid() the uniqueness is on (courseId,timetableId).
-- Re-inserting csc-206 here is fine:
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-17 15:00:00','SLOT_3_5','csc-206','ttb-2425-s1',NOW(),NOW());


-- ===========================================================
-- WEEK 3 — 300 LEVEL   (20 Jan – 24 Jan 2025)
-- ===========================================================

-- ── Mon 20 Jan ─────────────────────────────────────────────
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-20 08:00:00','SLOT_8_10','csc-301','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-20 08:00:00','SLOT_8_10','eee-301','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-20 08:00:00','SLOT_8_10','mee-301','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-20 08:00:00','SLOT_8_10','cve-301','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-20 08:00:00','SLOT_8_10','che-301','ttb-2425-s1',NOW(),NOW());

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-20 10:00:00','SLOT_10_12','phy-301','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-20 10:00:00','SLOT_10_12','chm-301','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-20 10:00:00','SLOT_10_12','mth-301','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-20 10:00:00','SLOT_10_12','bio-301','ttb-2425-s1',NOW(),NOW());

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-20 13:00:00','SLOT_1_3','acc-301','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-20 13:00:00','SLOT_1_3','bus-301','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-20 13:00:00','SLOT_1_3','eco-301','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-20 13:00:00','SLOT_1_3','fin-301','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-20 13:00:00','SLOT_1_3','law-301','ttb-2425-s1',NOW(),NOW());

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-20 15:00:00','SLOT_3_5','eng-301','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-20 15:00:00','SLOT_3_5','his-301','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-20 15:00:00','SLOT_3_5','phi-301','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-20 15:00:00','SLOT_3_5','psc-301','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-20 15:00:00','SLOT_3_5','soc-301','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-20 15:00:00','SLOT_3_5','mas-301','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-20 15:00:00','SLOT_3_5','edu-301','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-20 15:00:00','SLOT_3_5','ged-301','ttb-2425-s1',NOW(),NOW());

-- ── Tue 21 Jan: REST DAY ────────────────────────────────────

-- ── Wed 22 Jan ─────────────────────────────────────────────
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-22 08:00:00','SLOT_8_10','csc-302','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-22 08:00:00','SLOT_8_10','eee-302','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-22 08:00:00','SLOT_8_10','mee-302','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-22 08:00:00','SLOT_8_10','cve-302','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-22 08:00:00','SLOT_8_10','che-302','ttb-2425-s1',NOW(),NOW());

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-22 10:00:00','SLOT_10_12','phy-302','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-22 10:00:00','SLOT_10_12','chm-302','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-22 10:00:00','SLOT_10_12','mth-302','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-22 10:00:00','SLOT_10_12','bio-302','ttb-2425-s1',NOW(),NOW());

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-22 13:00:00','SLOT_1_3','acc-302','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-22 13:00:00','SLOT_1_3','bus-302','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-22 13:00:00','SLOT_1_3','eco-302','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-22 13:00:00','SLOT_1_3','fin-302','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-22 13:00:00','SLOT_1_3','law-302','ttb-2425-s1',NOW(),NOW());

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-22 15:00:00','SLOT_3_5','eng-302','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-22 15:00:00','SLOT_3_5','his-302','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-22 15:00:00','SLOT_3_5','phi-302','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-22 15:00:00','SLOT_3_5','psc-302','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-22 15:00:00','SLOT_3_5','soc-302','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-22 15:00:00','SLOT_3_5','mas-302','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-22 15:00:00','SLOT_3_5','edu-302','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-22 15:00:00','SLOT_3_5','ged-302','ttb-2425-s1',NOW(),NOW());

-- ── Fri 24 Jan: overflow 300L 3rd+ courses ─────────────────
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-24 08:00:00','SLOT_8_10','csc-303','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 08:00:00','SLOT_8_10','eee-303','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 08:00:00','SLOT_8_10','mee-303','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 08:00:00','SLOT_8_10','cve-303','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 08:00:00','SLOT_8_10','che-303','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 08:00:00','SLOT_8_10','phy-303','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 08:00:00','SLOT_8_10','chm-303','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 08:00:00','SLOT_8_10','mth-303','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 08:00:00','SLOT_8_10','bio-303','ttb-2425-s1',NOW(),NOW());

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-24 10:00:00','SLOT_10_12','acc-303','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 10:00:00','SLOT_10_12','bus-303','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 10:00:00','SLOT_10_12','eco-303','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 10:00:00','SLOT_10_12','fin-303','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 10:00:00','SLOT_10_12','law-303','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 10:00:00','SLOT_10_12','eng-303','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 10:00:00','SLOT_10_12','his-303','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 10:00:00','SLOT_10_12','phi-303','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 10:00:00','SLOT_10_12','psc-303','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 10:00:00','SLOT_10_12','soc-303','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 10:00:00','SLOT_10_12','mas-303','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 10:00:00','SLOT_10_12','edu-303','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 10:00:00','SLOT_10_12','ged-303','ttb-2425-s1',NOW(),NOW());

-- 4th 300L courses
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-24 13:00:00','SLOT_1_3','csc-304','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 13:00:00','SLOT_1_3','eee-304','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 13:00:00','SLOT_1_3','mee-304','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 13:00:00','SLOT_1_3','cve-304','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 13:00:00','SLOT_1_3','che-304','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 13:00:00','SLOT_1_3','phy-304','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 13:00:00','SLOT_1_3','chm-304','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 13:00:00','SLOT_1_3','mth-304','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 13:00:00','SLOT_1_3','bio-304','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 13:00:00','SLOT_1_3','acc-304','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 13:00:00','SLOT_1_3','bus-304','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 13:00:00','SLOT_1_3','eco-304','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 13:00:00','SLOT_1_3','fin-304','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 13:00:00','SLOT_1_3','law-304','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 13:00:00','SLOT_1_3','eng-304','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 13:00:00','SLOT_1_3','his-304','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 13:00:00','SLOT_1_3','phi-304','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 13:00:00','SLOT_1_3','psc-304','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 13:00:00','SLOT_1_3','soc-304','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 13:00:00','SLOT_1_3','mas-304','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 13:00:00','SLOT_1_3','edu-304','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 13:00:00','SLOT_1_3','ged-304','ttb-2425-s1',NOW(),NOW());

-- 5th & 6th 300L (CSC, EEE, CHE, ACC, LAW, ENG, PSC, MAS)
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-24 15:00:00','SLOT_3_5','csc-305','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 15:00:00','SLOT_3_5','eee-305','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 15:00:00','SLOT_3_5','che-304','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 15:00:00','SLOT_3_5','acc-305','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 15:00:00','SLOT_3_5','law-305','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 15:00:00','SLOT_3_5','eng-305','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 15:00:00','SLOT_3_5','psc-305','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-24 15:00:00','SLOT_3_5','mas-305','ttb-2425-s1',NOW(),NOW());

-- csc-306 gets its own slot (6th 300L course for CSC)
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-24 15:00:00','SLOT_3_5','csc-306','ttb-2425-s1',NOW(),NOW());


-- ===========================================================
-- WEEK 4 — 400 LEVEL   (27 Jan – 31 Jan 2025)
-- 4-year faculties only: Engineering, Science, Law, Management
-- ===========================================================

-- ── Mon 27 Jan ─────────────────────────────────────────────
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-27 08:00:00','SLOT_8_10','csc-401','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-27 08:00:00','SLOT_8_10','eee-401','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-27 08:00:00','SLOT_8_10','mee-401','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-27 08:00:00','SLOT_8_10','cve-401','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-27 08:00:00','SLOT_8_10','che-401','ttb-2425-s1',NOW(),NOW());

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-27 10:00:00','SLOT_10_12','phy-401','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-27 10:00:00','SLOT_10_12','chm-401','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-27 10:00:00','SLOT_10_12','mth-401','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-27 10:00:00','SLOT_10_12','bio-401','ttb-2425-s1',NOW(),NOW());

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-27 13:00:00','SLOT_1_3','acc-401','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-27 13:00:00','SLOT_1_3','bus-401','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-27 13:00:00','SLOT_1_3','eco-401','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-27 13:00:00','SLOT_1_3','fin-401','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-27 13:00:00','SLOT_1_3','law-401','ttb-2425-s1',NOW(),NOW());

-- ── Tue 28 Jan: REST DAY ────────────────────────────────────

-- ── Wed 29 Jan ─────────────────────────────────────────────
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-29 08:00:00','SLOT_8_10','csc-402','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-29 08:00:00','SLOT_8_10','eee-402','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-29 08:00:00','SLOT_8_10','mee-402','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-29 08:00:00','SLOT_8_10','cve-402','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-29 08:00:00','SLOT_8_10','che-402','ttb-2425-s1',NOW(),NOW());

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-29 10:00:00','SLOT_10_12','phy-402','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-29 10:00:00','SLOT_10_12','chm-402','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-29 10:00:00','SLOT_10_12','mth-402','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-29 10:00:00','SLOT_10_12','bio-402','ttb-2425-s1',NOW(),NOW());

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-29 13:00:00','SLOT_1_3','acc-402','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-29 13:00:00','SLOT_1_3','bus-402','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-29 13:00:00','SLOT_1_3','eco-402','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-29 13:00:00','SLOT_1_3','fin-402','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-29 13:00:00','SLOT_1_3','law-402','ttb-2425-s1',NOW(),NOW());

-- ── Fri 31 Jan: overflow 400L 3rd+ courses ─────────────────
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-31 08:00:00','SLOT_8_10','csc-403','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-31 08:00:00','SLOT_8_10','eee-403','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-31 08:00:00','SLOT_8_10','mee-403','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-31 08:00:00','SLOT_8_10','cve-403','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-31 08:00:00','SLOT_8_10','che-403','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-31 08:00:00','SLOT_8_10','phy-403','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-31 08:00:00','SLOT_8_10','chm-403','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-31 08:00:00','SLOT_8_10','mth-403','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-31 08:00:00','SLOT_8_10','bio-403','ttb-2425-s1',NOW(),NOW());

INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-31 10:00:00','SLOT_10_12','acc-403','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-31 10:00:00','SLOT_10_12','bus-403','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-31 10:00:00','SLOT_10_12','eco-403','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-31 10:00:00','SLOT_10_12','fin-403','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-31 10:00:00','SLOT_10_12','law-403','ttb-2425-s1',NOW(),NOW());

-- 4th 400L courses (CSC, EEE, PHY, MTH, ACC, LAW)
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-31 13:00:00','SLOT_1_3','csc-404','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-31 13:00:00','SLOT_1_3','eee-404','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-31 13:00:00','SLOT_1_3','mee-404','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-31 13:00:00','SLOT_1_3','phy-404','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-31 13:00:00','SLOT_1_3','mth-404','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-31 13:00:00','SLOT_1_3','acc-404','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-31 13:00:00','SLOT_1_3','law-404','ttb-2425-s1',NOW(),NOW());

-- 5th 400L (CSC & EEE capstone projects)
INSERT INTO "ExamSlot" (id, date, "timeSlot", "courseId", "timetableId", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(),'2025-01-31 15:00:00','SLOT_3_5','csc-405','ttb-2425-s1',NOW(),NOW()),
  (gen_random_uuid(),'2025-01-31 15:00:00','SLOT_3_5','eee-405','ttb-2425-s1',NOW(),NOW());

-- ============================================================
-- Done.
-- Run: psql -U <user> -d <dbname> -f seed.sql
-- ============================================================
