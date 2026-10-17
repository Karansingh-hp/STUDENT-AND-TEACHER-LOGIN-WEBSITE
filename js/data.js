/* ============================================================
   DATA.JS - All application data
   ============================================================ */

const DATA = {
  institute: {
    name: 'Westfield',
    fullName: 'Westfield Institute of Technology',
    tagline: 'Institute of Technology'
  },
    // 🔥 Saare registered students ka database
  allStudents: [
    {
      id: 'STU2025001', firstName: 'Alex', lastName: 'Smith', email: 'alex.smith@westfield.edu',
      phone: '+1 (555) 123-4567', dob: '15 March 2005', address: '42 University Ave, Westfield, CA',
      program: 'B.Tech Computer Science', year: '2nd Year (Semester 4)', advisor: 'Prof. R. Mehta',
      gpa: 3.78, attendance: 94, credits: 6, initials: 'AS'
    },
    {
      id: 'STU2025002', firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@westfield.edu',
      phone: '+1 (555) 987-6543', dob: '20 Aug 2004', address: '15 Park Street, Westfield, CA',
      program: 'B.Tech Computer Science', year: '2nd Year (Semester 4)', advisor: 'Prof. R. Mehta',
      gpa: 3.9, attendance: 97, credits: 6, initials: 'PS'
    },
    {
      id: 'STU2025003', firstName: 'Marcus', lastName: 'Johnson', email: 'marcus.j@westfield.edu',
      phone: '+1 (555) 456-7890', dob: '10 Jan 2005', address: '88 Oak Lane, Westfield, CA',
      program: 'B.Tech Computer Science', year: '2nd Year (Semester 4)', advisor: 'Prof. R. Mehta',
      gpa: 3.5, attendance: 88, credits: 6, initials: 'MJ'
    }
  ],

  student: {
    id: 'STU2025001',
    firstName: 'Alex',
    lastName: 'Smith',
    email: 'alex.smith@westfield.edu',
    phone: '+1 (555) 123-4567',
    dob: '15 March 2005',
    address: '42 University Ave, Westfield, CA 90210',
    program: 'B.Tech Computer Science',
    year: '2nd Year (Semester 4)',
    advisor: 'Prof. R. Mehta',
    gpa: 3.78,
    attendance: 94,
    credits: 6,
    initials: 'AS',
    enrollmentDate: 'Aug 2023',
    expectedGraduation: 'May 2027'
  },

  teacher: {
    id: 'TCH1001',
    firstName: 'Rajesh',
    lastName: 'Mehta',
    email: 'r.mehta@westfield.edu',
    phone: '+1 (555) 987-6543',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    specialization: 'Algorithms, Data Structures, Machine Learning',
    office: 'Block A, Room 312',
    officeHours: 'Mon/Wed 2:00-4:00 PM',
    experience: '12 years',
    initials: 'RM',
    courses: ['cs201', 'cs305'],
    totalStudents: 85,
    joinDate: 'Aug 2013',
    qualification: 'Ph.D. Computer Science, IIT Bombay'
  },

  stats: [
    { id: 'courses', label: 'Enrolled Courses', value: 6, icon: 'fa-book', color: 'blue', change: 'Active this semester', changeIcon: 'fa-check-circle', route: 'courses.html' },
    { id: 'gpa', label: 'Current GPA', value: 3.78, icon: 'fa-chart-line', color: 'green', change: '+0.12 from last term', changeIcon: 'fa-arrow-up', route: 'grades.html' },
    { id: 'assignments', label: 'Assignments Due', value: 4, icon: 'fa-tasks', color: 'orange', change: 'Next: Data Structures', changeIcon: 'fa-clock', route: 'assignments.html' },
    { id: 'attendance', label: 'Attendance', value: '94%', icon: 'fa-calendar-alt', color: 'purple', change: 'Excellent standing', changeIcon: 'fa-check-circle', route: 'timetable.html' },
    { id: 'credits', label: 'Total Credits', value: 72, icon: 'fa-award', color: 'teal', change: '48 remaining for degree', changeIcon: 'fa-info-circle', route: 'grades.html' },
    { id: 'library', label: 'Library Books', value: 3, icon: 'fa-bookmark', color: 'red', change: '1 due this week', changeIcon: 'fa-exclamation-triangle', route: 'library.html' }
  ],

  teacherStats: [
    { id: 'courses', label: 'Active Courses', value: 2, icon: 'fa-chalkboard-teacher', color: 'purple', change: 'Spring 2025 semester', changeIcon: 'fa-check-circle', route: 'teacher-courses.html' },
    { id: 'students', label: 'Total Students', value: 85, icon: 'fa-users', color: 'blue', change: 'Across all courses', changeIcon: 'fa-info-circle', route: 'teacher-students.html' },
    { id: 'assignments', label: 'Pending Grading', value: 23, icon: 'fa-file-signature', color: 'orange', change: 'Needs attention', changeIcon: 'fa-clock', route: 'teacher-assignments.html' },
    { id: 'attendance', label: 'Avg Attendance', value: '91%', icon: 'fa-user-check', color: 'green', change: 'This week', changeIcon: 'fa-arrow-up', route: 'teacher-attendance.html' }
  ],

  schedule: [
    { time: '09:00 AM', course: 'Data Structures & Algorithms', instructor: 'Prof. R. Mehta', room: 'Room 402' },
    { time: '11:00 AM', course: 'Linear Algebra', instructor: 'Dr. S. Kapoor', room: 'Room 201' },
    { time: '01:30 PM', course: 'Physics Lab', instructor: 'Prof. A. Nair', room: 'Lab 3' },
    { time: '03:30 PM', course: 'Technical Writing', instructor: 'Dr. M. Fernandes', room: 'Room 105' }
  ],

  announcements: [
    { title: '📢 Mid-term exam schedule released', body: 'Check the examination portal for your exact dates and room allocations.', date: '2 hours ago' },
    { title: '📚 Library extended hours', body: 'The central library will remain open until 10 PM during exam weeks.', date: 'Yesterday' },
    { title: '🏆 Hackathon registration open', body: 'Register your team for the annual Westfield Hackathon by Friday.', date: '2 days ago' },
    { title: '💼 Career fair next Thursday', body: 'Over 40 companies will be on campus. Update your resume now!', date: '3 days ago' }
  ],

  courses: [
        {
      id: 'cs201', code: 'CS 201', title: 'Data Structures & Algorithms',
      description: 'Master arrays, linked lists, trees, graphs, and algorithm design techniques.',
      longDescription: 'This comprehensive course provides an in-depth study of data structures and algorithms.',
      instructor: 'Prof. R. Mehta', instructorEmail: 'r.mehta@westfield.edu',
      instructorOffice: 'Block A, Room 312', instructorHours: 'Mon/Wed 2:00-4:00 PM',
      credits: 4, progress: 72, theme: 'cs', icon: 'fa-code', grade: 'A-',
      schedule: 'Mon/Wed 9:00-10:30', semester: 'Spring 2025',
      enrolled: 45, rating: 4.8,
      modules: [
        { id: 'm1', title: 'Module 1: Foundations & Complexity', description: 'Introduction to algorithms', completed: true, lessons: [
          { id: 'l1', title: 'Introduction to Algorithms', type: 'video', duration: '18 min', completed: true },
          { id: 'l2', title: 'Big-O Notation', type: 'reading', duration: '12 min', completed: true }
        ]},
        { id: 'm2', title: 'Module 2: Arrays & Linked Lists', description: 'Linear data structures', completed: true, lessons: [
          { id: 'l3', title: 'Arrays', type: 'video', duration: '25 min', completed: true },
          { id: 'l4', title: 'Linked Lists', type: 'video', duration: '30 min', completed: true }
        ]},
        { id: 'm3', title: 'Module 3: Trees & Graphs', description: 'Hierarchical structures', completed: false, lessons: [
          { id: 'l5', title: 'Binary Trees', type: 'video', duration: '28 min', completed: false },
          { id: 'l6', title: 'Graph Algorithms', type: 'video', duration: '24 min', completed: false }
        ]}
      ],
      resources: [
        { name: 'Course Syllabus', type: 'pdf', size: '2.4 MB', icon: 'fa-file-pdf' },
        { name: 'Lecture Slides', type: 'slide', size: '8.1 MB', icon: 'fa-file-powerpoint' },
        { name: 'Starter Code', type: 'zip', size: '1.2 MB', icon: 'fa-file-archive' }
      ],
      students: [
        { id: 'STU2025001', name: 'Alex Smith', grade: 'A-', attendance: 94 },
        { id: 'STU2025002', name: 'Priya Sharma', grade: 'A', attendance: 97 }
      ]
    },
    {
      id: 'math301', code: 'MATH 301', title: 'Linear Algebra',
      description: 'Vector spaces, linear transformations, matrices, eigenvalues.',
      longDescription: 'This course develops the theory and computational techniques of linear algebra.',
      instructor: 'Dr. S. Kapoor', instructorEmail: 's.kapoor@westfield.edu',
      instructorOffice: 'Block B, Room 205', instructorHours: 'Tue/Thu 1:00-3:00 PM',
      credits: 3, progress: 65, theme: 'math', icon: 'fa-square-root-alt', grade: 'B+',
      schedule: 'Tue/Thu 11:00-12:30', semester: 'Spring 2025',
      enrolled: 38, rating: 4.5,
      modules: [
        { id: 'm1', title: 'Module 1: Linear Systems', description: 'Gaussian elimination', completed: true, lessons: [
          { id: 'l1', title: 'Introduction', type: 'video', duration: '20 min', completed: true },
          { id: 'l2', title: 'Gaussian Elimination', type: 'video', duration: '25 min', completed: true }
        ]}
      ],
      resources: [
        { name: 'Syllabus', type: 'pdf', size: '1.8 MB', icon: 'fa-file-pdf' }
      ],
      students: [
        { id: 'STU2025001', name: 'Alex Smith', grade: 'B+', attendance: 94 }
      ]
    },
    {
      id: 'phy202', code: 'PHY 202', title: 'Modern Physics',
      description: 'Quantum mechanics, relativity, atomic structure.',
      longDescription: 'This course introduces fundamental concepts of modern physics.',
      instructor: 'Prof. A. Nair', instructorEmail: 'a.nair@westfield.edu',
      instructorOffice: 'Block C, Room 410', instructorHours: 'Mon/Fri 10:00-12:00 PM',
      credits: 4, progress: 58, theme: 'phy', icon: 'fa-atom', grade: 'B',
      schedule: 'Mon/Wed/Fri 1:30-2:30', semester: 'Spring 2025',
      enrolled: 32, rating: 4.6,
      modules: [], resources: [],
      students: [{ id: 'STU2025001', name: 'Alex Smith', grade: 'B', attendance: 94 }]
    },
    {
      id: 'eng105', code: 'ENG 105', title: 'Technical Writing',
      description: 'Professional communication, report writing, documentation.',
      longDescription: 'This course develops written and oral communication skills.',
      instructor: 'Dr. M. Fernandes', instructorEmail: 'm.fernandes@westfield.edu',
      instructorOffice: 'Block D, Room 108', instructorHours: 'Tue/Thu 4:30-6:00 PM',
      credits: 2, progress: 88, theme: 'eng', icon: 'fa-pen-fancy', grade: 'A',
      schedule: 'Tue/Thu 3:30-4:30', semester: 'Spring 2025',
      enrolled: 28, rating: 4.9,
      modules: [], resources: [],
      students: [{ id: 'STU2025001', name: 'Alex Smith', grade: 'A', attendance: 94 }]
    },
        {
      id: 'cs305', code: 'CS 305', title: 'Database Management Systems',
      description: 'Relational databases, SQL, normalization, transactions.',
      longDescription: 'This course covers database design, implementation, and management.',
      instructor: 'Prof. K. Iyer', instructorEmail: 'k.iyer@westfield.edu',
      instructorOffice: 'Block A, Room 315', instructorHours: 'Mon/Wed 4:00-6:00 PM',
      credits: 4, progress: 45, theme: 'cs', icon: 'fa-database', grade: 'B+',
      schedule: 'Mon/Wed 2:00-3:30', semester: 'Spring 2025',
      enrolled: 40, rating: 4.4,
      modules: [
        { id: 'm1', title: 'Module 1: SQL Basics', description: 'Introduction to databases', completed: true, lessons: [
          { id: 'l1', title: 'Relational Model', type: 'video', duration: '20 min', completed: true },
          { id: 'l2', title: 'Basic SQL Queries', type: 'reading', duration: '15 min', completed: true }
        ]},
        { id: 'm2', title: 'Module 2: Normalization', description: 'Database design', completed: false, lessons: [
          { id: 'l3', title: '1NF, 2NF, 3NF', type: 'video', duration: '25 min', completed: false }
        ]}
      ],
      resources: [
        { name: 'Database Syllabus', type: 'pdf', size: '1.8 MB', icon: 'fa-file-pdf' },
        { name: 'SQL Cheat Sheet', type: 'pdf', size: '500 KB', icon: 'fa-file-pdf' }
      ],
      students: [
        { id: 'STU2025001', name: 'Alex Smith', grade: 'B+', attendance: 94 }
      ]
    },
    {
      id: 'stat210', code: 'STAT 210', title: 'Probability & Statistics',
      description: 'Probability theory, distributions, hypothesis testing.',
      longDescription: 'Comprehensive introduction to probability theory.',
      instructor: 'Dr. P. Desai', instructorEmail: 'p.desai@westfield.edu',
      instructorOffice: 'Block B, Room 210', instructorHours: 'Tue/Fri 1:00-3:00 PM',
      credits: 3, progress: 60, theme: 'math', icon: 'fa-chart-pie', grade: 'A-',
      schedule: 'Tue/Fri 10:00-11:30', semester: 'Spring 2025',
      enrolled: 35, rating: 4.7,
      modules: [], resources: [],
      students: [{ id: 'STU2025001', name: 'Alex Smith', grade: 'A-', attendance: 94 }]
    }
  ],

  assignments: [],

  grades: [
    { course: 'CS 201', title: 'Data Structures & Algorithms', credits: 4, midterm: 88, final: '—', grade: 'A-', points: 3.7 },
    { course: 'MATH 301', title: 'Linear Algebra', credits: 3, midterm: 82, final: '—', grade: 'B+', points: 3.3 },
    { course: 'PHY 202', title: 'Modern Physics', credits: 4, midterm: 79, final: '—', grade: 'B', points: 3.0 },
    { course: 'ENG 105', title: 'Technical Writing', credits: 2, midterm: 94, final: '—', grade: 'A', points: 4.0 },
    { course: 'CS 305', title: 'Database Management Systems', credits: 4, midterm: 85, final: '—', grade: 'B+', points: 3.3 },
    { course: 'STAT 210', title: 'Probability & Statistics', credits: 3, midterm: 90, final: '—', grade: 'A-', points: 3.7 }
  ],

  timetable: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    slots: [
      { time: '09:00 - 10:30', mon: { course: 'CS 201', room: '402', type: 'cs' }, tue: null, wed: { course: 'CS 201', room: '402', type: 'cs' }, thu: null, fri: null },
      { time: '10:00 - 11:30', mon: null, tue: { course: 'STAT 210', room: '205', type: 'math' }, wed: null, thu: null, fri: { course: 'STAT 210', room: '205', type: 'math' } },
      { time: '11:00 - 12:30', mon: null, tue: { course: 'MATH 301', room: '201', type: 'math' }, wed: null, thu: { course: 'MATH 301', room: '201', type: 'math' }, fri: null },
      { time: '01:30 - 02:30', mon: { course: 'PHY 202', room: '301', type: 'phy' }, tue: null, wed: { course: 'PHY 202', room: '301', type: 'phy' }, thu: null, fri: { course: 'PHY 202', room: '301', type: 'phy' } },
      { time: '02:00 - 03:30', mon: { course: 'CS 305', room: '403', type: 'cs' }, tue: null, wed: { course: 'CS 305', room: '403', type: 'cs' }, thu: null, fri: null },
      { time: '03:30 - 04:30', mon: null, tue: { course: 'ENG 105', room: '105', type: 'eng' }, wed: null, thu: { course: 'ENG 105', room: '105', type: 'eng' }, fri: null }
    ]
  },

  libraryBooks: [
    { title: 'Introduction to Algorithms', author: 'Cormen, Leiserson', cover: 'c1', icon: 'fa-code', available: true, category: 'CS', year: 2022, copies: '3/5' },
    { title: 'Linear Algebra Done Right', author: 'Sheldon Axler', cover: 'c2', icon: 'fa-square-root-alt', available: true, category: 'Math', year: 2021, copies: '2/3' },
    { title: 'Quantum Mechanics', author: 'Nouredine Zettili', cover: 'c3', icon: 'fa-atom', available: false, category: 'Physics', year: 2020, copies: '0/2' },
    { title: 'Elements of Style', author: 'Strunk & White', cover: 'c4', icon: 'fa-pen-fancy', available: true, category: 'Writing', year: 2019, copies: '4/4' },
    { title: 'Database System Concepts', author: 'Silberschatz', cover: 'c5', icon: 'fa-database', available: true, category: 'CS', year: 2023, copies: '1/3' }
  ],

  events: [
    { title: 'Annual Tech Hackathon', description: '48-hour coding challenge.', day: '22', month: 'MAR', time: '09:00 AM', location: 'Innovation Center', category: 'Technology' },
    { title: 'Career Fair 2025', description: 'Meet recruiters from top companies.', day: '25', month: 'MAR', time: '10:00 AM', location: 'Main Auditorium', category: 'Career' },
    { title: 'Research Symposium', description: 'Present your research findings.', day: '05', month: 'APR', time: '02:00 PM', location: 'Science Block', category: 'Academic' }
  ],

  messages: [
    { id: 0, name: 'Prof. R. Mehta', role: 'Data Structures Professor', initials: 'RM', unread: 2, messages: [
      { text: 'Hello Alex, discuss project progress?', sender: 'received', time: '10:30 AM' },
      { text: 'Sure Professor, I will share tonight.', sender: 'sent', time: '10:35 AM' }
    ]},
    { id: 1, name: 'Study Group - CS', role: '5 members', initials: 'SG', unread: 5, messages: [
      { text: 'Meet at library 4 PM.', sender: 'received', time: '09:15 AM' }
    ]}
  ],

  teacherMessages: [
    { id: 0, name: 'Alex Smith', role: 'CS 201 Student', initials: 'AS', unread: 1, messages: [
      { text: 'Good morning Professor, I have a question.', sender: 'received', time: '9:15 AM' }
    ]}
  ],

  teacherAssignments: [],
  teacherCourses: [],
  teacherMaterials: [
    { id: 1, title: 'Lecture Slides - Module 1', type: 'slide', size: '8.1 MB', course: 'CS 201', uploadedAt: 'Mar 01, 2025', downloads: 42 },
    { id: 2, title: 'BST Starter Code', type: 'zip', size: '1.2 MB', course: 'CS 201', uploadedAt: 'Mar 05, 2025', downloads: 38 },
    { id: 3, title: 'SQL Dataset', type: 'zip', size: '2.4 MB', course: 'CS 305', uploadedAt: 'Mar 10, 2025', downloads: 40 }
  ],

  teacherAnnouncements: [
    { id: 1, title: '📢 Faculty Meeting Friday', body: 'All CS faculty attend meeting.', date: '1 hour ago', type: 'meeting', course: 'All' },
    { id: 2, title: '📝 Midterm Grading Deadline', body: 'Submit grades by March 28.', date: 'Yesterday', type: 'deadline', course: 'All' }
  ],

  settings: {
    notifications: { email: true, push: true, sms: false, announcements: true, assignments: true, grades: true, events: false, weeklyDigest: true, soundAlerts: true },
    privacy: { showProfile: true, showGrades: false, showEmail: true, showPhone: false, searchable: true, activityStatus: true },
    preferences: { darkMode: false, compactView: false, language: 'English', accentColor: '#c9a961', fontSize: 'medium', animations: true, autoPlay: true },
    security: { twoFactor: false, loginAlerts: true, sessionTimeout: '30' }
  }
};