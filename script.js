/* ============================================================
   WESTFIELD INSTITUTE - SHARED JAVASCRIPT
   ============================================================ */

/* ===== DATA ===== */
/* ===== AUTO-APPLY SETTINGS ON EVERY PAGE ===== */
(function autoInitSettings() {
  try {
    const saved = localStorage.getItem('westfield_settings');
    if (saved) {
      DATA.settings = JSON.parse(saved);
    }
    // Apply dark mode + compact view immediately to avoid flash
    const s = DATA.settings;
    if (s.preferences && s.preferences.darkMode) document.documentElement.classList.add('dark-mode');
    if (s.preferences && s.preferences.compactView) document.documentElement.classList.add('compact-view');
    if (s.preferences && s.preferences.fontSize) {
      const sizes = { small: '14px', medium: '16px', large: '18px' };
      document.documentElement.style.fontSize = sizes[s.preferences.fontSize] || '16px';
    }
    if (s.preferences && s.preferences.accentColor) {
      document.documentElement.style.setProperty('--accent', s.preferences.accentColor);
    }
  } catch(e) { console.warn('Auto-init settings error:', e); }
})();
/* ============================================================
   STORAGE SYSTEM - PERSISTENT DATA MANAGEMENT
   ============================================================ */

const STORAGE_KEYS = {
  TEACHER_ASSIGNMENTS: 'westfield_teacher_assignments',
  TEACHER_COURSES: 'westfield_teacher_courses',
  TEACHER_MATERIALS: 'westfield_teacher_materials',
  TEACHER_ANNOUNCEMENTS: 'westfield_teacher_announcements',
  TEACHER_PROFILE: 'westfield_teacher_profile',
  TEACHER_SUBMISSIONS: 'westfield_teacher_submissions',
  TEACHER_ATTENDANCE: 'westfield_teacher_attendance',
  TEACHER_MESSAGES: 'westfield_teacher_messages',
  STUDENT_ASSIGNMENTS: 'westfield_student_assignments',
  STUDENT_PROFILE: 'westfield_student_profile',
  SETTINGS: 'westfield_settings',
  DATA_VERSION: 'westfield_data_version'
};

/* Current data version — bump this to force refresh of defaults */
const DATA_VERSION = '1.0.0';

/* ===== Storage Helper Functions ===== */
const Storage = {
  /**
   * Save any data to localStorage
   */
  save(key, data) {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(key, serialized);
      console.log(`💾 Saved [${key}] (${(serialized.length / 1024).toFixed(2)} KB)`);
      return true;
    } catch (e) {
      console.error(`❌ Storage save failed for [${key}]:`, e);
      if (e.name === 'QuotaExceededError') {
        showToast('Storage full! Please clear some data.', 'error');
      }
      return false;
    }
  },

  /**
   * Load data from localStorage with fallback
   */
  load(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return defaultValue;
      return JSON.parse(raw);
    } catch (e) {
      console.error(`❌ Storage load failed for [${key}]:`, e);
      return defaultValue;
    }
  },

  /**
   * Remove a key
   */
  remove(key) {
    localStorage.removeItem(key);
  },

  /**
   * Check if key exists
   */
  has(key) {
    return localStorage.getItem(key) !== null;
  },

  /**
   * Clear all Westfield data
   */
  clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },

  /**
   * Get total storage size used (in KB)
   */
  getSize() {
    let total = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const val = localStorage.getItem(key);
      if (val) total += val.length;
    });
    return (total / 1024).toFixed(2);
  }
};
/* ============================================================
   DATA INITIALIZER - LOADS FROM STORAGE OR DEFAULTS
   ============================================================ */

/**
 * Initialize teacher data — load from storage if exists,
 * otherwise use defaults and save them.
 */
function initializeTeacherData() {
  // ---- TEACHER ASSIGNMENTS ----
  const savedAssignments = Storage.load(STORAGE_KEYS.TEACHER_ASSIGNMENTS);
  if (savedAssignments && Array.isArray(savedAssignments) && savedAssignments.length > 0) {
    DATA.teacherAssignments = savedAssignments;
    console.log('✅ Loaded teacher assignments from storage:', savedAssignments.length);
  } else {
    Storage.save(STORAGE_KEYS.TEACHER_ASSIGNMENTS, DATA.teacherAssignments);
    console.log('💾 Saved default teacher assignments');
  }

  // ---- TEACHER COURSES ----
  const savedCourses = Storage.load(STORAGE_KEYS.TEACHER_COURSES);
  if (savedCourses && Array.isArray(savedCourses) && savedCourses.length > 0) {
    DATA.teacherCourses = savedCourses;
    console.log('✅ Loaded teacher courses from storage:', savedCourses.length);
  } else {
    Storage.save(STORAGE_KEYS.TEACHER_COURSES, DATA.teacherCourses);
    console.log('💾 Saved default teacher courses');
  }

  // ---- TEACHER MATERIALS ----
  const savedMaterials = Storage.load(STORAGE_KEYS.TEACHER_MATERIALS);
  if (savedMaterials && Array.isArray(savedMaterials) && savedMaterials.length > 0) {
    DATA.teacherMaterials = savedMaterials;
    console.log('✅ Loaded teacher materials from storage:', savedMaterials.length);
  } else {
    Storage.save(STORAGE_KEYS.TEACHER_MATERIALS, DATA.teacherMaterials);
  }

  // ---- TEACHER ANNOUNCEMENTS ----
  const savedAnnouncements = Storage.load(STORAGE_KEYS.TEACHER_ANNOUNCEMENTS);
  if (savedAnnouncements && Array.isArray(savedAnnouncements) && savedAnnouncements.length > 0) {
    DATA.teacherAnnouncements = savedAnnouncements;
    console.log('✅ Loaded teacher announcements from storage:', savedAnnouncements.length);
  } else {
    Storage.save(STORAGE_KEYS.TEACHER_ANNOUNCEMENTS, DATA.teacherAnnouncements);
  }

  // ---- TEACHER PROFILE ----
  const savedProfile = Storage.load(STORAGE_KEYS.TEACHER_PROFILE);
  if (savedProfile && typeof savedProfile === 'object') {
    DATA.teacher = { ...DATA.teacher, ...savedProfile };
    console.log('✅ Loaded teacher profile from storage');
  } else {
    Storage.save(STORAGE_KEYS.TEACHER_PROFILE, DATA.teacher);
  }

  // ---- TEACHER MESSAGES ----
  const savedMessages = Storage.load(STORAGE_KEYS.TEACHER_MESSAGES);
  if (savedMessages && Array.isArray(savedMessages) && savedMessages.length > 0) {
    DATA.teacherMessages = savedMessages;
  } else {
    Storage.save(STORAGE_KEYS.TEACHER_MESSAGES, DATA.teacherMessages);
  }

  // ---- TEACHER ATTENDANCE ----
  const savedAttendance = Storage.load(STORAGE_KEYS.TEACHER_ATTENDANCE);
  if (savedAttendance && typeof savedAttendance === 'object') {
    window.attendanceToday = savedAttendance;
  }

  console.log('🎓 Teacher data initialization complete');
}

/**
 * Initialize student data
 */
function initializeStudentData() {
  // ---- STUDENT ASSIGNMENTS ----
  const savedAssignments = Storage.load(STORAGE_KEYS.STUDENT_ASSIGNMENTS);
  if (savedAssignments && Array.isArray(savedAssignments) && savedAssignments.length > 0) {
    DATA.assignments = savedAssignments;
    console.log('✅ Loaded student assignments from storage:', savedAssignments.length);
  } else {
    Storage.save(STORAGE_KEYS.STUDENT_ASSIGNMENTS, DATA.assignments);
  }

  // ---- STUDENT PROFILE ----
  const savedProfile = Storage.load(STORAGE_KEYS.STUDENT_PROFILE);
  if (savedProfile && typeof savedProfile === 'object') {
    DATA.student = { ...DATA.student, ...savedProfile };
  } else {
    Storage.save(STORAGE_KEYS.STUDENT_PROFILE, DATA.student);
  }

  console.log('🎓 Student data initialization complete');
}

/**
 * Master initializer — call this at app start
 */
function initializeAllData() {
  initializeTeacherData();
  initializeStudentData();
  console.log(`📦 Storage size: ${Storage.getSize()} KB`);
}

/* ===== Specific Save Functions ===== */
function saveTeacherAssignments() {
  Storage.save(STORAGE_KEYS.TEACHER_ASSIGNMENTS, DATA.teacherAssignments);
}

function saveTeacherCourses() {
  Storage.save(STORAGE_KEYS.TEACHER_COURSES, DATA.teacherCourses);
}

function saveTeacherMaterials() {
  Storage.save(STORAGE_KEYS.TEACHER_MATERIALS, DATA.teacherMaterials);
}

function saveTeacherAnnouncements() {
  Storage.save(STORAGE_KEYS.TEACHER_ANNOUNCEMENTS, DATA.teacherAnnouncements);
}

function saveTeacherProfile() {
  Storage.save(STORAGE_KEYS.TEACHER_PROFILE, DATA.teacher);
}

function saveTeacherMessages() {
  Storage.save(STORAGE_KEYS.TEACHER_MESSAGES, DATA.teacherMessages);
}

function saveTeacherAttendance() {
  Storage.save(STORAGE_KEYS.TEACHER_ATTENDANCE, window.attendanceToday || {});
}

function saveStudentAssignments() {
  Storage.save(STORAGE_KEYS.STUDENT_ASSIGNMENTS, DATA.assignments);
}
const DATA = {
  institute: { name: 'Westfield', fullName: 'Westfield Institute of Technology', tagline: 'Institute of Technology' },
  student: { id: 'STU2025001', firstName: 'Alex', lastName: 'Smith', email: 'alex.smith@westfield.edu', phone: '+1 (555) 123-4567', dob: '15 March 2005', address: '42 University Ave, Westfield, CA 90210', program: 'B.Tech Computer Science', year: '2nd Year (Semester 4)', advisor: 'Prof. R. Mehta', gpa: 3.78, attendance: 94, credits: 6, initials: 'AS', enrollmentDate: 'Aug 2023', expectedGraduation: 'May 2027' },
  teacher: { id: 'TCH1001', firstName: 'Rajesh', lastName: 'Mehta', email: 'r.mehta@westfield.edu', phone: '+1 (555) 987-6543', department: 'Computer Science & Engineering', designation: 'Associate Professor', specialization: 'Algorithms, Data Structures, Machine Learning', office: 'Block A, Room 312', officeHours: 'Mon/Wed 2:00-4:00 PM', experience: '12 years', initials: 'RM', courses: ['cs201', 'cs305'], totalStudents: 85, joinDate: 'Aug 2013', qualification: 'Ph.D. Computer Science, IIT Bombay' },
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
    { title: '💼 Career fair next Thursday', body: 'Over 40 companies will be on campus. Update your resume now!', date: '3 days ago' },
    { title: '🔬 Research symposium abstracts due', body: 'Submit your abstracts for the spring research symposium by March 15.', date: '4 days ago' }
  ],
  courses: [
    { id: 'cs201', code: 'CS 201', title: 'Data Structures & Algorithms', description: 'Master arrays, linked lists, trees, graphs, and algorithm design techniques.', longDescription: 'This comprehensive course provides an in-depth study of data structures and algorithms. Students will learn to analyze algorithmic complexity, implement classic data structures, and apply them to solve real-world problems.', instructor: 'Prof. R. Mehta', instructorEmail: 'r.mehta@westfield.edu', instructorOffice: 'Block A, Room 312', instructorHours: 'Mon/Wed 2:00-4:00 PM', credits: 4, progress: 72, theme: 'cs', icon: 'fa-code', grade: 'A-', schedule: 'Mon/Wed 9:00-10:30', semester: 'Spring 2025', enrolled: 45, rating: 4.8,
      modules: [
        { id: 'm1', title: 'Module 1: Foundations & Complexity Analysis', description: 'Introduction to algorithms', completed: true, lessons: [
          { id: 'l1', title: 'Introduction to Algorithms', type: 'video', duration: '18 min', completed: true },
          { id: 'l2', title: 'Big-O Notation', type: 'reading', duration: '12 min', completed: true },
          { id: 'l3', title: 'Complexity Analysis', type: 'video', duration: '22 min', completed: true }
        ]},
        { id: 'm2', title: 'Module 2: Arrays, Linked Lists & Stacks', description: 'Linear data structures', completed: true, lessons: [
          { id: 'l4', title: 'Arrays', type: 'video', duration: '25 min', completed: true },
          { id: 'l5', title: 'Linked Lists', type: 'video', duration: '30 min', completed: true },
          { id: 'l6', title: 'Stacks', type: 'reading', duration: '15 min', completed: true }
        ]},
        { id: 'm3', title: 'Module 3: Trees & BST', description: 'Hierarchical structures', completed: false, lessons: [
          { id: 'l7', title: 'Binary Trees', type: 'video', duration: '28 min', completed: true },
          { id: 'l8', title: 'BST', type: 'video', duration: '24 min', completed: false },
          { id: 'l9', title: 'AVL Trees', type: 'reading', duration: '20 min', completed: false }
        ]},
        { id: 'm4', title: 'Module 4: Heaps, Hashing & Graphs', description: 'Advanced structures', completed: false, lessons: [
          { id: 'l10', title: 'Binary Heaps', type: 'video', duration: '26 min', completed: false },
          { id: 'l11', title: 'Hash Tables', type: 'video', duration: '32 min', completed: false },
          { id: 'l12', title: 'Graph Algorithms', type: 'video', duration: '29 min', completed: false }
        ]}
      ],
      resources: [
        { name: 'Course Syllabus', type: 'pdf', size: '2.4 MB', icon: 'fa-file-pdf' },
        { name: 'Lecture Slides', type: 'slide', size: '8.1 MB', icon: 'fa-file-powerpoint' },
        { name: 'Starter Code', type: 'zip', size: '1.2 MB', icon: 'fa-file-archive' },
        { name: 'Cheat Sheet', type: 'pdf', size: '500 KB', icon: 'fa-file-pdf' }
      ],
      students: [
        { id: 'STU2025001', name: 'Alex Smith', grade: 'A-', attendance: 94 },
        { id: 'STU2025002', name: 'Priya Sharma', grade: 'A', attendance: 97 },
        { id: 'STU2025003', name: 'Marcus Johnson', grade: 'B+', attendance: 88 },
        { id: 'STU2025004', name: 'Sofia Chen', grade: 'A-', attendance: 92 },
        { id: 'STU2025005', name: 'David Kim', grade: 'B', attendance: 85 },
        { id: 'STU2025006', name: 'Emma Wilson', grade: 'A', attendance: 96 }
      ]
    },
    { id: 'math301', code: 'MATH 301', title: 'Linear Algebra', description: 'Vector spaces, linear transformations, matrices, eigenvalues.', longDescription: 'This course develops the theory and computational techniques of linear algebra.', instructor: 'Dr. S. Kapoor', instructorEmail: 's.kapoor@westfield.edu', instructorOffice: 'Block B, Room 205', instructorHours: 'Tue/Thu 1:00-3:00 PM', credits: 3, progress: 65, theme: 'math', icon: 'fa-square-root-alt', grade: 'B+', schedule: 'Tue/Thu 11:00-12:30', semester: 'Spring 2025', enrolled: 38, rating: 4.5,
      modules: [
        { id: 'm1', title: 'Module 1: Systems of Linear Equations', description: 'Gaussian elimination', completed: true, lessons: [
          { id: 'l1', title: 'Introduction to Linear Systems', type: 'video', duration: '20 min', completed: true },
          { id: 'l2', title: 'Gaussian Elimination', type: 'video', duration: '25 min', completed: true }
        ]},
        { id: 'm2', title: 'Module 2: Vector Spaces', description: 'Abstract vector spaces', completed: true, lessons: [
          { id: 'l3', title: 'Vector Spaces', type: 'video', duration: '28 min', completed: true },
          { id: 'l4', title: 'Subspaces', type: 'video', duration: '24 min', completed: true },
          { id: 'l5', title: 'Linear Independence', type: 'reading', duration: '18 min', completed: true }
        ]},
        { id: 'm3', title: 'Module 3: Linear Transformations', description: 'Matrices as maps', completed: false, lessons: [
          { id: 'l6', title: 'Linear Transformations', type: 'video', duration: '26 min', completed: true },
          { id: 'l7', title: 'Matrix Representation', type: 'video', duration: '22 min', completed: false }
        ]}
      ],
      resources: [
        { name: 'Syllabus', type: 'pdf', size: '1.8 MB', icon: 'fa-file-pdf' },
        { name: 'Chapter Notes', type: 'pdf', size: '3.2 MB', icon: 'fa-file-pdf' }
      ],
      students: [
        { id: 'STU2025001', name: 'Alex Smith', grade: 'B+', attendance: 94 },
        { id: 'STU2025007', name: 'Nina Patel', grade: 'A', attendance: 98 }
      ]
    },
    { id: 'phy202', code: 'PHY 202', title: 'Modern Physics', description: 'Quantum mechanics, relativity, atomic structure.', longDescription: 'This course introduces the fundamental concepts of modern physics.', instructor: 'Prof. A. Nair', instructorEmail: 'a.nair@westfield.edu', instructorOffice: 'Block C, Room 410', instructorHours: 'Mon/Fri 10:00-12:00 PM', credits: 4, progress: 58, theme: 'phy', icon: 'fa-atom', grade: 'B', schedule: 'Mon/Wed/Fri 1:30-2:30', semester: 'Spring 2025', enrolled: 32, rating: 4.6,
      modules: [
        { id: 'm1', title: 'Module 1: Special Relativity', description: 'Einstein\'s theory', completed: true, lessons: [
          { id: 'l1', title: 'Michelson-Morley', type: 'video', duration: '22 min', completed: true },
          { id: 'l2', title: 'Postulates', type: 'video', duration: '25 min', completed: true }
        ]},
        { id: 'm2', title: 'Module 2: Quantum Mechanics Origins', description: 'Blackbody radiation', completed: true, lessons: [
          { id: 'l3', title: 'Planck Radiation', type: 'video', duration: '28 min', completed: true },
          { id: 'l4', title: 'Photoelectric Effect', type: 'video', duration: '24 min', completed: true }
        ]}
      ],
      resources: [
        { name: 'Physics Syllabus', type: 'pdf', size: '2.1 MB', icon: 'fa-file-pdf' },
        { name: 'Lab Manual', type: 'pdf', size: '3.5 MB', icon: 'fa-file-pdf' }
      ],
      students: [
        { id: 'STU2025001', name: 'Alex Smith', grade: 'B', attendance: 94 }
      ]
    },
    { id: 'eng105', code: 'ENG 105', title: 'Technical Writing', description: 'Professional communication, report writing, documentation.', longDescription: 'This course develops the written and oral communication skills necessary for technical professionals.', instructor: 'Dr. M. Fernandes', instructorEmail: 'm.fernandes@westfield.edu', instructorOffice: 'Block D, Room 108', instructorHours: 'Tue/Thu 4:30-6:00 PM', credits: 2, progress: 88, theme: 'eng', icon: 'fa-pen-fancy', grade: 'A', schedule: 'Tue/Thu 3:30-4:30', semester: 'Spring 2025', enrolled: 28, rating: 4.9,
      modules: [
        { id: 'm1', title: 'Module 1: Technical Writing Foundations', description: 'Clear communication', completed: true, lessons: [
          { id: 'l1', title: 'Audience Analysis', type: 'video', duration: '18 min', completed: true },
          { id: 'l2', title: 'Clarity & Conciseness', type: 'video', duration: '20 min', completed: true }
        ]}
      ],
      resources: [
        { name: 'Writing Guide', type: 'pdf', size: '2.5 MB', icon: 'fa-file-pdf' }
      ],
      students: [
        { id: 'STU2025001', name: 'Alex Smith', grade: 'A', attendance: 94 }
      ]
    },
    { id: 'cs305', code: 'CS 305', title: 'Database Management Systems', description: 'Relational databases, SQL, normalization, transactions.', longDescription: 'This course covers the design, implementation, and management of database systems.', instructor: 'Prof. K. Iyer', instructorEmail: 'k.iyer@westfield.edu', instructorOffice: 'Block A, Room 315', instructorHours: 'Mon/Wed 4:00-6:00 PM', credits: 4, progress: 45, theme: 'cs', icon: 'fa-database', grade: 'B+', schedule: 'Mon/Wed 2:00-3:30', semester: 'Spring 2025', enrolled: 40, rating: 4.4,
      modules: [
        { id: 'm1', title: 'Module 1: Intro to Databases', description: 'Database concepts', completed: true, lessons: [
          { id: 'l1', title: 'Database Fundamentals', type: 'video', duration: '20 min', completed: true },
          { id: 'l2', title: 'DBMS Architecture', type: 'video', duration: '22 min', completed: true }
        ]},
        { id: 'm2', title: 'Module 2: Relational Model & SQL', description: 'Tables & queries', completed: true, lessons: [
          { id: 'l3', title: 'Relational Model', type: 'video', duration: '25 min', completed: true },
          { id: 'l4', title: 'SQL Basics', type: 'video', duration: '30 min', completed: true }
        ]}
      ],
      resources: [
        { name: 'Database Syllabus', type: 'pdf', size: '2.0 MB', icon: 'fa-file-pdf' },
        { name: 'SQL Cheat Sheet', type: 'pdf', size: '750 KB', icon: 'fa-file-pdf' }
      ],
      students: [
        { id: 'STU2025001', name: 'Alex Smith', grade: 'B+', attendance: 94 },
        { id: 'STU2025010', name: 'Olivia Martinez', grade: 'A-', attendance: 93 }
      ]
    },
    { id: 'stat210', code: 'STAT 210', title: 'Probability & Statistics', description: 'Probability theory, distributions, hypothesis testing.', longDescription: 'This course provides a comprehensive introduction to probability theory and statistical inference.', instructor: 'Dr. P. Desai', instructorEmail: 'p.desai@westfield.edu', instructorOffice: 'Block B, Room 210', instructorHours: 'Tue/Fri 1:00-3:00 PM', credits: 3, progress: 60, theme: 'math', icon: 'fa-chart-pie', grade: 'A-', schedule: 'Tue/Fri 10:00-11:30', semester: 'Spring 2025', enrolled: 35, rating: 4.7,
      modules: [
        { id: 'm1', title: 'Module 1: Probability Foundations', description: 'Axioms & counting', completed: true, lessons: [
          { id: 'l1', title: 'Probability Axioms', type: 'video', duration: '22 min', completed: true },
          { id: 'l2', title: 'Counting Techniques', type: 'video', duration: '25 min', completed: true }
        ]}
      ],
      resources: [
        { name: 'Statistics Syllabus', type: 'pdf', size: '1.9 MB', icon: 'fa-file-pdf' }
      ],
      students: [
        { id: 'STU2025001', name: 'Alex Smith', grade: 'A-', attendance: 94 }
      ]
    }
  ],
 assignments: [
  {
    id: 1,
    title: 'Binary Search Tree Implementation',
    course: 'CS 201',
    courseId: 'cs201',
    description: 'Implement a complete Binary Search Tree with insert, delete, search, and traversal operations. Include proper handling of edge cases.',
    due: 'Mar 18, 2025',
    dueDate: '2025-03-18',
    assignedDate: 'Mar 01, 2025',
    status: 'pending',
    priority: 'high',
    points: 100,
    earnedPoints: null,
    instructor: 'Prof. R. Mehta',
    attachments: [
      { name: 'BST_Specifications.pdf', size: '340 KB', type: 'pdf' },
      { name: 'starter_code.zip', size: '1.2 MB', type: 'zip' }
    ],
    submissionTypes: ['pdf', 'zip', 'doc'],
    submittedFile: null,
    submittedAt: null,
    feedback: null,
    rubric: [
      { criteria: 'Correctness', points: 40 },
      { criteria: 'Edge cases', points: 25 },
      { criteria: 'Code quality', points: 20 },
      { criteria: 'Documentation', points: 15 }
    ]
  },
  {
    id: 2,
    title: 'Matrix Diagonalization Problem Set',
    course: 'MATH 301',
    courseId: 'math301',
    description: 'Solve 10 problems on matrix diagonalization, eigenvalues, and eigenvectors. Show all work.',
    due: 'Mar 20, 2025',
    dueDate: '2025-03-20',
    assignedDate: 'Mar 05, 2025',
    status: 'pending',
    priority: 'medium',
    points: 50,
    earnedPoints: null,
    instructor: 'Dr. S. Kapoor',
    attachments: [
      { name: 'Problem_Set_3.pdf', size: '180 KB', type: 'pdf' }
    ],
    submissionTypes: ['pdf'],
    submittedFile: null,
    submittedAt: null,
    feedback: null,
    rubric: [
      { criteria: 'Correct answers', points: 30 },
      { criteria: 'Methodology', points: 15 },
      { criteria: 'Presentation', points: 5 }
    ]
  },
  {
    id: 3,
    title: 'Quantum Mechanics Lab Report',
    course: 'PHY 202',
    courseId: 'phy202',
    description: 'Write a detailed lab report on the Photoelectric Effect experiment. Include analysis, graphs, and error calculations.',
    due: 'Mar 22, 2025',
    dueDate: '2025-03-22',
    assignedDate: 'Mar 08, 2025',
    status: 'submitted',
    priority: 'medium',
    points: 100,
    earnedPoints: null,
    instructor: 'Prof. A. Nair',
    attachments: [
      { name: 'Lab_Report_Template.docx', size: '220 KB', type: 'doc' },
      { name: 'Experiment_Data.xlsx', size: '85 KB', type: 'doc' }
    ],
    submissionTypes: ['pdf', 'doc'],
    submittedFile: 'QM_Lab_Report_AlexSmith.pdf',
    submittedAt: 'Mar 20, 2025 · 11:45 PM',
    feedback: null,
    rubric: [
      { criteria: 'Data analysis', points: 35 },
      { criteria: 'Graphs & charts', points: 25 },
      { criteria: 'Error calculation', points: 20 },
      { criteria: 'Writing quality', points: 20 }
    ]
  },
  {
    id: 4,
    title: 'Technical Proposal Draft',
    course: 'ENG 105',
    courseId: 'eng105',
    description: 'Submit the first draft of your technical proposal for the final project.',
    due: 'Mar 15, 2025',
    dueDate: '2025-03-15',
    assignedDate: 'Feb 28, 2025',
    status: 'graded',
    priority: 'low',
    points: 40,
    earnedPoints: 36,
    instructor: 'Dr. M. Fernandes',
    attachments: [
      { name: 'Proposal_Guidelines.pdf', size: '450 KB', type: 'pdf' }
    ],
    submissionTypes: ['pdf', 'doc'],
    submittedFile: 'Proposal_Draft_AlexSmith.pdf',
    submittedAt: 'Mar 14, 2025 · 09:30 PM',
    feedback: 'Excellent structure and clear problem statement. Consider adding more detail to the methodology section. Minor grammar issues in section 3.',
    rubric: [
      { criteria: 'Structure', points: 15 },
      { criteria: 'Clarity', points: 15 },
      { criteria: 'Grammar', points: 10 }
    ]
  },
  {
    id: 5,
    title: 'SQL Query Optimization Project',
    course: 'CS 305',
    courseId: 'cs305',
    description: 'Optimize the given database queries and document improvements with execution plans.',
    due: 'Mar 25, 2025',
    dueDate: '2025-03-25',
    assignedDate: 'Mar 10, 2025',
    status: 'pending',
    priority: 'high',
    points: 120,
    earnedPoints: null,
    instructor: 'Prof. K. Iyer',
    attachments: [
      { name: 'Query_Dataset.sql', size: '2.4 MB', type: 'zip' },
      { name: 'Optimization_Guide.pdf', size: '680 KB', type: 'pdf' }
    ],
    submissionTypes: ['pdf', 'zip', 'doc'],
    submittedFile: null,
    submittedAt: null,
    feedback: null,
    rubric: [
      { criteria: 'Query performance', points: 50 },
      { criteria: 'Documentation', points: 30 },
      { criteria: 'Execution plans', points: 40 }
    ]
  },
  {
    id: 6,
    title: 'Hypothesis Testing Worksheet',
    course: 'STAT 210',
    courseId: 'stat210',
    description: 'Complete the hypothesis testing worksheet covering t-tests, chi-square, and ANOVA.',
    due: 'Mar 12, 2025',
    dueDate: '2025-03-12',
    assignedDate: 'Mar 01, 2025',
    status: 'overdue',
    priority: 'high',
    points: 60,
    earnedPoints: null,
    instructor: 'Dr. P. Desai',
    attachments: [
      { name: 'Worksheet_5.pdf', size: '290 KB', type: 'pdf' }
    ],
    submissionTypes: ['pdf'],
    submittedFile: null,
    submittedAt: null,
    feedback: null,
    rubric: [
      { criteria: 'Correct solutions', points: 45 },
      { criteria: 'Work shown', points: 15 }
    ]
  },
  {
    id: 7,
    title: 'Graph Algorithms Analysis',
    course: 'CS 201',
    courseId: 'cs201',
    description: 'Analyze and compare BFS, DFS, Dijkstra, and A* algorithms. Write a comprehensive report.',
    due: 'Mar 28, 2025',
    dueDate: '2025-03-28',
    assignedDate: 'Mar 15, 2025',
    status: 'pending',
    priority: 'medium',
    points: 80,
    earnedPoints: null,
    instructor: 'Prof. R. Mehta',
    attachments: [
      { name: 'Analysis_Rubric.pdf', size: '150 KB', type: 'pdf' },
      { name: 'Sample_Graphs.zip', size: '560 KB', type: 'zip' }
    ],
    submissionTypes: ['pdf', 'doc'],
    submittedFile: null,
    submittedAt: null,
    feedback: null,
    rubric: [
      { criteria: 'Algorithm analysis', points: 40 },
      { criteria: 'Comparison', points: 25 },
      { criteria: 'Examples', points: 15 }
    ]
  },
  {
    id: 8,
    title: 'Final Research Paper',
    course: 'ENG 105',
    courseId: 'eng105',
    description: 'Submit your final research paper on a technical topic of your choice (2500-3500 words).',
    due: 'Apr 10, 2025',
    dueDate: '2025-04-10',
    assignedDate: 'Mar 20, 2025',
    status: 'pending',
    priority: 'high',
    points: 150,
    earnedPoints: null,
    instructor: 'Dr. M. Fernandes',
    attachments: [
      { name: 'Research_Paper_Guidelines.pdf', size: '820 KB', type: 'pdf' },
      { name: 'Citation_Format.pdf', size: '310 KB', type: 'pdf' }
    ],
    submissionTypes: ['pdf', 'doc'],
    submittedFile: null,
    submittedAt: null,
    feedback: null,
    rubric: [
      { criteria: 'Research quality', points: 50 },
      { criteria: 'Structure', points: 30 },
      { criteria: 'Citations', points: 30 },
      { criteria: 'Originality', points: 40 }
    ]
  },
  {
    id: 9,
    title: 'Vector Space Proofs',
    course: 'MATH 301',
    courseId: 'math301',
    description: 'Prove 8 theorems related to vector spaces, subspaces, and linear independence.',
    due: 'Mar 30, 2025',
    dueDate: '2025-03-30',
    assignedDate: 'Mar 18, 2025',
    status: 'pending',
    priority: 'medium',
    points: 70,
    earnedPoints: null,
    instructor: 'Dr. S. Kapoor',
    attachments: [
      { name: 'Proofs_List.pdf', size: '240 KB', type: 'pdf' }
    ],
    submissionTypes: ['pdf'],
    submittedFile: null,
    submittedAt: null,
    feedback: null,
    rubric: [
      { criteria: 'Logical rigor', points: 40 },
      { criteria: 'Completeness', points: 30 }
    ]
  },
  {
    id: 10,
    title: 'Database Normalization Exercise',
    course: 'CS 305',
    courseId: 'cs305',
    description: 'Normalize the given database schemas up to 3NF. Document all steps.',
    due: 'Apr 02, 2025',
    dueDate: '2025-04-02',
    assignedDate: 'Mar 22, 2025',
    status: 'pending',
    priority: 'low',
    points: 50,
    earnedPoints: null,
    instructor: 'Prof. K. Iyer',
    attachments: [
      { name: 'Schemas.pdf', size: '180 KB', type: 'pdf' }
    ],
    submissionTypes: ['pdf', 'doc'],
    submittedFile: null,
    submittedAt: null,
    feedback: null,
    rubric: [
      { criteria: 'Correctness', points: 30 },
      { criteria: 'Documentation', points: 20 }
    ]
  },
  {
    id: 11,
    title: 'Modern Physics Reading Response',
    course: 'PHY 202',
    courseId: 'phy202',
    description: 'Read chapter 7 and write a 500-word response discussing key concepts.',
    due: 'Mar 26, 2025',
    dueDate: '2025-03-26',
    assignedDate: 'Mar 19, 2025',
    status: 'submitted',
    priority: 'low',
    points: 30,
    earnedPoints: null,
    instructor: 'Prof. A. Nair',
    attachments: [
      { name: 'Chapter_7_Notes.pdf', size: '1.1 MB', type: 'pdf' }
    ],
    submissionTypes: ['pdf', 'doc'],
    submittedFile: 'Chapter7_Response_AlexSmith.pdf',
    submittedAt: 'Mar 25, 2025 · 08:15 PM',
    feedback: null,
    rubric: [
      { criteria: 'Content', points: 20 },
      { criteria: 'Writing', points: 10 }
    ]
  },
  {
    id: 12,
    title: 'Statistics Data Analysis Project',
    course: 'STAT 210',
    courseId: 'stat210',
    description: 'Analyze the provided dataset using R. Submit code + report + visualizations.',
    due: 'Apr 05, 2025',
    dueDate: '2025-04-05',
    assignedDate: 'Mar 25, 2025',
    status: 'pending',
    priority: 'high',
    points: 100,
    earnedPoints: null,
    instructor: 'Dr. P. Desai',
    attachments: [
      { name: 'Dataset.csv', size: '3.2 MB', type: 'zip' },
      { name: 'R_Template.R', size: '25 KB', type: 'doc' }
    ],
    submissionTypes: ['pdf', 'zip', 'doc'],
    submittedFile: null,
    submittedAt: null,
    feedback: null,
    rubric: [
      { criteria: 'Analysis', points: 50 },
      { criteria: 'Visualizations', points: 30 },
      { criteria: 'Code quality', points: 20 }
    ]
  }
],
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
    { title: 'Database System Concepts', author: 'Silberschatz', cover: 'c5', icon: 'fa-database', available: true, category: 'CS', year: 2023, copies: '1/3' },
    { title: 'Probability & Statistics', author: 'Walpole', cover: 'c6', icon: 'fa-chart-pie', available: false, category: 'Math', year: 2021, copies: '0/1' }
  ],
  events: [
    { title: 'Annual Tech Hackathon', description: '48-hour coding challenge with exciting prizes.', day: '22', month: 'MAR', time: '09:00 AM', location: 'Innovation Center', category: 'Technology' },
    { title: 'Career Fair 2025', description: 'Meet recruiters from over 40 top companies.', day: '25', month: 'MAR', time: '10:00 AM', location: 'Main Auditorium', category: 'Career' },
    { title: 'Research Symposium', description: 'Present your research findings to faculty.', day: '05', month: 'APR', time: '02:00 PM', location: 'Science Block', category: 'Academic' },
    { title: 'Cultural Fest', description: 'Three days of music, dance, drama.', day: '12', month: 'APR', time: '05:00 PM', location: 'Open Grounds', category: 'Cultural' }
  ],
  messages: [
    { id: 0, name: 'Prof. R. Mehta', role: 'Data Structures Professor', initials: 'RM', unread: 2, messages: [
      { text: 'Hello Alex, I wanted to discuss your project progress.', sender: 'received', time: '10:30 AM' },
      { text: 'Please share your latest code repository.', sender: 'received', time: '10:31 AM' },
      { text: 'Sure Professor, I\'ll share it by tonight.', sender: 'sent', time: '10:35 AM' }
    ]},
    { id: 1, name: 'Dr. S. Kapoor', role: 'Mathematics Professor', initials: 'SK', unread: 0, messages: [
      { text: 'Your assignment has been graded.', sender: 'received', time: 'Yesterday' }
    ]},
    { id: 2, name: 'Study Group - CS', role: '5 members', initials: 'SG', unread: 5, messages: [
      { text: 'Hey everyone, let\'s meet at the library at 4 PM.', sender: 'received', time: '09:15 AM' }
    ]}
  ],
  teacherMessages: [
    { id: 0, name: 'Alex Smith', role: 'CS 201 Student', initials: 'AS', unread: 1, messages: [
      { text: 'Good morning Professor, I have a question about the BST assignment.', sender: 'received', time: '9:15 AM' }
    ]},
    { id: 1, name: 'Priya Sharma', role: 'CS 201 Student', initials: 'PS', unread: 0, messages: [
      { text: 'Thank you for the extension!', sender: 'received', time: 'Yesterday' }
    ]}
  ],
  /* ===== TEACHER ASSIGNMENTS (ENHANCED) ===== */
teacherAssignments: [
  {
    id: 101,
    title: 'Binary Search Tree Implementation',
    course: 'CS 201',
    courseId: 'cs201',
    description: 'Implement a complete BST with insert, delete, search, and traversals.',
    due: 'Mar 18, 2025',
    dueDate: '2025-03-18',
    assignedDate: 'Mar 01, 2025',
    status: 'open',
    points: 100,
    total: 45,
    submissions: 38,
    graded: 12,
    late: 5,
    avgScore: 78,
    attachments: 2,
    type: 'assignment',
    submissionsList: [
      { studentId: 'STU2025001', name: 'Alex Smith', submittedAt: 'Mar 17, 2025 · 10:30 PM', file: 'BST_AlexSmith.zip', status: 'submitted', score: null },
      { studentId: 'STU2025002', name: 'Priya Sharma', submittedAt: 'Mar 16, 2025 · 08:15 PM', file: 'BST_Priya.zip', status: 'graded', score: 95 },
      { studentId: 'STU2025003', name: 'Marcus Johnson', submittedAt: 'Mar 17, 2025 · 11:55 PM', file: 'BST_Marcus.zip', status: 'graded', score: 82 },
      { studentId: 'STU2025004', name: 'Sofia Chen', submittedAt: 'Mar 15, 2025 · 06:45 PM', file: 'BST_Sofia.zip', status: 'graded', score: 88 },
      { studentId: 'STU2025005', name: 'David Kim', submittedAt: 'Mar 18, 2025 · 09:00 AM', file: 'BST_David.zip', status: 'late', score: 70 },
      { studentId: 'STU2025006', name: 'Emma Wilson', submittedAt: 'Mar 14, 2025 · 03:20 PM', file: 'BST_Emma.zip', status: 'graded', score: 92 }
    ]
  },
  {
    id: 102,
    title: 'SQL Query Optimization Project',
    course: 'CS 305',
    courseId: 'cs305',
    description: 'Optimize given SQL queries and document improvements with execution plans.',
    due: 'Mar 25, 2025',
    dueDate: '2025-03-25',
    assignedDate: 'Mar 10, 2025',
    status: 'open',
    points: 120,
    total: 40,
    submissions: 22,
    graded: 5,
    late: 2,
    avgScore: 82,
    attachments: 2,
    type: 'project',
    submissionsList: [
      { studentId: 'STU2025001', name: 'Alex Smith', submittedAt: 'Mar 24, 2025 · 11:45 PM', file: 'SQL_Alex.pdf', status: 'submitted', score: null },
      { studentId: 'STU2025010', name: 'Olivia Martinez', submittedAt: 'Mar 23, 2025 · 09:30 PM', file: 'SQL_Olivia.pdf', status: 'graded', score: 108 }
    ]
  },
  {
    id: 103,
    title: 'Graph Algorithms Analysis',
    course: 'CS 201',
    courseId: 'cs201',
    description: 'Analyze and compare BFS, DFS, Dijkstra, and A* algorithms.',
    due: 'Mar 28, 2025',
    dueDate: '2025-03-28',
    assignedDate: 'Mar 15, 2025',
    status: 'draft',
    points: 80,
    total: 45,
    submissions: 0,
    graded: 0,
    late: 0,
    avgScore: 0,
    attachments: 2,
    type: 'report',
    submissionsList: []
  },
  {
    id: 104,
    title: 'Midterm Exam',
    course: 'CS 201',
    courseId: 'cs201',
    description: 'Comprehensive midterm covering modules 1-3.',
    due: 'Mar 20, 2025',
    dueDate: '2025-03-20',
    assignedDate: 'Mar 10, 2025',
    status: 'scheduled',
    points: 150,
    total: 45,
    submissions: 45,
    graded: 45,
    late: 0,
    avgScore: 74,
    attachments: 1,
    type: 'exam',
    submissionsList: []
  },
  {
    id: 105,
    title: 'Database Design Project',
    course: 'CS 305',
    courseId: 'cs305',
    description: 'Design a complete database system with ER diagram and normalization.',
    due: 'Apr 05, 2025',
    dueDate: '2025-04-05',
    assignedDate: 'Mar 18, 2025',
    status: 'open',
    points: 150,
    total: 40,
    submissions: 15,
    graded: 0,
    late: 0,
    avgScore: 0,
    attachments: 3,
    type: 'project',
    submissionsList: []
  },
  {
    id: 106,
    title: 'Final Course Project',
    course: 'CS 201',
    courseId: 'cs201',
    description: 'Comprehensive final project covering all data structures and algorithms.',
    due: 'Apr 22, 2025',
    dueDate: '2025-04-22',
    assignedDate: 'Apr 01, 2025',
    status: 'scheduled',
    points: 200,
    total: 45,
    submissions: 0,
    graded: 0,
    late: 0,
    avgScore: 0,
    attachments: 4,
    type: 'project',
    submissionsList: []
  }
],

/* ===== TEACHER COURSES (ENHANCED) ===== */
teacherCourses: [
  {
    id: 'cs201',
    code: 'CS 201',
    title: 'Data Structures & Algorithms',
    description: 'Master arrays, linked lists, trees, graphs, and algorithm design techniques.',
    theme: 'cs',
    icon: 'fa-code',
    credits: 4,
    semester: 'Spring 2025',
    schedule: 'Mon/Wed 9:00-10:30',
    room: 'Room 402',
    enrolled: 45,
    capacity: 60,
    rating: 4.8,
    avgProgress: 72,
    avgAttendance: 91,
    avgGrade: 'B+',
    completionRate: 68,
    materialsCount: 24,
    assignmentsCount: 4,
    quizzesCount: 5,
    syllabus: 'syllabus_cs201.pdf',
    color: '#1e5fa8',
    enrolledStudents: [
      { id: 'STU2025001', name: 'Alex Smith', email: 'alex.smith@westfield.edu', grade: 'A-', attendance: 94, progress: 72, lastActive: 'Today', submissions: 8, avatar: 'AS' },
      { id: 'STU2025002', name: 'Priya Sharma', email: 'priya.sharma@westfield.edu', grade: 'A', attendance: 97, progress: 85, lastActive: 'Today', submissions: 10, avatar: 'PS' },
      { id: 'STU2025003', name: 'Marcus Johnson', email: 'marcus.j@westfield.edu', grade: 'B+', attendance: 88, progress: 68, lastActive: 'Yesterday', submissions: 7, avatar: 'MJ' },
      { id: 'STU2025004', name: 'Sofia Chen', email: 'sofia.chen@westfield.edu', grade: 'A-', attendance: 92, progress: 76, lastActive: 'Today', submissions: 9, avatar: 'SC' },
      { id: 'STU2025005', name: 'David Kim', email: 'david.kim@westfield.edu', grade: 'B', attendance: 85, progress: 55, lastActive: '2 days ago', submissions: 6, avatar: 'DK' },
      { id: 'STU2025006', name: 'Emma Wilson', email: 'emma.wilson@westfield.edu', grade: 'A', attendance: 96, progress: 88, lastActive: 'Today', submissions: 10, avatar: 'EW' },
      { id: 'STU2025011', name: 'Ryan Taylor', email: 'ryan.t@westfield.edu', grade: 'B-', attendance: 82, progress: 50, lastActive: '3 days ago', submissions: 5, avatar: 'RT' },
      { id: 'STU2025012', name: 'Maya Patel', email: 'maya.patel@westfield.edu', grade: 'A-', attendance: 93, progress: 78, lastActive: 'Today', submissions: 9, avatar: 'MP' }
    ],
    recentActivity: [
      { type: 'submission', student: 'Priya Sharma', action: 'submitted BST Implementation', time: '2 hours ago' },
      { type: 'question', student: 'Marcus Johnson', action: 'asked about AVL rotations', time: '5 hours ago' },
      { type: 'grade', student: 'Sofia Chen', action: 'received 88/100 on BST', time: 'Yesterday' },
      { type: 'submission', student: 'Alex Smith', action: 'submitted Graph Analysis', time: 'Yesterday' }
    ],
    modules: [
      { id: 'm1', title: 'Foundations & Complexity', lessons: 4, completed: true, studentsCompleted: 42 },
      { id: 'm2', title: 'Arrays, Linked Lists & Stacks', lessons: 4, completed: true, studentsCompleted: 38 },
      { id: 'm3', title: 'Trees & Binary Search Trees', lessons: 5, completed: false, studentsCompleted: 25 },
      { id: 'm4', title: 'Heaps, Hashing & Graphs', lessons: 5, completed: false, studentsCompleted: 12 },
      { id: 'm5', title: 'Sorting & Searching', lessons: 4, completed: false, studentsCompleted: 8 }
    ]
  },
  {
    id: 'cs305',
    code: 'CS 305',
    title: 'Database Management Systems',
    description: 'Relational databases, SQL, normalization, transactions, and NoSQL overview.',
    theme: 'cs',
    icon: 'fa-database',
    credits: 4,
    semester: 'Spring 2025',
    schedule: 'Mon/Wed 2:00-3:30',
    room: 'Room 403',
    enrolled: 40,
    capacity: 50,
    rating: 4.6,
    avgProgress: 62,
    avgAttendance: 88,
    avgGrade: 'B',
    completionRate: 55,
    materialsCount: 18,
    assignmentsCount: 3,
    quizzesCount: 4,
    syllabus: 'syllabus_cs305.pdf',
    color: '#0d9488',
    enrolledStudents: [
      { id: 'STU2025001', name: 'Alex Smith', email: 'alex.smith@westfield.edu', grade: 'B+', attendance: 94, progress: 65, lastActive: 'Today', submissions: 6, avatar: 'AS' },
      { id: 'STU2025010', name: 'Olivia Martinez', email: 'olivia.m@westfield.edu', grade: 'A-', attendance: 93, progress: 78, lastActive: 'Today', submissions: 8, avatar: 'OM' },
      { id: 'STU2025013', name: 'James Brown', email: 'james.b@westfield.edu', grade: 'B', attendance: 86, progress: 55, lastActive: 'Yesterday', submissions: 5, avatar: 'JB' },
      { id: 'STU2025014', name: 'Nina Patel', email: 'nina.patel@westfield.edu', grade: 'A', attendance: 97, progress: 82, lastActive: 'Today', submissions: 8, avatar: 'NP' }
    ],
    recentActivity: [
      { type: 'submission', student: 'Olivia Martinez', action: 'submitted SQL Optimization', time: '1 hour ago' },
      { type: 'question', student: 'Alex Smith', action: 'asked about 3NF normalization', time: '3 hours ago' }
    ],
    modules: [
      { id: 'm1', title: 'Intro to Databases', lessons: 3, completed: true, studentsCompleted: 38 },
      { id: 'm2', title: 'Relational Model & SQL', lessons: 4, completed: true, studentsCompleted: 32 },
      { id: 'm3', title: 'Database Design', lessons: 4, completed: false, studentsCompleted: 18 },
      { id: 'm4', title: 'Transactions & NoSQL', lessons: 4, completed: false, studentsCompleted: 5 }
    ]
  }
],

/* ===== TEACHER MATERIALS ===== */
teacherMaterials: [
  { id: 1, title: 'Lecture Slides - Module 1', type: 'slide', size: '8.1 MB', course: 'CS 201', uploadedAt: 'Mar 01, 2025', downloads: 42 },
  { id: 2, title: 'BST Starter Code', type: 'zip', size: '1.2 MB', course: 'CS 201', uploadedAt: 'Mar 05, 2025', downloads: 38 },
  { id: 3, title: 'Algorithm Cheat Sheet', type: 'pdf', size: '500 KB', course: 'CS 201', uploadedAt: 'Mar 08, 2025', downloads: 45 },
  { id: 4, title: 'SQL Practice Dataset', type: 'zip', size: '2.4 MB', course: 'CS 305', uploadedAt: 'Mar 10, 2025', downloads: 40 },
  { id: 5, title: 'ER Diagram Templates', type: 'slide', size: '3.2 MB', course: 'CS 305', uploadedAt: 'Mar 12, 2025', downloads: 28 },
  { id: 6, title: 'Normalization Guide', type: 'pdf', size: '1.8 MB', course: 'CS 305', uploadedAt: 'Mar 15, 2025', downloads: 35 }
],

/* ===== TEACHER ANNOUNCEMENTS (Enhanced) ===== */
teacherAnnouncements: [
  { id: 1, title: '📢 Faculty Meeting Friday 3 PM', body: 'All CS faculty are requested to attend the department meeting in Conference Room A.', date: '1 hour ago', type: 'meeting', course: 'All' },
  { id: 2, title: '📝 Midterm Grading Deadline', body: 'Please submit midterm grades by March 28, 2025.', date: 'Yesterday', type: 'deadline', course: 'All' },
  { id: 3, title: '🎓 Convocation Ceremony', body: 'Annual convocation will be held on April 15, 2025.', date: '3 days ago', type: 'event', course: 'All' },
  { id: 4, title: '🔬 Research Grant Applications', body: 'The deadline for spring research grant applications is April 1.', date: '4 days ago', type: 'announcement', course: 'All' }
],
  teacherAnnouncements: [
    { title: '📢 Faculty Meeting Friday 3 PM', body: 'All CS faculty are requested to attend.', date: '1 hour ago' },
    { title: '📝 Midterm Grading Deadline', body: 'Please submit midterm grades by March 28, 2025.', date: 'Yesterday' }
  ],
  settings: {
    notifications: { email: true, push: true, sms: false, announcements: true, assignments: true, grades: true },
    privacy: { showProfile: true, showGrades: false, showEmail: true },
    preferences: { darkMode: false, compactView: false, language: 'English' }
  }
};

/* ===== UTILITIES ===== */
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  if (!toast || !toastMessage) return;
  const icon = toast.querySelector('i');
  toastMessage.textContent = message;
  toast.className = 'toast ' + type;
  if (type === 'success') icon.className = 'fas fa-check-circle';
  else if (type === 'error') icon.className = 'fas fa-exclamation-circle';
  else icon.className = 'fas fa-info-circle';
  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

function getCourseById(id) { return DATA.courses.find(c => c.id === id); }

/* ===== SESSION MANAGEMENT ===== */
function getCurrentUser() {
  const user = sessionStorage.getItem('currentUser');
  const role = sessionStorage.getItem('currentRole');
  if (!user || !role) return null;
  try { return { user: JSON.parse(user), role }; } catch (e) { return null; }
}

function setCurrentUser(user, role) {
  sessionStorage.setItem('currentUser', JSON.stringify(user));
  sessionStorage.setItem('currentRole', role);
}

function clearCurrentUser() {
  sessionStorage.removeItem('currentUser');
  sessionStorage.removeItem('currentRole');
}

function requireAuth(role = null) {
  const session = getCurrentUser();
  if (!session) { window.location.href = 'index.html'; return null; }
  if (role && session.role !== role) {
    window.location.href = session.role === 'teacher' ? 'teacher-dashboard.html' : 'dashboard.html';
    return null;
  }
  return session;
}

function logout() {
  clearCurrentUser();
  window.location.href = 'index.html';
}

/* ===== SIDEBAR RENDERING ===== */
function renderSidebar(activePage) {
  const session = getCurrentUser();
  if (!session) return '';
  const { user, role } = session;
  const isTeacher = role === 'teacher';
  
  const studentUnread = DATA.messages.reduce((s, m) => s + m.unread, 0);
  const teacherUnread = DATA.teacherMessages.reduce((s, m) => s + m.unread, 0);
  const pendingAssignments = DATA.assignments.filter(a => a.status === 'pending' || a.status === 'overdue').length;
  const pendingGrading = DATA.teacherAssignments.reduce((s, a) => s + (a.total - a.submissions), 0);

  const studentNav = {
    main: [
      { id: 'dashboard', label: 'Dashboard', icon: 'fa-home', href: 'dashboard.html' },
      { id: 'courses', label: 'Courses', icon: 'fa-book', href: 'courses.html' },
      { id: 'assignments', label: 'Assignments', icon: 'fa-tasks', badge: pendingAssignments, href: 'assignments.html' },
      { id: 'grades', label: 'Grades', icon: 'fa-chart-line', href: 'grades.html' },
      { id: 'timetable', label: 'Timetable', icon: 'fa-calendar-alt', href: 'timetable.html' }
    ],
    resources: [
      { id: 'library', label: 'Library', icon: 'fa-bookmark', href: 'library.html' },
      { id: 'events', label: 'Events', icon: 'fa-calendar-check', href: 'events.html' },
      { id: 'messages', label: 'Messages', icon: 'fa-envelope', badge: studentUnread, href: 'messages.html' }
    ],
    account: [
      { id: 'profile', label: 'Profile', icon: 'fa-user', href: 'profile.html' },
      { id: 'settings', label: 'Settings', icon: 'fa-cog', href: 'settings.html' }
    ]
  };

  const teacherNav = {
    main: [
      { id: 'teacher-dashboard', label: 'Dashboard', icon: 'fa-home', href: 'teacher-dashboard.html' },
      { id: 'teacher-courses', label: 'My Courses', icon: 'fa-chalkboard-teacher', href: 'teacher-courses.html' },
      { id: 'teacher-assignments', label: 'Assignments', icon: 'fa-file-signature', badge: pendingGrading > 0 ? Math.min(pendingGrading, 99) : null, href: 'teacher-assignments.html' },
      { id: 'teacher-students', label: 'Students', icon: 'fa-users', href: 'teacher-students.html' },
      { id: 'teacher-attendance', label: 'Attendance', icon: 'fa-user-check', href: 'teacher-attendance.html' }
    ],
    resources: [
      { id: 'teacher-messages', label: 'Messages', icon: 'fa-envelope', badge: teacherUnread, href: 'teacher-messages.html' }
    ],
    account: [
      { id: 'teacher-profile', label: 'Profile', icon: 'fa-user', href: 'teacher-profile.html' }
    ]
  };

  const nav = isTeacher ? teacherNav : studentNav;

  const renderItems = (items) => items.map(item => `
    <li>
      <a href="${item.href}" class="${activePage === item.id ? 'active' : ''}">
        <i class="fas ${item.icon}"></i>
        <span>${item.label}</span>
        ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
      </a>
    </li>
  `).join('');

  return `
    <aside class="sidebar ${isTeacher ? 'teacher-sidebar' : ''}" id="sidebar">
      <a href="${isTeacher ? 'teacher-dashboard.html' : 'dashboard.html'}" class="sidebar-header">
        <i class="fas fa-graduation-cap"></i>
        <div>
          <h1>${escapeHtml(DATA.institute.name)}</h1>
          <span>${isTeacher ? 'Faculty Portal' : escapeHtml(DATA.institute.tagline)}</span>
        </div>
      </a>
      <div class="sidebar-user">
        <div class="avatar ${isTeacher ? 'teacher-avatar' : ''}">${escapeHtml(user.initials)}</div>
        <div class="user-details">
          <h4>${escapeHtml(user.firstName)} ${escapeHtml(user.lastName)}</h4>
          <p>${isTeacher ? 'Faculty' : escapeHtml(user.id)}</p>
        </div>
      </div>
      <ul class="sidebar-nav">
        <li class="sidebar-nav-label">Main</li>
        ${renderItems(nav.main)}
        <li class="sidebar-nav-label">Resources</li>
        ${renderItems(nav.resources)}
        <li class="sidebar-nav-label">Account</li>
        ${renderItems(nav.account)}
      </ul>
      <div class="sidebar-footer">
        <button onclick="logout()"><i class="fas fa-sign-out-alt"></i> Logout</button>
      </div>
    </aside>
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
  `;
}

/* ===== TOPBAR RENDERING ===== */
function renderTopbar() {
  const session = getCurrentUser();
  if (!session) return '';
  const { user, role } = session;
  const isTeacher = role === 'teacher';
  const messages = isTeacher ? DATA.teacherMessages : DATA.messages;
  const unreadMessages = messages.reduce((sum, m) => sum + m.unread, 0);
  
  return `
    <div class="topbar">
      <div class="topbar-left">
        <button class="menu-toggle" onclick="toggleSidebar()" aria-label="Toggle menu"><i class="fas fa-bars"></i></button>
        <div class="search-global">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Search courses, assignments..." onkeydown="if(event.key==='Enter') handleSearch(this.value)">
        </div>
      </div>
      <div class="topbar-right">
        <a href="${isTeacher ? 'teacher-messages.html' : 'messages.html'}" class="topbar-icon-btn" title="Messages">
          <i class="fas fa-envelope"></i>
          ${unreadMessages > 0 ? '<span class="dot"></span>' : ''}
        </a>
        <a href="${isTeacher ? 'teacher-attendance.html' : 'events.html'}" class="topbar-icon-btn" title="Events">
          <i class="fas ${isTeacher ? 'fa-clipboard-list' : 'fa-calendar-alt'}"></i>
        </a>
        <button class="topbar-icon-btn" onclick="showToast('Notifications opened.', 'info')" title="Notifications">
          <i class="fas fa-bell"></i><span class="dot"></span>
        </button>
        <a href="${isTeacher ? 'teacher-profile.html' : 'profile.html'}" class="topbar-avatar ${isTeacher ? 'teacher-avatar' : ''}">
          ${escapeHtml(user.initials)}
        </a>
      </div>
    </div>
  `;
}

/* ===== LAYOUT BUILDER ===== */
function buildLayout(activePage, mainContent) {
  const session = getCurrentUser();
  if (!session) { window.location.href = 'index.html'; return; }
  const isTeacher = session.role === 'teacher';
  const root = document.getElementById('root');
  root.innerHTML = `
    <div class="portal-layout">
      ${renderSidebar(activePage)}
      <main class="main-content">
        ${renderTopbar()}
        <div class="page-content">
          ${mainContent}
        </div>
        <footer class="portal-footer">
          <p>© ${new Date().getFullYear()} ${escapeHtml(DATA.institute.fullName)}. ${isTeacher ? 'Faculty' : 'Student'} Portal.</p>
        </footer>
      </main>
    </div>
  `;
}

/* ===== SIDEBAR TOGGLE ===== */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (!sidebar) return;
  const isOpen = sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('show', isOpen);
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('show');
}

/* ===== LOGIN/REGISTER HANDLERS ===== */
function initLoginPage() {
  const form = document.getElementById('loginForm');
  const toggle = document.getElementById('togglePassword');
  const pwd = document.getElementById('password');
  const eye = document.getElementById('eyeIcon');
  
  if (toggle) toggle.addEventListener('click', () => {
    const type = pwd.getAttribute('type') === 'password' ? 'text' : 'password';
    pwd.setAttribute('type', type);
    eye.classList.toggle('fa-eye'); eye.classList.toggle('fa-eye-slash');
  });
  
  if (form) form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('studentId').value.trim();
    const pw = document.getElementById('password').value.trim();
    if (!id || !pw) { showToast('Please fill in all fields.', 'error'); return; }
    const btn = document.getElementById('loginBtn'); const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...'; btn.disabled = true;
    setTimeout(() => {
      const student = { ...DATA.student };
      student.email = id.includes('@') ? id : student.email;
      setCurrentUser(student, 'student');
      showToast(`Welcome, ${student.firstName}!`, 'success');
      window.location.href = 'dashboard.html';
    }, 800);
  });
}

function initTeacherLoginPage() {
  const form = document.getElementById('teacherLoginForm');
  const toggle = document.getElementById('toggleTeacherPassword');
  const pwd = document.getElementById('teacherPassword');
  const eye = document.getElementById('teacherEyeIcon');
  
  if (toggle) toggle.addEventListener('click', () => {
    const type = pwd.getAttribute('type') === 'password' ? 'text' : 'password';
    pwd.setAttribute('type', type);
    eye.classList.toggle('fa-eye'); eye.classList.toggle('fa-eye-slash');
  });
  
  if (form) form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('teacherId').value.trim();
    const pw = document.getElementById('teacherPassword').value.trim();
    if (!id || !pw) { showToast('Please fill in all fields.', 'error'); return; }
    const btn = document.getElementById('teacherLoginBtn'); const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...'; btn.disabled = true;
    setTimeout(() => {
      const teacher = { ...DATA.teacher };
      teacher.email = id.includes('@') ? id : teacher.email;
      setCurrentUser(teacher, 'teacher');
      showToast(`Welcome, Prof. ${teacher.lastName}!`, 'success');
      window.location.href = 'teacher-dashboard.html';
    }, 800);
  });
}

function initRegisterPage() {
  const form = document.getElementById('registerForm');
  if (!form) return;
  
  let step = 1;
  const step1Fields = ['regFirstName', 'regLastName', 'regEmail', 'regStudentId'];
  const savedData = {};
  
  const updateSteps = () => {
    document.querySelectorAll('.reg-step').forEach((el, i) => {
      el.classList.toggle('active', i < step);
    });
    document.getElementById('step1Fields').style.display = step === 1 ? 'block' : 'none';
    document.getElementById('step2Fields').style.display = step === 2 ? 'block' : 'none';
    document.getElementById('step1Buttons').style.display = step === 1 ? 'block' : 'none';
    document.getElementById('step2Buttons').style.display = step === 2 ? 'block' : 'none';
    document.getElementById('stepIndicator').textContent = `Step ${step} of 2`;
  };
  
  window.goNextStep = () => {
    let valid = true;
    step1Fields.forEach(id => {
      const val = document.getElementById(id).value.trim();
      savedData[id] = val;
      if (!val) valid = false;
    });
    if (!valid) { showToast('Please fill in all fields.', 'error'); return; }
    if (!savedData.regEmail.includes('@')) { showToast('Enter valid email.', 'error'); return; }
    step = 2;
    updateSteps();
  };
  
  window.goPrevStep = () => { step = 1; updateSteps(); };
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const pw = document.getElementById('regPassword').value;
    const cpw = document.getElementById('regConfirmPassword').value;
    if (pw !== cpw) { showToast('Passwords do not match.', 'error'); return; }
    if (pw.length < 6) { showToast('Password must be 6+ characters.', 'error'); return; }
    const btn = document.getElementById('registerBtn'); const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...'; btn.disabled = true;
    setTimeout(() => {
      const student = {
        id: savedData.regStudentId,
        firstName: savedData.regFirstName,
        lastName: savedData.regLastName,
        email: savedData.regEmail,
        phone: document.getElementById('regPhone').value || '+1 (555) 000-0000',
        dob: document.getElementById('regDob').value || '1 January 2005',
        address: 'Not provided',
        program: document.getElementById('regProgram').value,
        year: document.getElementById('regYear').value,
        advisor: 'Prof. R. Mehta',
        gpa: 0.0, attendance: 100, credits: 6,
        initials: (savedData.regFirstName[0] + savedData.regLastName[0]).toUpperCase(),
        enrollmentDate: 'Jan 2025', expectedGraduation: 'May 2029'
      };
      setCurrentUser(student, 'student');
      showToast(`Welcome, ${student.firstName}!`, 'success');
      window.location.href = 'dashboard.html';
    }, 900);
  });
  
  updateSteps();
}

/* ===== SEARCH ===== */
function handleSearch(query) {
  if (!query.trim()) return;
  const q = query.toLowerCase();
  const session = getCurrentUser();
  const isTeacher = session && session.role === 'teacher';
  
  if (isTeacher) {
    const c = DATA.teacher.courses.map(id => getCourseById(id)).find(c => c && (c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)));
    if (c) { window.location.href = 'teacher-courses.html'; return; }
  } else {
    const c = DATA.courses.find(c => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
    if (c) { window.location.href = 'course-detail.html?id=' + c.id; return; }
    const a = DATA.assignments.find(a => a.title.toLowerCase().includes(q));
    if (a) { window.location.href = 'assignments.html'; return; }
  }
  showToast('No results for "' + query + '"', 'error');
}

/* ===== COURSE FILTER ===== */
let currentAssignmentFilter = 'all';
function filterAssignments(filter) {
  currentAssignmentFilter = filter;
  const filtered = filter === 'all' ? DATA.assignments : DATA.assignments.filter(a => a.status === filter);
  const list = document.getElementById('assignmentsList');
  if (!list) return;
  list.innerHTML = filtered.length === 0
    ? '<p style="text-align:center;color:var(--text-light);padding:2rem;">No assignments in this category.</p>'
    : filtered.map(a => `
      <div class="assignment-item">
        <div class="assignment-status ${a.status}"></div>
        <div class="assignment-info"><h4>${escapeHtml(a.title)}</h4><p>${escapeHtml(a.course)} · Priority: ${escapeHtml(a.priority)}</p></div>
        <div class="assignment-meta">
          <div class="due-date"><i class="far fa-clock"></i> Due ${escapeHtml(a.due)}</div>
          <span class="badge ${a.status}">${a.status}</span>
        </div>
      </div>
    `).join('');
  document.querySelectorAll('.tab-filter').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  /* ============================================================
   ASSIGNMENTS - COMPLETE LOGIC
   ============================================================ */

let currentAssignmentFilter = 'all';
let currentAssignmentSort = 'due-asc';
let currentAssignmentSearch = '';
let currentAssignmentCourse = 'all';

/* ===== Filter & Render ===== */
function filterAssignments(filter) {
  currentAssignmentFilter = filter;
  renderAssignmentsList();
}

function sortAssignments(sort) {
  currentAssignmentSort = sort;
  renderAssignmentsList();
}

function searchAssignments(query) {
  currentAssignmentSearch = query.toLowerCase();
  renderAssignmentsList();
}

function filterByCourse(course) {
  currentAssignmentCourse = course;
  renderAssignmentsList();
}

/* ===== Main Render Function ===== */
function renderAssignmentsList() {
  const listEl = document.getElementById('assignmentsList');
  const countEl = document.getElementById('assignmentsCount');
  if (!listEl) return;

  let filtered = [...DATA.assignments];

  // Apply status filter
  if (currentAssignmentFilter !== 'all') {
    filtered = filtered.filter(a => a.status === currentAssignmentFilter);
  }

  // Apply course filter
  if (currentAssignmentCourse !== 'all') {
    filtered = filtered.filter(a => a.courseId === currentAssignmentCourse);
  }

  // Apply search
  if (currentAssignmentSearch) {
    filtered = filtered.filter(a =>
      a.title.toLowerCase().includes(currentAssignmentSearch) ||
      a.course.toLowerCase().includes(currentAssignmentSearch) ||
      a.description.toLowerCase().includes(currentAssignmentSearch)
    );
  }

  // Apply sort
  filtered.sort((a, b) => {
    switch (currentAssignmentSort) {
      case 'due-asc':
        return new Date(a.dueDate) - new Date(b.dueDate);
      case 'due-desc':
        return new Date(b.dueDate) - new Date(a.dueDate);
      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'points-desc':
        return b.points - a.points;
      case 'title-asc':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
  

  // Update count
  if (countEl) {
    countEl.textContent = `Showing ${filtered.length} of ${DATA.assignments.length} assignments`;
  }

  // Render
  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div style="text-align:center;padding:3rem 1rem;color:var(--text-light);">
        <i class="fas fa-inbox" style="font-size:3rem;color:#c8d4e3;margin-bottom:1rem;display:block;"></i>
        <h3 style="color:var(--text-mid);font-size:1.1rem;margin-bottom:0.4rem;">No assignments found</h3>
        <p style="font-size:0.85rem;">Try adjusting your filters or search terms.</p>
      </div>
    `;
    return;
  }

  listEl.innerHTML = filtered.map(a => renderAssignmentCard(a)).join('');
}

/* ===== Render Single Assignment Card ===== */
function renderAssignmentCard(a) {
  const daysLeft = getDaysUntilDue(a.dueDate);
  const statusInfo = getStatusInfo(a.status, daysLeft);
  const progressPct = a.earnedPoints != null ? Math.round((a.earnedPoints / a.points) * 100) : 0;

  return `
    <div class="assignment-card" onclick="openAssignmentDetail(${a.id})">
      <div class="assignment-card-left">
        <div class="assignment-card-status ${a.status}">
          <i class="fas ${statusInfo.icon}"></i>
        </div>
      </div>
      <div class="assignment-card-body">
        <div class="assignment-card-top">
          <div>
            <span class="assignment-course-tag">${escapeHtml(a.course)}</span>
            <span class="priority-tag priority-${a.priority}">
              <i class="fas fa-flag"></i> ${a.priority}
            </span>
          </div>
          <span class="assignment-badge ${a.status}">${statusInfo.label}</span>
        </div>
        <h4 class="assignment-card-title">${escapeHtml(a.title)}</h4>
        <p class="assignment-card-desc">${escapeHtml(a.description)}</p>
        <div class="assignment-card-meta">
          <span><i class="fas fa-user"></i> ${escapeHtml(a.instructor)}</span>
          <span><i class="fas fa-star"></i> ${a.points} pts</span>
          <span><i class="fas fa-paperclip"></i> ${a.attachments.length} files</span>
          ${a.earnedPoints != null ? `<span style="color:var(--success);font-weight:700;"><i class="fas fa-award"></i> ${a.earnedPoints}/${a.points}</span>` : ''}
        </div>
        <div class="assignment-card-footer">
          <div class="assignment-due ${daysLeft < 0 ? 'overdue' : daysLeft <= 2 ? 'urgent' : ''}">
            <i class="far fa-clock"></i>
            ${statusInfo.dueText}
          </div>
          ${a.status === 'graded' ? `
            <div class="assignment-grade-mini">
              <div class="grade-bar"><div class="grade-fill" style="width:${progressPct}%;"></div></div>
              <span>${progressPct}%</span>
            </div>
          ` : a.status === 'submitted' ? `
            <span class="submitted-tag"><i class="fas fa-check-circle"></i> Submitted</span>
          ` : `
            <button class="btn-submit-mini" onclick="event.stopPropagation();openSubmissionModal(${a.id})">
              <i class="fas fa-upload"></i> ${a.status === 'overdue' ? 'Late Submit' : 'Submit'}
            </button>
          `}
        </div>
      </div>
    </div>
  `;
}

/* ===== Helper: Days until due ===== */
function getDaysUntilDue(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
}

/* ===== Helper: Status info ===== */
function getStatusInfo(status, daysLeft) {
  if (status === 'graded') return { label: 'Graded', icon: 'fa-check-double', dueText: 'Graded' };
  if (status === 'submitted') return { label: 'Submitted', icon: 'fa-paper-plane', dueText: 'Submitted' };
  if (status === 'overdue') return { label: 'Overdue', icon: 'fa-exclamation-triangle', dueText: `Overdue by ${Math.abs(daysLeft)} days` };
  
  if (daysLeft < 0) return { label: 'Overdue', icon: 'fa-exclamation-triangle', dueText: `Overdue by ${Math.abs(daysLeft)} days` };
  if (daysLeft === 0) return { label: 'Due Today', icon: 'fa-clock', dueText: 'Due today!' };
  if (daysLeft === 1) return { label: 'Due Tomorrow', icon: 'fa-clock', dueText: 'Due tomorrow' };
  if (daysLeft <= 3) return { label: 'Due Soon', icon: 'fa-clock', dueText: `Due in ${daysLeft} days` };
  return { label: 'Pending', icon: 'fa-hourglass-half', dueText: `Due in ${daysLeft} days` };
}

/* ===== Open Assignment Detail Modal ===== */
function openAssignmentDetail(id) {
  const a = DATA.assignments.find(x => x.id === id);
  if (!a) return;

  const daysLeft = getDaysUntilDue(a.dueDate);
  const statusInfo = getStatusInfo(a.status, daysLeft);
  const earnedPct = a.earnedPoints != null ? Math.round((a.earnedPoints / a.points) * 100) : 0;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.id = 'assignmentDetailModal';
  modal.innerHTML = `
    <div class="modal-box assignment-detail-modal">
      <div class="assignment-detail-header">
        <div>
          <span class="assignment-course-tag">${escapeHtml(a.course)}</span>
          <span class="priority-tag priority-${a.priority}"><i class="fas fa-flag"></i> ${a.priority} priority</span>
        </div>
        <button class="modal-close-btn" onclick="closeAssignmentDetail()"><i class="fas fa-times"></i></button>
      </div>

      <h2 class="assignment-detail-title">${escapeHtml(a.title)}</h2>
      
      <div class="assignment-detail-status">
        <span class="assignment-badge ${a.status}">${statusInfo.label}</span>
        <span class="assignment-due-large ${daysLeft < 0 ? 'overdue' : daysLeft <= 2 ? 'urgent' : ''}">
          <i class="far fa-clock"></i> ${statusInfo.dueText} · Due ${escapeHtml(a.due)}
        </span>
      </div>

      <div class="assignment-detail-grid">
        <div class="assignment-detail-info">
          <div class="info-item">
            <i class="fas fa-user"></i>
            <div><span>Instructor</span><strong>${escapeHtml(a.instructor)}</strong></div>
          </div>
          <div class="info-item">
            <i class="fas fa-star"></i>
            <div><span>Total Points</span><strong>${a.points}</strong></div>
          </div>
          <div class="info-item">
            <i class="fas fa-calendar-plus"></i>
            <div><span>Assigned</span><strong>${escapeHtml(a.assignedDate)}</strong></div>
          </div>
          <div class="info-item">
            <i class="fas fa-calendar-check"></i>
            <div><span>Due Date</span><strong>${escapeHtml(a.due)}</strong></div>
          </div>
        </div>

        ${a.earnedPoints != null ? `
          <div class="assignment-grade-box">
            <div class="grade-circle" style="--pct:${earnedPct}">
              <svg viewBox="0 0 36 36">
                <path class="grade-circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path class="grade-circle-fill" stroke-dasharray="${earnedPct}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div class="grade-circle-text">
                <strong>${earnedPct}%</strong>
                <span>${a.earnedPoints}/${a.points}</span>
              </div>
            </div>
            <div class="grade-label">Your Score</div>
          </div>
        ` : ''}
      </div>

      <div class="assignment-section">
        <h3><i class="fas fa-align-left"></i> Description</h3>
        <p>${escapeHtml(a.description)}</p>
      </div>

      <div class="assignment-section">
        <h3><i class="fas fa-list-check"></i> Grading Rubric</h3>
        <div class="rubric-list">
          ${a.rubric.map(r => `
            <div class="rubric-item">
              <span>${escapeHtml(r.criteria)}</span>
              <strong>${r.points} pts</strong>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="assignment-section">
        <h3><i class="fas fa-paperclip"></i> Attachments (${a.attachments.length})</h3>
        <div class="attachment-list">
          ${a.attachments.map(f => `
            <div class="attachment-item" onclick="showToast('Downloading ${escapeHtml(f.name)}...', 'info')">
              <div class="attachment-icon ${f.type}">
                <i class="fas ${f.type === 'pdf' ? 'fa-file-pdf' : f.type === 'zip' ? 'fa-file-archive' : 'fa-file-word'}"></i>
              </div>
              <div class="attachment-info">
                <strong>${escapeHtml(f.name)}</strong>
                <span>${escapeHtml(f.size)}</span>
              </div>
              <i class="fas fa-download"></i>
            </div>
          `).join('')}
        </div>
      </div>

      ${a.status === 'graded' && a.feedback ? `
        <div class="assignment-section feedback-section">
          <h3><i class="fas fa-comment-dots"></i> Instructor Feedback</h3>
          <div class="feedback-box">${escapeHtml(a.feedback)}</div>
        </div>
      ` : ''}

      ${a.submittedFile ? `
        <div class="assignment-section">
          <h3><i class="fas fa-file-upload"></i> Your Submission</h3>
          <div class="submission-info-box">
            <i class="fas fa-file-alt"></i>
            <div>
              <strong>${escapeHtml(a.submittedFile)}</strong>
              <span>Submitted ${escapeHtml(a.submittedAt)}</span>
            </div>
            <span class="submission-badge">${a.status === 'graded' ? 'Graded' : 'Received'}</span>
          </div>
        </div>
      ` : ''}

      <div class="assignment-detail-actions">
        ${a.status === 'pending' || a.status === 'overdue' ? `
          <button class="btn-primary" onclick="closeAssignmentDetail();openSubmissionModal(${a.id})">
            <i class="fas fa-upload"></i> ${a.status === 'overdue' ? 'Submit Late' : 'Submit Assignment'}
          </button>
        ` : ''}
        ${a.status === 'submitted' ? `
          <button class="btn-secondary" onclick="showToast('Cannot modify submission after deadline.', 'info')">
            <i class="fas fa-lock"></i> Submission Locked
          </button>
        ` : ''}
        ${a.status === 'graded' ? `
          <button class="btn-secondary" onclick="showToast('Grade dispute form opened.', 'info')">
            <i class="fas fa-question-circle"></i> Dispute Grade
          </button>
        ` : ''}
        <button class="btn-secondary" onclick="closeAssignmentDetail()">
          <i class="fas fa-times"></i> Close
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function closeAssignmentDetail() {
  const m = document.getElementById('assignmentDetailModal');
  if (m) m.remove();
}

/* ===== Submission Modal ===== */
function openSubmissionModal(id) {
  const a = DATA.assignments.find(x => x.id === id);
  if (!a) return;
  const daysLeft = getDaysUntilDue(a.dueDate);

  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.id = 'submissionModal';
  modal.innerHTML = `
    <div class="modal-box submission-modal">
      <h3><i class="fas fa-upload"></i> Submit Assignment</h3>
      <p class="submission-modal-subtitle">${escapeHtml(a.title)} · ${escapeHtml(a.course)}</p>
      
      ${daysLeft < 0 ? `
        <div class="warning-banner">
          <i class="fas fa-exclamation-triangle"></i>
          <span>This assignment is <strong>${Math.abs(daysLeft)} days overdue</strong>. Late submission may incur penalties.</span>
        </div>
      ` : ''}

      <div class="submission-form">
        <label>Upload File</label>
        <div class="file-drop-zone" id="fileDropZone">
          <i class="fas fa-cloud-upload-alt"></i>
          <p><strong>Click to upload</strong> or drag and drop</p>
          <span>Accepted: ${a.submissionTypes.map(t => t.toUpperCase()).join(', ')} · Max 25 MB</span>
          <input type="file" id="submissionFile" accept="${a.submissionTypes.map(t => '.' + t).join(',')}" style="display:none;">
        </div>
        <div id="selectedFileName" class="selected-file" style="display:none;"></div>

        <label style="margin-top:1.2rem;">Comments (Optional)</label>
        <textarea id="submissionComments" placeholder="Add any notes for your instructor..." rows="3" style="width:100%;padding:0.8rem;border:1.5px solid var(--border);border-radius:12px;font-family:inherit;font-size:0.88rem;resize:vertical;"></textarea>

        <div class="submission-checklist">
          <h4><i class="fas fa-clipboard-check"></i> Before submitting</h4>
          <label><input type="checkbox" id="checkOriginal"> This is my original work</label>
          <label><input type="checkbox" id="checkCited"> All sources have been cited</label>
          <label><input type="checkbox" id="checkReviewed"> I have reviewed the submission</label>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn-cancel" onclick="closeSubmissionModal()">Cancel</button>
        <button class="btn-confirm" id="submitAssignmentBtn" style="background:var(--accent);">
          <i class="fas fa-paper-plane"></i> Submit Assignment
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // File drop zone logic
  const dropZone = document.getElementById('fileDropZone');
  const fileInput = document.getElementById('submissionFile');
  const fileNameEl = document.getElementById('selectedFileName');

  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) handleFileSelected(e.dataTransfer.files[0]);
  });
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) handleFileSelected(fileInput.files[0]);
  });

  function handleFileSelected(file) {
    if (file.size > 25 * 1024 * 1024) {
      showToast('File too large. Maximum 25 MB.', 'error');
      return;
    }
    fileNameEl.style.display = 'flex';
    fileNameEl.innerHTML = `
      <i class="fas fa-file-alt"></i>
      <span>${escapeHtml(file.name)} <small>(${(file.size / 1024).toFixed(1)} KB)</small></span>
      <button onclick="clearSelectedFile()"><i class="fas fa-times"></i></button>
    `;
    window._selectedFile = file;
  }

  // Submit
  document.getElementById('submitAssignmentBtn').onclick = () => {
    const original = document.getElementById('checkOriginal').checked;
    const cited = document.getElementById('checkCited').checked;
    const reviewed = document.getElementById('checkReviewed').checked;

    if (!window._selectedFile && !a.submittedFile) {
      showToast('Please select a file to upload.', 'error');
      return;
    }
    if (!original || !cited || !reviewed) {
      showToast('Please confirm all checklist items.', 'error');
      return;
    }

    // Simulate submission
    const btn = document.getElementById('submitAssignmentBtn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    btn.disabled = true;

    setTimeout(() => {
      const assignment = DATA.assignments.find(x => x.id === id);
      assignment.status = 'submitted';
      assignment.submittedFile = window._selectedFile ? window._selectedFile.name : assignment.submittedFile;
      assignment.submittedAt = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      
      closeSubmissionModal();
      renderAssignmentsList();
      updateAssignmentStats();
      showToast('Assignment submitted successfully! 🎉', 'success');
      window._selectedFile = null;
    }, 1200);
  };
}

function clearSelectedFile() {
  window._selectedFile = null;
  const el = document.getElementById('selectedFileName');
  if (el) el.style.display = 'none';
  const inp = document.getElementById('submissionFile');
  if (inp) inp.value = '';
}

function closeSubmissionModal() {
  const m = document.getElementById('submissionModal');
  if (m) m.remove();
  window._selectedFile = null;
}

/* ===== Update Stats ===== */
function updateAssignmentStats() {
  const all = DATA.assignments;
  const pending = all.filter(a => a.status === 'pending').length;
  const overdue = all.filter(a => a.status === 'overdue').length;
  const submitted = all.filter(a => a.status === 'submitted').length;
  const graded = all.filter(a => a.status === 'graded').length;
  const totalPoints = all.reduce((s, a) => s + a.points, 0);
  const earnedPoints = all.reduce((s, a) => s + (a.earnedPoints || 0), 0);

  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setText('statPending', pending);
  setText('statOverdue', overdue);
  setText('statSubmitted', submitted);
  setText('statGraded', graded);
  setText('statTotalPoints', totalPoints);
  setText('statEarnedPoints', earnedPoints);

  // Update counts on filter tabs
  document.querySelectorAll('[data-count-status]').forEach(el => {
    const status = el.dataset.countStatus;
    const count = status === 'all' ? all.length : all.filter(a => a.status === status).length;
    el.textContent = count;
  });
}

/* ===== Initialize Assignments Page ===== */
function initAssignmentsPage() {
  // Populate course filter
  const courseFilter = document.getElementById('courseFilter');
  if (courseFilter) {
    const courses = [...new Set(DATA.assignments.map(a => ({ id: a.courseId, code: a.course })))];
    const uniqueCourses = courses.filter((c, i, arr) => arr.findIndex(x => x.id === c.id) === i);
    courseFilter.innerHTML = `
      <option value="all">All Courses</option>
      ${uniqueCourses.map(c => `<option value="${c.id}">${escapeHtml(c.code)}</option>`).join('')}
    `;
    courseFilter.addEventListener('change', e => filterByCourse(e.target.value));
  }
  updateAssignmentStats();
  renderAssignmentsList();
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    if (e.target.id === 'assignmentDetailModal') closeAssignmentDetail();
    if (e.target.id === 'submissionModal') closeSubmissionModal();
  }
});

// ESC closes modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAssignmentDetail();
    closeSubmissionModal();
  }
});
}
/* ============================================================
   TEACHER ASSIGNMENTS - COMPLETE LOGIC
   ============================================================ */

let teacherAssignmentFilter = 'all';
let teacherAssignmentSort = 'due-asc';
let teacherAssignmentSearch = '';
let teacherAssignmentCourse = 'all';

/* ===== Render Teacher Assignments ===== */
function renderTeacherAssignmentsPage() {
  const listEl = document.getElementById('teacherAssignmentsList');
  if (!listEl) return;

  let filtered = [...DATA.teacherAssignments];

  if (teacherAssignmentFilter !== 'all') {
    filtered = filtered.filter(a => a.status === teacherAssignmentFilter);
  }
  if (teacherAssignmentCourse !== 'all') {
    filtered = filtered.filter(a => a.courseId === teacherAssignmentCourse);
  }
  if (teacherAssignmentSearch) {
    filtered = filtered.filter(a =>
      a.title.toLowerCase().includes(teacherAssignmentSearch) ||
      a.course.toLowerCase().includes(teacherAssignmentSearch)
    );
  }

  filtered.sort((a, b) => {
    switch (teacherAssignmentSort) {
      case 'due-asc': return new Date(a.dueDate) - new Date(b.dueDate);
      case 'due-desc': return new Date(b.dueDate) - new Date(a.dueDate);
      case 'submissions': return b.submissions - a.submissions;
      case 'title-asc': return a.title.localeCompare(b.title);
      default: return 0;
    }
  });

  const countEl = document.getElementById('teacherAssignmentsCount');
  if (countEl) countEl.textContent = `Showing ${filtered.length} of ${DATA.teacherAssignments.length} assignments`;

  if (filtered.length === 0) {
    listEl.innerHTML = `
      <div style="text-align:center;padding:3rem 1rem;color:var(--text-light);">
        <i class="fas fa-inbox" style="font-size:3rem;color:#c8d4e3;margin-bottom:1rem;display:block;"></i>
        <h3 style="color:var(--text-mid);font-size:1.1rem;">No assignments found</h3>
      </div>`;
    return;
  }

  listEl.innerHTML = filtered.map(a => renderTeacherAssignmentCard(a)).join('');
}

function renderTeacherAssignmentCard(a) {
  const submitPct = Math.round((a.submissions / a.total) * 100);
  const gradePct = a.submissions > 0 ? Math.round((a.graded / a.submissions) * 100) : 0;
  const statusColors = { open: 'var(--accent)', draft: 'var(--text-light)', scheduled: 'var(--warning)', closed: 'var(--success)' };

  return `
    <div class="teacher-assignment-card" onclick="openTeacherAssignmentDetail(${a.id})">
      <div class="teacher-assignment-accent" style="background:${statusColors[a.status]}"></div>
      <div class="teacher-assignment-body">
        <div class="teacher-assignment-top">
          <div>
            <span class="assignment-course-tag">${escapeHtml(a.course)}</span>
            <span class="type-tag type-${a.type}"><i class="fas fa-${a.type === 'exam' ? 'file-alt' : a.type === 'project' ? 'project-diagram' : a.type === 'report' ? 'file-lines' : 'tasks'}"></i> ${a.type}</span>
          </div>
          <span class="teacher-assign-status status-${a.status}">${a.status}</span>
        </div>

        <h4 class="teacher-assignment-title">${escapeHtml(a.title)}</h4>
        <p class="teacher-assignment-desc">${escapeHtml(a.description)}</p>

        <div class="teacher-assignment-stats-row">
          <div class="tas-item">
            <i class="fas fa-users"></i>
            <div>
              <strong>${a.total}</strong>
              <span>Students</span>
            </div>
          </div>
          <div class="tas-item">
            <i class="fas fa-paper-plane"></i>
            <div>
              <strong>${a.submissions}</strong>
              <span>Submitted</span>
            </div>
          </div>
          <div class="tas-item">
            <i class="fas fa-check-double"></i>
            <div>
              <strong>${a.graded}</strong>
              <span>Graded</span>
            </div>
          </div>
          <div class="tas-item">
            <i class="fas fa-clock"></i>
            <div>
              <strong>${a.late}</strong>
              <span>Late</span>
            </div>
          </div>
          <div class="tas-item">
            <i class="fas fa-star"></i>
            <div>
              <strong>${a.points}</strong>
              <span>Points</span>
            </div>
          </div>
        </div>

        <div class="teacher-assignment-progress">
          <div class="tap-row">
            <span>Submission Rate</span>
            <strong>${submitPct}%</strong>
          </div>
          <div class="progress-bar" style="height:8px;">
            <div class="progress" style="width:${submitPct}%;height:8px;background:linear-gradient(90deg,#1e5fa8,#2a7de0);"></div>
          </div>
          <div class="tap-row" style="margin-top:0.7rem;">
            <span>Grading Progress</span>
            <strong>${gradePct}%</strong>
          </div>
          <div class="progress-bar" style="height:8px;">
            <div class="progress" style="width:${gradePct}%;height:8px;background:linear-gradient(90deg,#0e7c4a,#1a9e63);"></div>
          </div>
        </div>

        <div class="teacher-assignment-footer">
          <div class="taf-left">
            <span><i class="far fa-calendar"></i> Due ${escapeHtml(a.due)}</span>
            <span><i class="fas fa-paperclip"></i> ${a.attachments} files</span>
            ${a.avgScore > 0 ? `<span style="color:var(--success);font-weight:700;"><i class="fas fa-chart-line"></i> Avg: ${a.avgScore}%</span>` : ''}
          </div>
          <div class="taf-actions" onclick="event.stopPropagation()">
            <button class="btn-icon-action" title="View Submissions" onclick="openAssignmentSubmissions(${a.id})">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn-icon-action" title="Edit" onclick="editTeacherAssignment(${a.id})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon-action danger" title="Delete" onclick="deleteTeacherAssignment(${a.id})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ===== Open Assignment Detail (Teacher) ===== */
function openTeacherAssignmentDetail(id) {
  const a = DATA.teacherAssignments.find(x => x.id === id);
  if (!a) return;

  const submitPct = Math.round((a.submissions / a.total) * 100);
  const gradePct = a.submissions > 0 ? Math.round((a.graded / a.submissions) * 100) : 0;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.id = 'teacherAssignmentModal';
  modal.innerHTML = `
    <div class="modal-box assignment-detail-modal">
      <div class="assignment-detail-header">
        <div>
          <span class="assignment-course-tag">${escapeHtml(a.course)}</span>
          <span class="type-tag type-${a.type}"><i class="fas fa-tasks"></i> ${a.type}</span>
        </div>
        <button class="modal-close-btn" onclick="closeTeacherAssignmentDetail()"><i class="fas fa-times"></i></button>
      </div>

      <h2 class="assignment-detail-title">${escapeHtml(a.title)}</h2>
      <div class="assignment-detail-status">
        <span class="teacher-assign-status status-${a.status}">${a.status}</span>
        <span class="assignment-due-large"><i class="far fa-clock"></i> Due ${escapeHtml(a.due)}</span>
      </div>

      <div class="assignment-detail-grid">
        <div class="assignment-detail-info">
          <div class="info-item"><i class="fas fa-users"></i><div><span>Students</span><strong>${a.total}</strong></div></div>
          <div class="info-item"><i class="fas fa-star"></i><div><span>Total Points</span><strong>${a.points}</strong></div></div>
          <div class="info-item"><i class="fas fa-paper-plane"></i><div><span>Submissions</span><strong>${a.submissions} / ${a.total}</strong></div></div>
          <div class="info-item"><i class="fas fa-check-double"></i><div><span>Graded</span><strong>${a.graded}</strong></div></div>
        </div>
      </div>

      <div class="assignment-section">
        <h3><i class="fas fa-align-left"></i> Description</h3>
        <p>${escapeHtml(a.description)}</p>
      </div>

      <div class="assignment-section">
        <h3><i class="fas fa-chart-bar"></i> Class Analytics</h3>
        <div class="analytics-grid">
          <div class="analytics-item">
            <div class="analytics-label">Submission Rate</div>
            <div class="analytics-bar"><div class="analytics-fill" style="width:${submitPct}%;background:var(--accent);"></div></div>
            <div class="analytics-value">${submitPct}%</div>
          </div>
          <div class="analytics-item">
            <div class="analytics-label">Grading Progress</div>
            <div class="analytics-bar"><div class="analytics-fill" style="width:${gradePct}%;background:var(--success);"></div></div>
            <div class="analytics-value">${gradePct}%</div>
          </div>
          ${a.avgScore > 0 ? `
            <div class="analytics-item">
              <div class="analytics-label">Average Score</div>
              <div class="analytics-bar"><div class="analytics-fill" style="width:${a.avgScore}%;background:var(--warning);"></div></div>
              <div class="analytics-value">${a.avgScore}%</div>
            </div>
          ` : ''}
        </div>
      </div>

      <div class="assignment-detail-actions">
        <button class="btn-primary" onclick="closeTeacherAssignmentDetail();openAssignmentSubmissions(${a.id})">
          <i class="fas fa-list"></i> View Submissions (${a.submissions})
        </button>
        <button class="btn-secondary" onclick="closeTeacherAssignmentDetail();editTeacherAssignment(${a.id})">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn-secondary" onclick="showToast('Reminder sent to all students!', 'success')">
          <i class="fas fa-bell"></i> Send Reminder
        </button>
        <button class="btn-secondary" onclick="closeTeacherAssignmentDetail()">
          <i class="fas fa-times"></i> Close
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function closeTeacherAssignmentDetail() {
  const m = document.getElementById('teacherAssignmentModal');
  if (m) m.remove();
}

/* ===== View Submissions ===== */
function openAssignmentSubmissions(id) {
  const a = DATA.teacherAssignments.find(x => x.id === id);
  if (!a) return;

  const submissions = a.submissionsList || [];
  const gradedCount = submissions.filter(s => s.status === 'graded').length;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.id = 'submissionsModal';
  modal.innerHTML = `
    <div class="modal-box submissions-modal">
      <div class="assignment-detail-header">
        <div>
          <h3 style="color:var(--primary);font-size:1.15rem;font-weight:700;">Submissions</h3>
          <p style="font-size:0.8rem;color:var(--text-light);margin-top:0.2rem;">${escapeHtml(a.title)} · ${escapeHtml(a.course)}</p>
        </div>
        <button class="modal-close-btn" onclick="closeSubmissionsModal()"><i class="fas fa-times"></i></button>
      </div>

      <div class="submission-summary-bar">
        <div class="ssb-item"><strong>${a.submissions}</strong><span>Submitted</span></div>
        <div class="ssb-item"><strong>${gradedCount}</strong><span>Graded</span></div>
        <div class="ssb-item"><strong>${a.submissions - gradedCount}</strong><span>Pending</span></div>
        <div class="ssb-item"><strong>${a.late}</strong><span>Late</span></div>
      </div>

      <div class="submissions-list">
        ${submissions.length === 0 ? `
          <div style="text-align:center;padding:2rem;color:var(--text-light);">
            <i class="fas fa-inbox" style="font-size:2.5rem;color:#c8d4e3;display:block;margin-bottom:0.7rem;"></i>
            <p>No submissions yet</p>
          </div>
        ` : submissions.map(s => `
          <div class="submission-row">
            <div class="student-avatar">${escapeHtml(s.name.split(' ').map(n => n[0]).join('').slice(0,2))}</div>
            <div class="submission-row-info">
              <h5>${escapeHtml(s.name)}</h5>
              <p>${escapeHtml(s.file)} · ${escapeHtml(s.submittedAt)}</p>
            </div>
            <div class="submission-row-actions">
              ${s.status === 'graded' ? `
                <span class="grade-chip">${s.score}/${a.points}</span>
                <button class="btn-icon-action" title="View" onclick="showToast('Opening ${escapeHtml(s.file)}...', 'info')"><i class="fas fa-eye"></i></button>
              ` : `
                <button class="btn-grade" onclick="openGradingModal(${a.id}, '${s.studentId}')">
                  <i class="fas fa-check"></i> Grade
                </button>
                <button class="btn-icon-action" title="View" onclick="showToast('Opening ${escapeHtml(s.file)}...', 'info')"><i class="fas fa-eye"></i></button>
              `}
            </div>
          </div>
        `).join('')}
      </div>

      <div class="modal-actions">
        <button class="btn-secondary" onclick="showToast('Downloading all submissions as ZIP...', 'info')"><i class="fas fa-download"></i> Download All</button>
        <button class="btn-secondary" onclick="closeSubmissionsModal()"><i class="fas fa-times"></i> Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function closeSubmissionsModal() {
  const m = document.getElementById('submissionsModal');
  if (m) m.remove();
}

/* ===== Grading Modal ===== */
function openGradingModal(assignmentId, studentId) {
  const a = DATA.teacherAssignments.find(x => x.id === assignmentId);
  if (!a) return;
  const s = a.submissionsList.find(x => x.studentId === studentId);
  if (!s) return;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.id = 'gradingModal';
  modal.innerHTML = `
    <div class="modal-box grading-modal">
      <h3><i class="fas fa-check-circle"></i> Grade Submission</h3>
      <p style="font-size:0.82rem;color:var(--text-light);margin-bottom:1.2rem;">${escapeHtml(a.title)} · ${escapeHtml(s.name)}</p>

      <div class="grading-info">
        <div class="info-item"><i class="fas fa-file-alt"></i><div><span>Submitted File</span><strong>${escapeHtml(s.file)}</strong></div></div>
        <div class="info-item"><i class="far fa-clock"></i><div><span>Submitted At</span><strong>${escapeHtml(s.submittedAt)}</strong></div></div>
      </div>

      <div class="input-group" style="margin-top:1.2rem;">
        <label>Score (out of ${a.points})</label>
        <div class="input-field"><i class="fas fa-star"></i><input type="number" id="gradeScore" min="0" max="${a.points}" placeholder="Enter score" value="${s.score || ''}"></div>
      </div>

      <div class="input-group">
        <label>Feedback for Student</label>
        <textarea id="gradeFeedback" rows="4" placeholder="Provide constructive feedback..." style="width:100%;padding:0.8rem;border:1.5px solid var(--border);border-radius:12px;font-family:inherit;font-size:0.88rem;resize:vertical;">Great work! Well-structured solution with clear documentation.</textarea>
      </div>

      <div class="quick-feedback-chips">
        <button onclick="insertFeedback('Excellent work!')">Excellent work!</button>
        <button onclick="insertFeedback('Good effort, but needs improvement.')">Needs improvement</button>
        <button onclick="insertFeedback('Please review the requirements.')">Review requirements</button>
        <button onclick="insertFeedback('Well done!')">Well done</button>
      </div>

      <div class="modal-actions" style="margin-top:1.3rem;">
        <button class="btn-cancel" onclick="document.getElementById('gradingModal').remove()">Cancel</button>
        <button class="btn-confirm" style="background:var(--success);" onclick="submitGrade(${assignmentId}, '${studentId}')">
          <i class="fas fa-check"></i> Save Grade
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function insertFeedback(text) {
  const ta = document.getElementById('gradeFeedback');
  if (ta) ta.value = text;
}

function submitGrade(assignmentId, studentId) {
  const score = parseInt(document.getElementById('gradeScore').value);
  const feedback = document.getElementById('gradeFeedback').value;
  const a = DATA.teacherAssignments.find(x => x.id === assignmentId);
  if (!a) return;
  if (isNaN(score) || score < 0 || score > a.points) {
    showToast(`Score must be between 0 and ${a.points}.`, 'error');
    return;
  }
  const s = a.submissionsList.find(x => x.studentId === studentId);
  if (!s) return;
  s.score = score;
  s.status = 'graded';
  s.feedback = feedback;
  s.gradedAt = new Date().toISOString();
  a.graded = a.submissionsList.filter(x => x.status === 'graded').length;
  const gradedScores = a.submissionsList.filter(x => x.status === 'graded').map(x => x.score);
  a.avgScore = Math.round(gradedScores.reduce((a, b) => a + b, 0) / gradedScores.length);

  // ===== SAVE TO STORAGE =====
  saveTeacherAssignments();

  document.getElementById('gradingModal').remove();
  closeSubmissionsModal();
  renderTeacherAssignmentsList();
  updateTeacherAssignmentStats();
  showToast(`Grade saved: ${score}/${a.points}`, 'success');
}

/* ===== Edit / Delete ===== */
function editTeacherAssignment(id) {
  const a = DATA.teacherAssignments.find(x => x.id === id);
  if (!a) return;
  openAssignmentEditor(a);
}

function deleteTeacherAssignment(id) {
  const a = DATA.teacherAssignments.find(x => x.id === id);
  if (!a) return;
  showConfirmModal(
    'Delete Assignment?',
    `Are you sure you want to delete "${a.title}"? This cannot be undone.`,
    () => {
      DATA.teacherAssignments = DATA.teacherAssignments.filter(x => x.id !== id);
      saveTeacherAssignments();   // ← SAVE
      renderTeacherAssignmentsList();
      updateTeacherAssignmentStats();
      showToast('Assignment deleted.', 'success');
    },
    'Delete'
  );
}

/* ===== Create Assignment ===== */
function openCreateAssignmentModal() {
  openAssignmentEditor(null);
}

function openAssignmentEditor(existing) {
  const isEdit = !!existing;
  const a = existing || {
    title: '', course: 'CS 201', courseId: 'cs201', description: '',
    due: '', dueDate: '', assignedDate: new Date().toISOString().split('T')[0],
    status: 'draft', points: 100, type: 'assignment'
  };

  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.id = 'assignmentEditorModal';
  modal.innerHTML = `
    <div class="modal-box editor-modal">
      <div class="assignment-detail-header">
        <h3 style="color:var(--primary);font-size:1.15rem;font-weight:700;">
          <i class="fas fa-${isEdit ? 'edit' : 'plus-circle'}"></i> ${isEdit ? 'Edit' : 'Create'} Assignment
        </h3>
        <button class="modal-close-btn" onclick="document.getElementById('assignmentEditorModal').remove()"><i class="fas fa-times"></i></button>
      </div>

      <div class="editor-form">
        <div class="input-group">
          <label>Title *</label>
          <div class="input-field"><i class="fas fa-heading"></i><input type="text" id="editTitle" value="${escapeHtml(a.title)}" placeholder="e.g., Binary Search Tree Implementation"></div>
        </div>

        <div class="input-row">
          <div class="input-group">
            <label>Course *</label>
            <div class="input-field"><i class="fas fa-book"></i>
              <select id="editCourse">
                <option value="cs201" ${a.courseId === 'cs201' ? 'selected' : ''}>CS 201 · Data Structures</option>
                <option value="cs305" ${a.courseId === 'cs305' ? 'selected' : ''}>CS 305 · Database Systems</option>
              </select>
            </div>
          </div>
          <div class="input-group">
            <label>Type</label>
            <div class="input-field"><i class="fas fa-tag"></i>
              <select id="editType">
                <option value="assignment" ${a.type === 'assignment' ? 'selected' : ''}>Assignment</option>
                <option value="project" ${a.type === 'project' ? 'selected' : ''}>Project</option>
                <option value="report" ${a.type === 'report' ? 'selected' : ''}>Report</option>
                <option value="exam" ${a.type === 'exam' ? 'selected' : ''}>Exam</option>
              </select>
            </div>
          </div>
        </div>

        <div class="input-group">
          <label>Description *</label>
          <textarea id="editDesc" rows="3" placeholder="Describe the assignment..." style="width:100%;padding:0.8rem;border:1.5px solid var(--border);border-radius:12px;font-family:inherit;font-size:0.88rem;resize:vertical;">${escapeHtml(a.description)}</textarea>
        </div>

        <div class="input-row">
          <div class="input-group">
            <label>Due Date *</label>
            <div class="input-field"><i class="fas fa-calendar"></i><input type="date" id="editDue" value="${a.dueDate}"></div>
          </div>
          <div class="input-group">
            <label>Total Points</label>
            <div class="input-field"><i class="fas fa-star"></i><input type="number" id="editPoints" value="${a.points}" min="10" max="500"></div>
          </div>
        </div>

        <div class="input-group">
          <label>Status</label>
          <div class="input-field"><i class="fas fa-toggle-on"></i>
            <select id="editStatus">
              <option value="draft" ${a.status === 'draft' ? 'selected' : ''}>Draft (not visible to students)</option>
              <option value="scheduled" ${a.status === 'scheduled' ? 'selected' : ''}>Scheduled</option>
              <option value="open" ${a.status === 'open' ? 'selected' : ''}>Open (accepting submissions)</option>
            </select>
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button class="btn-cancel" onclick="document.getElementById('assignmentEditorModal').remove()">Cancel</button>
        <button class="btn-confirm" style="background:var(--accent);" onclick="saveTeacherAssignment(${isEdit ? a.id : 'null'})">
          <i class="fas fa-save"></i> ${isEdit ? 'Update' : 'Create'}
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function saveTeacherAssignment(id) {
  const title = document.getElementById('editTitle').value.trim();
  const courseId = document.getElementById('editCourse').value;
  const courseName = courseId === 'cs201' ? 'CS 201' : 'CS 305';
  const desc = document.getElementById('editDesc').value.trim();
  const dueDate = document.getElementById('editDue').value;
  const points = parseInt(document.getElementById('editPoints').value);
  const type = document.getElementById('editType').value;
  const status = document.getElementById('editStatus').value;

  if (!title || !desc || !dueDate || isNaN(points)) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  const dueFormatted = new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (id) {
    // ===== UPDATE EXISTING =====
    const a = DATA.teacherAssignments.find(x => x.id === id);
    if (a) {
      Object.assign(a, { title, course: courseName, courseId, description: desc, dueDate, due: dueFormatted, points, type, status });
    }
    showToast('Assignment updated!', 'success');
  } else {
    // ===== CREATE NEW =====
    const newId = Math.max(...DATA.teacherAssignments.map(a => a.id), 100) + 1;
    DATA.teacherAssignments.unshift({
      id: newId, title, course: courseName, courseId, description: desc,
      dueDate, due: dueFormatted, points, type, status,
      assignedDate: new Date().toISOString().split('T')[0],
      total: 45, submissions: 0, graded: 0, late: 0, avgScore: 0,
      attachments: 0, submissionsList: []
    });
    showToast('Assignment created!', 'success');
  }

  // ===== SAVE TO STORAGE =====
  saveTeacherAssignments();

  document.getElementById('assignmentEditorModal').remove();
  renderTeacherAssignmentsList();
  updateTeacherAssignmentStats();
}

/* ===== Update Teacher Assignment Stats ===== */
function updateTeacherAssignmentStats() {
  const all = DATA.teacherAssignments;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('tStatTotal', all.length);
  set('tStatOpen', all.filter(a => a.status === 'open').length);
  set('tStatSubmissions', all.reduce((s, a) => s + a.submissions, 0));
  set('tStatPending', all.reduce((s, a) => s + (a.submissions - a.graded), 0));
  set('tStatGraded', all.reduce((s, a) => s + a.graded, 0));
  set('tStatAvg', all.filter(a => a.avgScore > 0).length ? Math.round(all.filter(a => a.avgScore > 0).reduce((s, a) => s + a.avgScore, 0) / all.filter(a => a.avgScore > 0).length) + '%' : '—');
}

/* ===== Init Teacher Assignments Page ===== */
function initTeacherAssignmentsPage() {
  const courseFilter = document.getElementById('tCourseFilter');
  if (courseFilter) {
    courseFilter.addEventListener('change', e => { teacherAssignmentCourse = e.target.value; renderTeacherAssignmentsList(); });
  }
  updateTeacherAssignmentStats();
  renderTeacherAssignmentsList();
}

function renderTeacherAssignmentsList() { renderTeacherAssignmentsPage(); }
function filterTeacherAssignments(f) { teacherAssignmentFilter = f; renderTeacherAssignmentsList(); }
function sortTeacherAssignments(s) { teacherAssignmentSort = s; renderTeacherAssignmentsList(); }
function searchTeacherAssignments(q) { teacherAssignmentSearch = q.toLowerCase(); renderTeacherAssignmentsList(); }

/* ============================================================
   TEACHER COURSES - COMPLETE LOGIC
   ============================================================ */

let activeTeacherCourseTab = 'overview';
let currentTeacherCourseId = 'cs201';
let expandedTeacherModules = [];

/* ===== Render Teacher Courses List ===== */
function renderTeacherCoursesPage() {
  const grid = document.getElementById('teacherCoursesGrid');
  if (!grid) return;

  grid.innerHTML = DATA.teacherCourses.map(c => {
    const enrollmentPct = Math.round((c.enrolled / c.capacity) * 100);
    return `
      <div class="teacher-course-card" onclick="openTeacherCourseDetail('${c.id}')">
        <div class="tc-banner" style="background:linear-gradient(135deg, ${c.color}, ${lightenColor(c.color, 20)});">
          <i class="fas ${c.icon}"></i>
          <div class="tc-banner-badge">${c.code}</div>
        </div>
        <div class="tc-body">
          <h3>${escapeHtml(c.title)}</h3>
          <p class="tc-desc">${escapeHtml(c.description)}</p>
          
          <div class="tc-meta-grid">
            <div class="tc-meta-item">
              <i class="fas fa-users"></i>
              <div><strong>${c.enrolled}/${c.capacity}</strong><span>Enrolled</span></div>
            </div>
            <div class="tc-meta-item">
              <i class="fas fa-chart-line"></i>
              <div><strong>${c.avgProgress}%</strong><span>Avg Progress</span></div>
            </div>
            <div class="tc-meta-item">
              <i class="fas fa-calendar-check"></i>
              <div><strong>${c.avgAttendance}%</strong><span>Attendance</span></div>
            </div>
            <div class="tc-meta-item">
              <i class="fas fa-star"></i>
              <div><strong>${c.rating}/5</strong><span>Rating</span></div>
            </div>
          </div>

          <div class="tc-progress-section">
            <div class="tc-progress-row">
              <span>Course Completion</span>
              <strong>${c.completionRate}%</strong>
            </div>
            <div class="progress-bar" style="height:6px;">
              <div class="progress" style="width:${c.completionRate}%;height:6px;"></div>
            </div>
          </div>

          <div class="tc-footer">
            <span><i class="fas fa-book"></i> ${c.materialsCount} materials</span>
            <span><i class="fas fa-tasks"></i> ${c.assignmentsCount} assignments</span>
            <span><i class="fas fa-clock"></i> ${escapeHtml(c.schedule)}</span>
          </div>

          <button class="btn-view-course" onclick="event.stopPropagation();openTeacherCourseDetail('${c.id}')">
            <i class="fas fa-eye"></i> Manage Course
          </button>
        </div>
      </div>
    `;
  }).join('');
}

/* ===== Open Course Detail ===== */
function openTeacherCourseDetail(courseId) {
  window.location.href = 'teacher-course-detail.html?id=' + courseId;
}

/* ===== Init Teacher Course Detail Page ===== */
function initTeacherCourseDetailPage() {
  const params = new URLSearchParams(window.location.search);
  currentTeacherCourseId = params.get('id') || 'cs201';
  renderTeacherCourseDetail();
}

function renderTeacherCourseDetail() {
  const c = DATA.teacherCourses.find(x => x.id === currentTeacherCourseId);
  if (!c) return;

  const heroEl = document.getElementById('tcHero');
  if (heroEl) {
    heroEl.style.background = `linear-gradient(135deg, ${c.color}, ${lightenColor(c.color, 20)})`;
    heroEl.innerHTML = `
      <div class="course-detail-hero-content">
        <div class="course-detail-badge"><i class="fas ${c.icon}"></i> ${escapeHtml(c.code)} · ${escapeHtml(c.semester)}</div>
        <h1>${escapeHtml(c.title)}</h1>
        <p>${escapeHtml(c.description)}</p>
        <div class="course-detail-stats">
          <div class="course-detail-stat"><div class="icon-box"><i class="fas fa-users"></i></div><div class="stat-info"><h4>${c.enrolled}</h4><p>Students</p></div></div>
          <div class="course-detail-stat"><div class="icon-box"><i class="fas fa-star"></i></div><div class="stat-info"><h4>${c.credits}</h4><p>Credits</p></div></div>
          <div class="course-detail-stat"><div class="icon-box"><i class="fas fa-chart-line"></i></div><div class="stat-info"><h4>${c.avgProgress}%</h4><p>Progress</p></div></div>
          <div class="course-detail-stat"><div class="icon-box"><i class="fas fa-thumbs-up"></i></div><div class="stat-info"><h4>${c.rating}/5</h4><p>Rating</p></div></div>
        </div>
      </div>
    `;
  }

  renderTeacherCourseTabContent(c);
}

function setTeacherCourseTab(tab) {
  activeTeacherCourseTab = tab;
  document.querySelectorAll('.course-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  const c = DATA.teacherCourses.find(x => x.id === currentTeacherCourseId);
  if (c) renderTeacherCourseTabContent(c);
}

function renderTeacherCourseTabContent(c) {
  const container = document.getElementById('tcTabContent');
  if (!container) return;

  if (activeTeacherCourseTab === 'overview') {
    container.innerHTML = `
      <div class="dashboard-grid">
        <div>
          <div class="dashboard-card">
            <div class="card-header"><h3><i class="fas fa-chart-bar"></i> Class Overview</h3></div>
            <div class="analytics-grid">
              <div class="analytics-item">
                <div class="analytics-label">Enrollment</div>
                <div class="analytics-bar"><div class="analytics-fill" style="width:${Math.round((c.enrolled/c.capacity)*100)}%;background:var(--accent);"></div></div>
                <div class="analytics-value">${c.enrolled}/${c.capacity}</div>
              </div>
              <div class="analytics-item">
                <div class="analytics-label">Avg Progress</div>
                <div class="analytics-bar"><div class="analytics-fill" style="width:${c.avgProgress}%;background:var(--success);"></div></div>
                <div class="analytics-value">${c.avgProgress}%</div>
              </div>
              <div class="analytics-item">
                <div class="analytics-label">Avg Attendance</div>
                <div class="analytics-bar"><div class="analytics-fill" style="width:${c.avgAttendance}%;background:var(--warning);"></div></div>
                <div class="analytics-value">${c.avgAttendance}%</div>
              </div>
              <div class="analytics-item">
                <div class="analytics-label">Completion</div>
                <div class="analytics-bar"><div class="analytics-fill" style="width:${c.completionRate}%;background:#7c3aed;"></div></div>
                <div class="analytics-value">${c.completionRate}%</div>
              </div>
            </div>
          </div>

          <div class="dashboard-card">
            <div class="card-header"><h3><i class="fas fa-bolt"></i> Recent Activity</h3></div>
            ${c.recentActivity.map(act => `
              <div class="activity-item">
                <div class="activity-icon ${act.type}">
                  <i class="fas ${act.type === 'submission' ? 'fa-paper-plane' : act.type === 'question' ? 'fa-question-circle' : 'fa-check-circle'}"></i>
                </div>
                <div class="activity-info">
                  <p><strong>${escapeHtml(act.student)}</strong> ${escapeHtml(act.action)}</p>
                  <span>${escapeHtml(act.time)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div>
          <div class="dashboard-card">
            <div class="card-header"><h3><i class="fas fa-info-circle"></i> Course Info</h3></div>
            <div class="info-row"><div class="label">Course Code</div><div class="value">${escapeHtml(c.code)}</div></div>
            <div class="info-row"><div class="label">Semester</div><div class="value">${escapeHtml(c.semester)}</div></div>
            <div class="info-row"><div class="label">Schedule</div><div class="value">${escapeHtml(c.schedule)}</div></div>
            <div class="info-row"><div class="label">Room</div><div class="value">${escapeHtml(c.room)}</div></div>
            <div class="info-row"><div class="label">Credits</div><div class="value">${c.credits}</div></div>
          </div>

          <div class="dashboard-card">
            <div class="card-header"><h3><i class="fas fa-tools"></i> Quick Actions</h3></div>
            <div class="quick-actions">
              <button onclick="openCreateAssignmentModal()"><i class="fas fa-plus"></i> New Assignment</button>
              <button onclick="showToast('Announcement composer opened', 'info')"><i class="fas fa-bullhorn"></i> Post Announcement</button>
              <button onclick="showToast('Upload material dialog opened', 'info')"><i class="fas fa-upload"></i> Upload Material</button>
              <button onclick="showToast('Gradebook opened', 'info')"><i class="fas fa-clipboard-list"></i> Open Gradebook</button>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (activeTeacherCourseTab === 'students') {
    container.innerHTML = `
      <div class="dashboard-card">
        <div class="card-header">
          <h3><i class="fas fa-users"></i> Enrolled Students (${c.enrolledStudents.length})</h3>
          <div style="display:flex;gap:0.5rem;">
            <button class="btn-secondary" style="padding:0.5rem 1rem;font-size:0.78rem;" onclick="showToast('Export started...', 'info')"><i class="fas fa-download"></i> Export</button>
            <button class="btn-primary" style="padding:0.5rem 1rem;font-size:0.78rem;" onclick="showToast('Email composer opened', 'info')"><i class="fas fa-envelope"></i> Email All</button>
          </div>
        </div>
        <div class="search-bar"><i class="fas fa-search"></i><input type="text" placeholder="Search students..." oninput="filterTeacherStudents(this.value)"></div>
        <div class="student-list" id="tcStudentList">
          ${c.enrolledStudents.map(s => `
            <div class="student-row-detailed">
              <div class="student-avatar">${escapeHtml(s.avatar)}</div>
              <div class="student-main">
                <h5>${escapeHtml(s.name)}</h5>
                <p>${escapeHtml(s.email)}</p>
              </div>
              <div class="student-metrics">
                <div class="metric">
                  <span>Grade</span>
                  <strong class="grade-chip-sm grade-${s.grade.startsWith('A') ? 'a' : s.grade.startsWith('B') ? 'b' : 'c'}">${escapeHtml(s.grade)}</strong>
                </div>
                <div class="metric">
                  <span>Attendance</span>
                  <strong>${s.attendance}%</strong>
                </div>
                <div class="metric">
                  <span>Progress</span>
                  <strong>${s.progress}%</strong>
                </div>
                <div class="metric">
                  <span>Submissions</span>
                  <strong>${s.submissions}/10</strong>
                </div>
              </div>
              <div class="student-actions">
                <button class="btn-icon-action" title="View profile" onclick="showToast('Viewing ${escapeHtml(s.name)}', 'info')"><i class="fas fa-user"></i></button>
                <button class="btn-icon-action" title="Message" onclick="showToast('Opening chat with ${escapeHtml(s.name)}', 'info')"><i class="fas fa-envelope"></i></button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (activeTeacherCourseTab === 'modules') {
    container.innerHTML = `
      <div class="dashboard-card">
        <div class="card-header">
          <h3><i class="fas fa-list-ul"></i> Course Modules (${c.modules.length})</h3>
          <button class="btn-primary" style="padding:0.5rem 1rem;font-size:0.78rem;" onclick="showToast('Add module dialog opened', 'info')"><i class="fas fa-plus"></i> Add Module</button>
        </div>
        <div class="teacher-modules-list">
          ${c.modules.map((m, i) => {
            const completionPct = Math.round((m.studentsCompleted / c.enrolled) * 100);
            return `
              <div class="teacher-module-card">
                <div class="tm-header">
                  <div class="tm-icon ${m.completed ? 'completed' : ''}"><i class="fas ${m.completed ? 'fa-check' : 'fa-folder'}"></i></div>
                  <div class="tm-info">
                    <h4>${escapeHtml(m.title)}</h4>
                    <p>${m.lessons} lessons · ${m.studentsCompleted}/${c.enrolled} students completed</p>
                  </div>
                  <div class="tm-completion">
                    <div class="tm-pct">${completionPct}%</div>
                    <div class="tm-bar"><div class="tm-fill" style="width:${completionPct}%;"></div></div>
                  </div>
                  <div class="tm-actions">
                    <button class="btn-icon-action" title="Edit" onclick="showToast('Editing module...', 'info')"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon-action" title="View" onclick="showToast('Opening module content', 'info')"><i class="fas fa-eye"></i></button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  } else if (activeTeacherCourseTab === 'materials') {
    const courseMaterials = DATA.teacherMaterials.filter(m => m.course === c.code);
    container.innerHTML = `
      <div class="dashboard-card">
        <div class="card-header">
          <h3><i class="fas fa-folder-open"></i> Course Materials (${courseMaterials.length})</h3>
          <button class="btn-primary" style="padding:0.5rem 1rem;font-size:0.78rem;" onclick="showToast('Upload dialog opened', 'info')"><i class="fas fa-upload"></i> Upload New</button>
        </div>
        <div class="materials-list">
          ${courseMaterials.map(m => `
            <div class="material-row">
              <div class="material-icon ${m.type}">
                <i class="fas ${m.type === 'pdf' ? 'fa-file-pdf' : m.type === 'slide' ? 'fa-file-powerpoint' : 'fa-file-archive'}"></i>
              </div>
              <div class="material-info">
                <h4>${escapeHtml(m.title)}</h4>
                <p>${m.type.toUpperCase()} · ${escapeHtml(m.size)} · Uploaded ${escapeHtml(m.uploadedAt)}</p>
              </div>
              <div class="material-stats">
                <span><i class="fas fa-download"></i> ${m.downloads} downloads</span>
              </div>
              <div class="material-actions">
                <button class="btn-icon-action" title="Download" onclick="showToast('Downloading...', 'info')"><i class="fas fa-download"></i></button>
                <button class="btn-icon-action" title="Edit" onclick="showToast('Editing material...', 'info')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon-action danger" title="Delete" onclick="showToast('Material deleted', 'success')"><i class="fas fa-trash"></i></button>
              </div>
            </div>
          `).join('') || '<p style="text-align:center;padding:2rem;color:var(--text-light);">No materials yet</p>'}
        </div>
      </div>
    `;
  } else if (activeTeacherCourseTab === 'announcements') {
    container.innerHTML = `
      <div class="dashboard-card">
        <div class="card-header">
          <h3><i class="fas fa-bullhorn"></i> Course Announcements</h3>
          <button class="btn-primary" style="padding:0.5rem 1rem;font-size:0.78rem;" onclick="showToast('Composer opened', 'info')"><i class="fas fa-plus"></i> New Announcement</button>
        </div>
        ${DATA.teacherAnnouncements.map(a => `
          <div class="teacher-announcement">
            <div class="ta-icon type-${a.type}">
              <i class="fas ${a.type === 'meeting' ? 'fa-users' : a.type === 'deadline' ? 'fa-clock' : a.type === 'event' ? 'fa-calendar' : 'fa-bullhorn'}"></i>
            </div>
            <div class="ta-content">
              <h4>${escapeHtml(a.title)}</h4>
              <p>${escapeHtml(a.body)}</p>
              <span class="ta-date">${escapeHtml(a.date)}</span>
            </div>
            <div class="ta-actions">
              <button class="btn-icon-action" onclick="showToast('Editing...', 'info')"><i class="fas fa-edit"></i></button>
              <button class="btn-icon-action danger" onclick="showToast('Deleted', 'success')"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

function filterTeacherStudents(q) {
  const list = document.getElementById('tcStudentList');
  if (!list) return;
  q = q.toLowerCase();
  list.querySelectorAll('.student-row-detailed').forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(q) ? 'flex' : 'none';
  });
}

// Close modals on click outside
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    if (e.target.id === 'teacherAssignmentModal') closeTeacherAssignmentDetail();
    if (e.target.id === 'submissionsModal') closeSubmissionsModal();
    if (e.target.id === 'assignmentEditorModal') e.target.remove();
    if (e.target.id === 'gradingModal') e.target.remove();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeTeacherAssignmentDetail();
    closeSubmissionsModal();
    const editor = document.getElementById('assignmentEditorModal');
    if (editor) editor.remove();
    const grader = document.getElementById('gradingModal');
    if (grader) grader.remove();
  }
});


/* ===== MESSAGES ===== */
let activeMessageContact = 0;
function openConversation(idx, isTeacher = false) {
  activeMessageContact = idx;
  const messages = isTeacher ? DATA.teacherMessages : DATA.messages;
  if (messages[idx]) messages[idx].unread = 0;
  renderMessagesPage(isTeacher);
}

function renderMessagesPage(isTeacher) {
  const messages = isTeacher ? DATA.teacherMessages : DATA.messages;
  const active = messages[activeMessageContact] || messages[0];
  const list = document.getElementById('messagesContactList');
  const chat = document.getElementById('messagesChat');
  if (!list || !chat) return;
  
  list.innerHTML = messages.map((m, i) => `
    <div class="message-contact ${i === activeMessageContact ? 'active' : ''}" onclick="openConversation(${i}, ${isTeacher})">
      <div class="contact-avatar">${escapeHtml(m.initials)}</div>
      <div class="contact-info"><h4>${escapeHtml(m.name)}</h4><p>${escapeHtml(m.messages[m.messages.length-1].text)}</p></div>
      <div class="contact-meta">
        <div class="time">${escapeHtml(m.messages[m.messages.length-1].time)}</div>
        ${m.unread > 0 ? `<div class="unread">${m.unread}</div>` : ''}
      </div>
    </div>
  `).join('');
  
  chat.innerHTML = `
    <div class="chat-header">
      <div class="contact-avatar">${escapeHtml(active.initials)}</div>
      <div><h4>${escapeHtml(active.name)}</h4><p>${escapeHtml(active.role)}</p></div>
    </div>
    <div class="chat-messages" id="chatMessages">
      ${active.messages.map(m => `
        <div class="chat-bubble ${m.sender}">${escapeHtml(m.text)}<span class="msg-time">${escapeHtml(m.time)}</span></div>
      `).join('')}
    </div>
    <div class="chat-input">
      <input type="text" id="messageInput" placeholder="Type a message..." onkeydown="if(event.key==='Enter') sendMessage(${isTeacher})">
      <button onclick="sendMessage(${isTeacher})"><i class="fas fa-paper-plane"></i> Send</button>
    </div>
  `;
  
  setTimeout(() => {
    const cm = document.getElementById('chatMessages');
    if (cm) cm.scrollTop = cm.scrollHeight;
  }, 50);
}

function sendMessage(isTeacher) {
  const input = document.getElementById('messageInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  const messages = isTeacher ? DATA.teacherMessages : DATA.messages;
  messages[activeMessageContact].messages.push({
    text, sender: 'sent', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  
  // ===== SAVE =====
  if (isTeacher) saveTeacherMessages();
  
  renderMessagesPage(isTeacher);
  showToast('Message sent.', 'success');
}

/* ===== ATTENDANCE ===== */
const attendanceToday = {};
function markAttendance(studentId, status, courseId = 'cs201') {
  if (!window.attendanceToday) window.attendanceToday = {};
  window.attendanceToday[studentId] = status;
  const row = document.querySelector(`.att-btn.present[data-sid="${studentId}"]`)?.closest('.attendance-row');
  if (row) {
    row.querySelectorAll('.att-btn').forEach(b => b.classList.remove('active'));
    row.querySelector(`.att-btn.${status}`).classList.add('active');
  }
  saveTeacherAttendance();   // ← SAVE
}

function markAllAttendance(status, courseId = 'cs201') {
  const course = getCourseById(courseId);
  if (!course) return;
  if (!window.attendanceToday) window.attendanceToday = {};
  course.students.forEach(s => { window.attendanceToday[s.id] = status; });
  document.querySelectorAll('.attendance-row').forEach(row => {
    row.querySelectorAll('.att-btn').forEach(b => b.classList.remove('active'));
    row.querySelector(`.att-btn.${status}`)?.classList.add('active');
  });
  saveTeacherAttendance();   // ← SAVE
  showToast(`All marked as ${status}.`, 'success');
}

function submitAttendance() {
  const count = Object.keys(window.attendanceToday || {}).length;
  if (count === 0) { showToast('No attendance marked yet.', 'error'); return; }
  
  // Save with timestamp
  const record = {
    date: new Date().toISOString().split('T')[0],
    timestamp: new Date().toISOString(),
    records: { ...window.attendanceToday }
  };
  
  const allRecords = Storage.load('westfield_attendance_history', []);
  allRecords.push(record);
  Storage.save('westfield_attendance_history', allRecords);
  
  saveTeacherAttendance();
  showToast(`Attendance submitted for ${count} students.`, 'success');
}
/* ===== SETTINGS ===== */
function toggleSetting(el, category, key) {
  el.classList.toggle('active');
  DATA.settings[category][key] = el.classList.contains('active');
  showToast(`${key} ${el.classList.contains('active') ? 'enabled' : 'disabled'}.`, 'success');
}

/* ===== COURSE MODULE TOGGLE ===== */
function toggleModule(moduleId) {
  const header = document.querySelector(`.module-header[data-module="${moduleId}"]`);
  if (!header) return;
  const body = header.nextElementSibling;
  header.classList.toggle('expanded');
  body.classList.toggle('expanded');
}

function toggleLessonCompletion(courseId, moduleId, lessonId) {
  const course = getCourseById(courseId);
  if (!course) return;
  const mod = course.modules.find(m => m.id === moduleId);
  if (!mod) return;
  const lesson = mod.lessons.find(l => l.id === lessonId);
  if (!lesson) return;
  lesson.completed = !lesson.completed;
  mod.completed = mod.lessons.every(l => l.completed);
  const total = course.modules.reduce((s, m) => s + m.lessons.length, 0);
  const done = course.modules.reduce((s, m) => s + m.lessons.filter(l => l.completed).length, 0);
  course.progress = Math.round((done / total) * 100);
  showToast(lesson.completed ? 'Marked complete.' : 'Marked incomplete.', 'success');
  initCourseDetailPage();
}

/* ===== COURSE DETAIL TAB ===== */
let activeCourseTab = 'overview';
function setCourseTab(tab) {
  activeCourseTab = tab;
  document.querySelectorAll('.course-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  renderCourseTabContent();
}

function renderCourseTabContent() {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get('id') || 'cs201';
  const course = getCourseById(courseId);
  if (!course) return;
  const container = document.getElementById('courseTabContent');
  if (!container) return;
  const total = course.modules.reduce((s, m) => s + m.lessons.length, 0);
  const done = course.modules.reduce((s, m) => s + m.lessons.filter(l => l.completed).length, 0);
  
  if (activeCourseTab === 'overview') {
    container.innerHTML = `
      <div class="dashboard-card">
        <div class="card-header"><h3><i class="fas fa-info-circle"></i> Course Description</h3></div>
        <p style="font-size:0.88rem;color:var(--text-mid);line-height:1.7;">${escapeHtml(course.longDescription)}</p>
      </div>
      <div class="dashboard-card">
        <div class="card-header"><h3><i class="fas fa-chart-line"></i> Your Progress</h3></div>
        <div style="display:flex;gap:1.8rem;flex-wrap:wrap;margin-bottom:1.3rem;">
          <div><div style="font-size:1.8rem;font-weight:700;color:var(--primary);">${course.progress}%</div><div style="font-size:0.75rem;color:var(--text-light);">Progress</div></div>
          <div><div style="font-size:1.8rem;font-weight:700;color:var(--success);">${done}</div><div style="font-size:0.75rem;color:var(--text-light);">Completed</div></div>
          <div><div style="font-size:1.8rem;font-weight:700;color:var(--warning);">${total - done}</div><div style="font-size:0.75rem;color:var(--text-light);">Remaining</div></div>
          <div><div style="font-size:1.8rem;font-weight:700;color:var(--accent);">${escapeHtml(course.grade)}</div><div style="font-size:0.75rem;color:var(--text-light);">Grade</div></div>
        </div>
        <div class="progress-bar" style="height:10px;"><div class="progress" style="width:${course.progress}%;height:10px;"></div></div>
      </div>
    `;
  } else if (activeCourseTab === 'modules') {
    container.innerHTML = `
      <div class="modules-list">
        ${course.modules.map(m => {
          const comp = m.lessons.filter(l => l.completed).length;
          return `
            <div class="module-card">
              <div class="module-header" data-module="${m.id}" onclick="toggleModule('${m.id}')">
                <div class="module-icon ${m.completed ? 'completed' : ''}"><i class="fas ${m.completed ? 'fa-check' : 'fa-folder'}"></i></div>
                <div class="module-info"><h4>${escapeHtml(m.title)}</h4><p>${escapeHtml(m.description)} · ${comp}/${m.lessons.length} lessons</p></div>
                <i class="fas fa-chevron-down module-chevron"></i>
              </div>
              <div class="module-body">
                ${m.lessons.map(l => `
                  <div class="lesson-item" onclick="toggleLessonCompletion('${course.id}', '${m.id}', '${l.id}')">
                    <div class="lesson-check ${l.completed ? 'done' : ''}">${l.completed ? '<i class="fas fa-check"></i>' : ''}</div>
                    <div class="lesson-info"><h5>${escapeHtml(l.title)}</h5><p>${l.completed ? 'Completed' : 'Not started'}</p></div>
                    <div class="lesson-meta"><span class="type-badge ${l.type}">${l.type}</span></div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  } else if (activeCourseTab === 'resources') {
    container.innerHTML = `
      <div class="resources-grid">
        ${course.resources.map(r => `
          <div class="resource-card" onclick="showToast('Opening ${escapeHtml(r.name)}...', 'info')">
            <div class="resource-icon ${r.type}"><i class="fas ${r.icon}"></i></div>
            <div class="resource-info"><h5>${escapeHtml(r.name)}</h5><p>${r.type.toUpperCase()} · ${escapeHtml(r.size)}</p></div>
          </div>
        `).join('')}
      </div>
    `;
  }
}

/* ===== COURSE DETAIL INIT ===== */
function initCourseDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get('id') || 'cs201';
  const course = getCourseById(courseId);
  if (!course) return;
  const hero = document.getElementById('courseDetailHero');
  if (hero) {
    hero.innerHTML = `
      <div class="course-detail-badge"><i class="fas ${course.icon}"></i> ${escapeHtml(course.code)} · ${escapeHtml(course.semester)}</div>
      <h1>${escapeHtml(course.title)}</h1>
      <p>${escapeHtml(course.description)}</p>
      <div class="course-detail-stats">
        <div class="course-detail-stat"><div class="icon-box"><i class="fas fa-star"></i></div><div class="stat-info"><h4>${course.credits} Credits</h4><p>Weight</p></div></div>
        <div class="course-detail-stat"><div class="icon-box"><i class="fas fa-users"></i></div><div class="stat-info"><h4>${course.enrolled}</h4><p>Enrolled</p></div></div>
        <div class="course-detail-stat"><div class="icon-box"><i class="fas fa-thumbs-up"></i></div><div class="stat-info"><h4>${course.rating}/5</h4><p>Rating</p></div></div>
        <div class="course-detail-stat"><div class="icon-box"><i class="fas fa-award"></i></div><div class="stat-info"><h4>${escapeHtml(course.grade)}</h4><p>Grade</p></div></div>
      </div>
    `;
  }
  renderCourseTabContent();
}

/* ===== SEARCH BOOKS ===== */
function searchBooks(query) {
  const grid = document.getElementById('libraryGrid');
  if (!grid) return;
  const q = query.toLowerCase();
  const filtered = DATA.libraryBooks.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.category.toLowerCase().includes(q));
  grid.innerHTML = filtered.length === 0
    ? '<p style="text-align:center;color:var(--text-light);padding:2rem;grid-column:1/-1;">No books found.</p>'
    : filtered.map(b => renderBookCard(b)).join('');
}

function renderBookCard(b) {
  return `
    <div class="book-card" onclick="showToast('Opening \\'${escapeHtml(b.title)}\\'...', 'info')">
      <div class="book-cover ${b.cover}"><i class="fas ${b.icon}"></i></div>
      <div class="book-info">
        <h4>${escapeHtml(b.title)}</h4>
        <div class="author">${escapeHtml(b.author)}</div>
        <div class="book-meta"><span><i class="fas fa-tag"></i> ${escapeHtml(b.category)}</span><span><i class="fas fa-calendar"></i> ${b.year}</span></div>
        <span class="availability ${b.available ? 'available' : 'borrowed'}">${b.available ? `Available (${b.copies})` : 'Borrowed'}</span>
      </div>
    </div>
  `;
}
/* ============================================================
   SETTINGS - COMPLETE WORKING LOGIC
   ============================================================ */

/* Settings State (persisted in localStorage) */
const SETTINGS_KEY = 'westfield_settings';

const DEFAULT_SETTINGS = {
  notifications: {
    email: true,
    push: true,
    sms: false,
    announcements: true,
    assignments: true,
    grades: true,
    events: false,
    weeklyDigest: true,
    soundAlerts: true
  },
  privacy: {
    showProfile: true,
    showGrades: false,
    showEmail: true,
    showPhone: false,
    searchable: true,
    activityStatus: true
  },
  preferences: {
    darkMode: false,
    compactView: false,
    language: 'English',
    accentColor: '#1e5fa8',
    fontSize: 'medium',
    animations: true,
    autoPlay: true
  },
  security: {
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: '30'
  }
};

/* ===== Load / Save Settings ===== */
function loadSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return deepMerge(DEFAULT_SETTINGS, parsed);
    }
  } catch (e) { console.warn('Settings load error:', e); }
  return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
}

function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DATA.settings));
  } catch (e) { console.warn('Settings save error:', e); }
}

function deepMerge(target, source) {
  const out = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      out[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}

/* ===== Apply Settings to DOM ===== */
function applySettings() {
  const s = DATA.settings;

  // Dark Mode
  document.body.classList.toggle('dark-mode', s.preferences.darkMode);

  // Compact View
  document.body.classList.toggle('compact-view', s.preferences.compactView);

  // Accent Color
  applyAccentColor(s.preferences.accentColor);

  // Font Size
  applyFontSize(s.preferences.fontSize);

  // Animations
  document.body.style.setProperty('--animation-duration', s.preferences.animations ? '0.3s' : '0s');
  if (!s.preferences.animations) {
    document.body.classList.add('no-animations');
  } else {
    document.body.classList.remove('no-animations');
  }

  // Language (just sets a data attribute for now)
  document.documentElement.lang = s.preferences.language === 'Hindi' ? 'hi' : 
                                   s.preferences.language === 'Spanish' ? 'es' : 'en';
}

function applyAccentColor(color) {
  if (!color) return;
  const root = document.documentElement;
  const darkMode = DATA.settings.preferences.darkMode;
  
  // Compute lighter variant
  const lighter = lightenColor(color, 15);
  
  root.style.setProperty('--accent', color);
  root.style.setProperty('--accent-light', lighter);
  
  // Also update --primary with slight darkening for dark mode
  if (!darkMode) {
    root.style.setProperty('--accent', color);
  }
}

function lightenColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0xff) + amt);
  const B = Math.min(255, (num & 0xff) + amt);
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function applyFontSize(size) {
  const sizes = { small: '14px', medium: '16px', large: '18px' };
  document.documentElement.style.fontSize = sizes[size] || '16px';
}

/* ===== Notification permission ===== */
function requestNotificationPermission() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function sendTestNotification() {
  if (Notification.permission === 'granted') {
    new Notification('Westfield Institute', {
      body: 'Test notification from your portal! 🎓',
      icon: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/svgs/solid/graduation-cap.svg'
    });
    showToast('Test notification sent!', 'success');
  } else {
    showToast('Enable browser notifications first.', 'info');
    requestNotificationPermission();
  }
}

/* ===== Toggle Handlers ===== */
function toggleSetting(el, category, key) {
  el.classList.toggle('active');
  const value = el.classList.contains('active');
  DATA.settings[category][key] = value;
  saveSettings();
  applySettings();
  
  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
  showToast(`${label} ${value ? 'enabled' : 'disabled'}.`, 'success');

  // Special cases
  if (category === 'notifications' && key === 'push' && value) {
    requestNotificationPermission();
  }
  if (category === 'preferences' && key === 'darkMode') {
    // Re-apply accent color for dark mode
    setTimeout(() => applyAccentColor(DATA.settings.preferences.accentColor), 50);
  }
}

/* ===== Settings Tabs ===== */
let currentSettingsTab = 'notifications';

function switchSettingsTab(tab) {
  currentSettingsTab = tab;
  document.querySelectorAll('.settings-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });
  document.querySelectorAll('.settings-panel').forEach(p => {
    p.classList.toggle('active', p.dataset.panel === tab);
  });
  // Update URL hash for deep linking
  history.replaceState(null, '', '#' + tab);
}

/* ===== Accent Color Picker ===== */
function setAccentColor(color, el) {
  DATA.settings.preferences.accentColor = color;
  saveSettings();
  applyAccentColor(color);
  
  document.querySelectorAll('.color-option').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  else {
    const match = document.querySelector(`.color-option[data-color="${color}"]`);
    if (match) match.classList.add('active');
  }
  showToast('Accent color updated.', 'success');
}

/* ===== Font Size Selector ===== */
function setFontSize(size) {
  DATA.settings.preferences.fontSize = size;
  saveSettings();
  applyFontSize(size);
  document.querySelectorAll('.theme-preset[data-size]').forEach(p => {
    p.classList.toggle('active', p.dataset.size === size);
  });
  showToast(`Font size: ${size}`, 'success');
}

/* ===== Language Selector ===== */
function setLanguage(lang) {
  DATA.settings.preferences.language = lang;
  saveSettings();
  applySettings();
  showToast(`Language set to ${lang}`, 'success');
}

/* ===== Theme Presets ===== */
function applyThemePreset(preset) {
  const presets = {
    default: { accentColor: '#1e5fa8', darkMode: false },
    ocean:   { accentColor: '#0891b2', darkMode: false },
    forest:  { accentColor: '#059669', darkMode: false },
    sunset:  { accentColor: '#ea580c', darkMode: false },
    royal:   { accentColor: '#7c3aed', darkMode: false },
    midnight:{ accentColor: '#5ba0f2', darkMode: true },
    rose:    { accentColor: '#e11d48', darkMode: false }
  };
  const p = presets[preset];
  if (!p) return;
  DATA.settings.preferences.accentColor = p.accentColor;
  DATA.settings.preferences.darkMode = p.darkMode;
  saveSettings();
  applySettings();
  document.querySelectorAll('.theme-preset').forEach(el => {
    el.classList.toggle('active', el.dataset.preset === preset);
  });
  // Update toggle switch for dark mode
  const darkToggle = document.querySelector('[data-setting="darkMode"]');
  if (darkToggle) darkToggle.classList.toggle('active', p.darkMode);
  showToast(`Theme: ${preset}`, 'success');
}

/* ===== Security: 2FA ===== */
function toggle2FA(el) {
  el.classList.toggle('active');
  const enabled = el.classList.contains('active');
  DATA.settings.security.twoFactor = enabled;
  saveSettings();
  
  if (enabled) {
    showToast('Two-factor authentication enabled. Check your email for setup.', 'success');
  } else {
    showToast('Two-factor authentication disabled.', 'info');
  }
}

/* ===== Session Timeout ===== */
function setSessionTimeout(value) {
  DATA.settings.security.sessionTimeout = value;
  saveSettings();
  document.getElementById('sessionTimeoutValue').textContent = value + ' min';
  showToast(`Session timeout: ${value} minutes`, 'success');
}

/* ===== Confirmation Modal ===== */
function showConfirmModal(title, message, onConfirm, confirmText = 'Confirm') {
  const existing = document.getElementById('confirmModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'confirmModal';
  modal.className = 'modal-overlay show';
  modal.innerHTML = `
    <div class="modal-box">
      <h3><i class="fas fa-exclamation-triangle" style="color:var(--warning);"></i> ${escapeHtml(title)}</h3>
      <p>${escapeHtml(message)}</p>
      <div class="modal-actions">
        <button class="btn-cancel" onclick="closeConfirmModal()">Cancel</button>
        <button class="btn-confirm" id="confirmModalBtn">${escapeHtml(confirmText)}</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('confirmModalBtn').onclick = () => {
    closeConfirmModal();
    onConfirm();
  };
}

function closeConfirmModal() {
  const modal = document.getElementById('confirmModal');
  if (modal) modal.remove();
}

/* ===== Reset Settings ===== */
function resetAllSettings() {
  showConfirmModal(
    'Reset All Settings?',
    'This will restore all preferences to their default values. Your account data will not be affected.',
    () => {
      DATA.settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      saveSettings();
      applySettings();
      showToast('All settings reset to defaults.', 'success');
      setTimeout(() => location.reload(), 600);
    },
    'Reset'
  );
}

/* ===== Clear Cache ===== */
function clearCache() {
  showConfirmModal(
    'Clear Cache?',
    'This will clear locally cached data. You will remain logged in but may need to reload some content.',
    () => {
      // Keep auth, clear everything else
      const user = sessionStorage.getItem('currentUser');
      const role = sessionStorage.getItem('currentRole');
      const settings = localStorage.getItem(SETTINGS_KEY);
      
      localStorage.clear();
      sessionStorage.clear();
      
      if (user) sessionStorage.setItem('currentUser', user);
      if (role) sessionStorage.setItem('currentRole', role);
      if (settings) localStorage.setItem(SETTINGS_KEY, settings);
      
      showToast('Cache cleared successfully.', 'success');
    },
    'Clear Cache'
  );
}

/* ===== Export Data ===== */
function exportUserData() {
  const session = getCurrentUser();
  if (!session) { showToast('Please login first.', 'error'); return; }
  
  const data = {
    user: session.user,
    role: session.role,
    settings: DATA.settings,
    exportedAt: new Date().toISOString(),
    courses: DATA.courses,
    grades: DATA.grades,
    assignments: DATA.assignments
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `westfield-data-${session.user.id}-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast('Data exported successfully.', 'success');
}

/* ===== Change Password ===== */
function openChangePassword() {
  const modal = document.createElement('div');
  modal.id = 'passwordModal';
  modal.className = 'modal-overlay show';
  modal.innerHTML = `
    <div class="modal-box">
      <h3><i class="fas fa-key"></i> Change Password</h3>
      <div class="input-group" style="margin-top:1rem;">
        <label>Current Password</label>
        <div class="input-field"><i class="fas fa-lock"></i><input type="password" id="curPass" placeholder="Current password"></div>
      </div>
      <div class="input-group">
        <label>New Password</label>
        <div class="input-field"><i class="fas fa-lock"></i><input type="password" id="newPass" placeholder="Min 6 characters"></div>
      </div>
      <div class="input-group">
        <label>Confirm New Password</label>
        <div class="input-field"><i class="fas fa-lock"></i><input type="password" id="confPass" placeholder="Re-enter password"></div>
      </div>
      <div class="modal-actions">
        <button class="btn-cancel" onclick="document.getElementById('passwordModal').remove()">Cancel</button>
        <button class="btn-confirm" id="pwdSubmitBtn" style="background:var(--accent);">Update Password</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  document.getElementById('pwdSubmitBtn').onclick = () => {
    const cur = document.getElementById('curPass').value;
    const nw = document.getElementById('newPass').value;
    const cf = document.getElementById('confPass').value;
    if (!cur || !nw || !cf) { showToast('All fields required.', 'error'); return; }
    if (nw !== cf) { showToast('Passwords do not match.', 'error'); return; }
    if (nw.length < 6) { showToast('Password too short.', 'error'); return; }
    document.getElementById('passwordModal').remove();
    showToast('Password updated successfully.', 'success');
  };
}

/* ===== Delete Account ===== */
function deleteAccount() {
  showConfirmModal(
    'Delete Account?',
    'This action is permanent and cannot be undone. All your data will be lost forever. Are you absolutely sure?',
    () => {
      showToast('Account deletion request submitted. You will be logged out.', 'error');
      setTimeout(() => { logout(); }, 1500);
    },
    'Delete Forever'
  );
}

/* ===== Sign Out All Devices ===== */
function signOutAllDevices() {
  showConfirmModal(
    'Sign Out All Devices?',
    'This will end all active sessions on other devices. You will remain signed in on this device.',
    () => {
      showToast('All other devices have been signed out.', 'success');
    },
    'Sign Out All'
  );
}

/* ===== Render Settings Page ===== */
function renderSettingsPage() {
  const s = DATA.settings;
  const session = getCurrentUser();
  const user = session ? session.user : DATA.student;

  const colorOptions = [
    { color: '#1e5fa8', name: 'Blue' },
    { color: '#0891b2', name: 'Ocean' },
    { color: '#059669', name: 'Forest' },
    { color: '#ea580c', name: 'Sunset' },
    { color: '#7c3aed', name: 'Royal' },
    { color: '#e11d48', name: 'Rose' },
    { color: '#0d9488', name: 'Teal' },
    { color: '#c77700', name: 'Amber' }
  ];

  const html = `
    <div class="page-header">
      <h2><i class="fas fa-cog"></i> Settings</h2>
      <p>Manage your account preferences, notifications, privacy, and security.</p>
    </div>

    <div class="settings-tabs">
      <button class="settings-tab active" data-tab="notifications" onclick="switchSettingsTab('notifications')">
        <i class="fas fa-bell"></i> Notifications
      </button>
      <button class="settings-tab" data-tab="privacy" onclick="switchSettingsTab('privacy')">
        <i class="fas fa-shield-alt"></i> Privacy
      </button>
      <button class="settings-tab" data-tab="appearance" onclick="switchSettingsTab('appearance')">
        <i class="fas fa-palette"></i> Appearance
      </button>
      <button class="settings-tab" data-tab="security" onclick="switchSettingsTab('security')">
        <i class="fas fa-lock"></i> Security
      </button>
      <button class="settings-tab" data-tab="account" onclick="switchSettingsTab('account')">
        <i class="fas fa-user-cog"></i> Account
      </button>
    </div>

    <!-- NOTIFICATIONS PANEL -->
    <div class="settings-panel active" data-panel="notifications">
      <div class="settings-grid">
        <div class="settings-card">
          <h3><i class="fas fa-envelope"></i> Communication Channels</h3>
          <div class="setting-item">
            <div class="setting-info"><h4>Email Notifications</h4><p>Receive updates via email</p></div>
            <div class="toggle-switch ${s.notifications.email ? 'active' : ''}" data-setting="email" onclick="toggleSetting(this, 'notifications', 'email')"></div>
          </div>
          <div class="setting-item">
            <div class="setting-info"><h4>Push Notifications</h4><p>Browser push alerts</p></div>
            <div class="toggle-switch ${s.notifications.push ? 'active' : ''}" data-setting="push" onclick="toggleSetting(this, 'notifications', 'push')"></div>
          </div>
          <div class="setting-item">
            <div class="setting-info"><h4>SMS Notifications</h4><p>Text message alerts</p></div>
            <div class="toggle-switch ${s.notifications.sms ? 'active' : ''}" data-setting="sms" onclick="toggleSetting(this, 'notifications', 'sms')"></div>
          </div>
          <div class="setting-item">
            <div class="setting-info"><h4>Sound Alerts</h4><p>Play sound for notifications</p></div>
            <div class="toggle-switch ${s.notifications.soundAlerts ? 'active' : ''}" data-setting="soundAlerts" onclick="toggleSetting(this, 'notifications', 'soundAlerts')"></div>
          </div>
        </div>

        <div class="settings-card">
          <h3><i class="fas fa-tasks"></i> What to Notify</h3>
          <div class="setting-item">
            <div class="setting-info"><h4>Announcements</h4><p>Campus-wide announcements</p></div>
            <div class="toggle-switch ${s.notifications.announcements ? 'active' : ''}" onclick="toggleSetting(this, 'notifications', 'announcements')"></div>
          </div>
          <div class="setting-item">
            <div class="setting-info"><h4>Assignment Reminders</h4><p>Deadline reminders</p></div>
            <div class="toggle-switch ${s.notifications.assignments ? 'active' : ''}" onclick="toggleSetting(this, 'notifications', 'assignments')"></div>
          </div>
          <div class="setting-item">
            <div class="setting-info"><h4>Grade Updates</h4><p>Notify when grades posted</p></div>
            <div class="toggle-switch ${s.notifications.grades ? 'active' : ''}" onclick="toggleSetting(this, 'notifications', 'grades')"></div>
          </div>
          <div class="setting-item">
            <div class="setting-info"><h4>Events</h4><p>Campus event reminders</p></div>
            <div class="toggle-switch ${s.notifications.events ? 'active' : ''}" onclick="toggleSetting(this, 'notifications', 'events')"></div>
          </div>
          <div class="setting-item">
            <div class="setting-info"><h4>Weekly Digest</h4><p>Summary email each week</p></div>
            <div class="toggle-switch ${s.notifications.weeklyDigest ? 'active' : ''}" onclick="toggleSetting(this, 'notifications', 'weeklyDigest')"></div>
          </div>
        </div>
      </div>
      <div style="margin-top:1.3rem;">
        <button class="btn-secondary" onclick="sendTestNotification()">
          <i class="fas fa-paper-plane"></i> Send Test Notification
        </button>
      </div>
    </div>

    <!-- PRIVACY PANEL -->
    <div class="settings-panel" data-panel="privacy">
      <div class="settings-grid">
        <div class="settings-card">
          <h3><i class="fas fa-eye"></i> Profile Visibility</h3>
          <div class="setting-item">
            <div class="setting-info"><h4>Show Profile</h4><p>Visible to other students</p></div>
            <div class="toggle-switch ${s.privacy.showProfile ? 'active' : ''}" onclick="toggleSetting(this, 'privacy', 'showProfile')"></div>
          </div>
          <div class="setting-item">
            <div class="setting-info"><h4>Show Grades</h4><p>Public grade visibility</p></div>
            <div class="toggle-switch ${s.privacy.showGrades ? 'active' : ''}" onclick="toggleSetting(this, 'privacy', 'showGrades')"></div>
          </div>
          <div class="setting-item">
            <div class="setting-info"><h4>Show Email</h4><p>Display email on profile</p></div>
            <div class="toggle-switch ${s.privacy.showEmail ? 'active' : ''}" onclick="toggleSetting(this, 'privacy', 'showEmail')"></div>
          </div>
          <div class="setting-item">
            <div class="setting-info"><h4>Show Phone</h4><p>Display phone number</p></div>
            <div class="toggle-switch ${s.privacy.showPhone ? 'active' : ''}" onclick="toggleSetting(this, 'privacy', 'showPhone')"></div>
          </div>
        </div>

        <div class="settings-card">
          <h3><i class="fas fa-user-secret"></i> Discoverability</h3>
          <div class="setting-item">
            <div class="setting-info"><h4>Searchable</h4><p>Let others find you by name</p></div>
            <div class="toggle-switch ${s.privacy.searchable ? 'active' : ''}" onclick="toggleSetting(this, 'privacy', 'searchable')"></div>
          </div>
          <div class="setting-item">
            <div class="setting-info"><h4>Activity Status</h4><p>Show when you're online</p></div>
            <div class="toggle-switch ${s.privacy.activityStatus ? 'active' : ''}" onclick="toggleSetting(this, 'privacy', 'activityStatus')"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- APPEARANCE PANEL -->
    <div class="settings-panel" data-panel="appearance">
      <div class="settings-grid">
        <div class="settings-card">
          <h3><i class="fas fa-moon"></i> Display Mode</h3>
          <div class="setting-item">
            <div class="setting-info"><h4>Dark Mode</h4><p>Switch to dark theme</p></div>
            <div class="toggle-switch ${s.preferences.darkMode ? 'active' : ''}" onclick="toggleSetting(this, 'preferences', 'darkMode')"></div>
          </div>
          <div class="setting-item">
            <div class="setting-info"><h4>Compact View</h4><p>Denser information layout</p></div>
            <div class="toggle-switch ${s.preferences.compactView ? 'active' : ''}" onclick="toggleSetting(this, 'preferences', 'compactView')"></div>
          </div>
          <div class="setting-item">
            <div class="setting-info"><h4>Animations</h4><p>Enable smooth transitions</p></div>
            <div class="toggle-switch ${s.preferences.animations ? 'active' : ''}" onclick="toggleSetting(this, 'preferences', 'animations')"></div>
          </div>
          <div class="setting-item">
            <div class="setting-info"><h4>Auto-play Media</h4><p>Videos play automatically</p></div>
            <div class="toggle-switch ${s.preferences.autoPlay ? 'active' : ''}" onclick="toggleSetting(this, 'preferences', 'autoPlay')"></div>
          </div>
        </div>

        <div class="settings-card">
          <h3><i class="fas fa-paint-brush"></i> Accent Color</h3>
          <p style="font-size:0.78rem;color:var(--text-light);margin-bottom:0.5rem;">Choose your theme color</p>
          <div class="color-options">
            ${colorOptions.map(c => `
              <div class="color-option ${s.preferences.accentColor === c.color ? 'active' : ''}" 
                   style="background:${c.color};" 
                   data-color="${c.color}"
                   title="${c.name}"
                   onclick="setAccentColor('${c.color}', this)"></div>
            `).join('')}
          </div>
        </div>

        <div class="settings-card">
          <h3><i class="fas fa-text-height"></i> Font Size</h3>
          <div class="theme-presets">
            <button class="theme-preset ${s.preferences.fontSize === 'small' ? 'active' : ''}" data-size="small" onclick="setFontSize('small')">Small</button>
            <button class="theme-preset ${s.preferences.fontSize === 'medium' ? 'active' : ''}" data-size="medium" onclick="setFontSize('medium')">Medium</button>
            <button class="theme-preset ${s.preferences.fontSize === 'large' ? 'active' : ''}" data-size="large" onclick="setFontSize('large')">Large</button>
          </div>
        </div>

        <div class="settings-card">
          <h3><i class="fas fa-globe"></i> Language</h3>
          <div class="setting-item">
            <div class="setting-info"><h4>Interface Language</h4><p>Change display language</p></div>
            <select class="language-select" onchange="setLanguage(this.value)">
              <option ${s.preferences.language === 'English' ? 'selected' : ''}>English</option>
              <option ${s.preferences.language === 'Hindi' ? 'selected' : ''}>Hindi</option>
              <option ${s.preferences.language === 'Spanish' ? 'selected' : ''}>Spanish</option>
            </select>
          </div>
        </div>

        <div class="settings-card">
          <h3><i class="fas fa-magic"></i> Quick Themes</h3>
          <p style="font-size:0.78rem;color:var(--text-light);margin-bottom:0.5rem;">One-click theme presets</p>
          <div class="theme-presets">
            <button class="theme-preset" data-preset="default" onclick="applyThemePreset('default')">
              <span class="preset-dot" style="background:#1e5fa8;"></span> Default
            </button>
            <button class="theme-preset" data-preset="ocean" onclick="applyThemePreset('ocean')">
              <span class="preset-dot" style="background:#0891b2;"></span> Ocean
            </button>
            <button class="theme-preset" data-preset="forest" onclick="applyThemePreset('forest')">
              <span class="preset-dot" style="background:#059669;"></span> Forest
            </button>
            <button class="theme-preset" data-preset="sunset" onclick="applyThemePreset('sunset')">
              <span class="preset-dot" style="background:#ea580c;"></span> Sunset
            </button>
            <button class="theme-preset" data-preset="royal" onclick="applyThemePreset('royal')">
              <span class="preset-dot" style="background:#7c3aed;"></span> Royal
            </button>
            <button class="theme-preset" data-preset="midnight" onclick="applyThemePreset('midnight')">
              <span class="preset-dot" style="background:#5ba0f2;"></span> Midnight
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- SECURITY PANEL -->
    <div class="settings-panel" data-panel="security">
      <div class="settings-grid">
        <div class="settings-card">
          <h3><i class="fas fa-shield-alt"></i> Account Security</h3>
          <div class="setting-item">
            <div class="setting-info"><h4>Two-Factor Authentication</h4><p>Extra layer of security</p></div>
            <div class="toggle-switch ${s.security.twoFactor ? 'active' : ''}" onclick="toggle2FA(this)"></div>
          </div>
          <div class="setting-item">
            <div class="setting-info"><h4>Login Alerts</h4><p>Email me on new device login</p></div>
            <div class="toggle-switch ${s.security.loginAlerts ? 'active' : ''}" onclick="toggleSetting(this, 'security', 'loginAlerts')"></div>
          </div>
          <div class="setting-item">
            <div class="setting-info"><h4>Session Timeout</h4><p>Auto-logout after inactivity</p></div>
            <div class="setting-value" id="sessionTimeoutValue">${s.security.sessionTimeout} min</div>
          </div>
          <div class="range-input" style="margin-top:0.5rem;">
            <input type="range" min="5" max="120" step="5" value="${s.security.sessionTimeout}" 
                   oninput="document.getElementById('sessionTimeoutValue').textContent = this.value + ' min';"
                   onchange="setSessionTimeout(this.value)">
          </div>
        </div>

        <div class="settings-card">
          <h3><i class="fas fa-key"></i> Password</h3>
          <p style="font-size:0.78rem;color:var(--text-light);margin-bottom:1rem;">Last changed: 2 months ago</p>
          <button class="btn-primary" onclick="openChangePassword()">
            <i class="fas fa-lock"></i> Change Password
          </button>
        </div>

        <div class="settings-card">
          <h3><i class="fas fa-laptop"></i> Active Devices</h3>
          <div class="device-item">
            <div class="device-icon"><i class="fas fa-desktop"></i></div>
            <div class="device-info"><h4>Current Browser</h4><p>Windows · Just now</p></div>
            <span class="device-current">This device</span>
          </div>
          <div class="device-item">
            <div class="device-icon"><i class="fas fa-mobile-alt"></i></div>
            <div class="device-info"><h4>Mobile App</h4><p>iPhone · 2 days ago</p></div>
            <button class="btn-secondary" style="padding:0.35rem 0.8rem;font-size:0.7rem;" onclick="showToast('Device signed out.', 'success')">Sign Out</button>
          </div>
          <div style="margin-top:1rem;">
            <button class="btn-secondary" onclick="signOutAllDevices()">
              <i class="fas fa-sign-out-alt"></i> Sign Out All Other Devices
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ACCOUNT PANEL -->
    <div class="settings-card">
  <h3><i class="fas fa-database"></i> Storage Management</h3>
  <div class="session-info" style="margin-bottom:1rem;">
    <p style="margin-bottom:0.5rem;"><strong>Used:</strong> <span id="storageUsed">${Storage.getSize()} KB</span></p>
    <p style="margin-bottom:0.5rem;"><strong>Teacher Assignments:</strong> ${DATA.teacherAssignments.length} items</p>
    <p style="margin-bottom:0.5rem;"><strong>Teacher Courses:</strong> ${DATA.teacherCourses.length} items</p>
    <p style="margin-bottom:0.5rem;"><strong>Materials:</strong> ${DATA.teacherMaterials.length} items</p>
    <p><strong>Last Saved:</strong> ${new Date().toLocaleString()}</p>
  </div>
  <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
    <button class="btn-secondary" style="padding:0.5rem 1rem;font-size:0.78rem;" onclick="exportAllTeacherData()">
      <i class="fas fa-download"></i> Export All
    </button>
    <button class="btn-secondary" style="padding:0.5rem 1rem;font-size:0.78rem;" onclick="showStorageDetails()">
      <i class="fas fa-info-circle"></i> View Details
    </button>
    <button class="btn-danger" style="padding:0.5rem 1rem;font-size:0.78rem;" onclick="resetTeacherData()">
      <i class="fas fa-redo"></i> Reset Data
    </button>
  </div>
</div>

        <div class="settings-card">
          <h3><i class="fas fa-download"></i> Data & Privacy</h3>
          <div class="setting-item">
            <div class="setting-info"><h4>Download Your Data</h4><p>Export all your account data as JSON</p></div>
            <button class="btn-secondary" style="padding:0.5rem 1rem;font-size:0.78rem;" onclick="exportUserData()">
              <i class="fas fa-download"></i> Export
            </button>
          </div>
          <div class="setting-item">
            <div class="setting-info"><h4>Clear Cache</h4><p>Remove locally stored data</p></div>
            <button class="btn-secondary" style="padding:0.5rem 1rem;font-size:0.78rem;" onclick="clearCache()">
              <i class="fas fa-broom"></i> Clear
            </button>
          </div>
          <div class="setting-item">
            <div class="setting-info"><h4>Reset Settings</h4><p>Restore all preferences to defaults</p></div>
            <button class="btn-secondary" style="padding:0.5rem 1rem;font-size:0.78rem;" onclick="resetAllSettings()">
              <i class="fas fa-redo"></i> Reset
            </button>
          </div>
        </div>

        <div class="settings-card danger-zone">
          <h3><i class="fas fa-exclamation-triangle"></i> Danger Zone</h3>
          <p>Once you delete your account, there is no going back. Please be certain.</p>
          <button class="btn-danger" onclick="deleteAccount()">
            <i class="fas fa-trash"></i> Delete My Account
          </button>
        </div>
      </div>
    </div>
  `;

  return html;
}

/* ===== Initialize Settings Page ===== */
function initSettingsPage() {
  // Load settings from storage
  DATA.settings = loadSettings();
  applySettings();
  
  // Render into #root
  const root = document.getElementById('root');
  if (!root) return;
  
  const content = renderSettingsPage();
  buildLayout('settings', content);
  
  // Restore active tab from hash
  const hash = window.location.hash.replace('#', '');
  if (hash && ['notifications', 'privacy', 'appearance', 'security', 'account'].includes(hash)) {
    setTimeout(() => switchSettingsTab(hash), 50);
  }
}

/* ===== Initialize settings on any page ===== */
function initGlobalSettings() {
  DATA.settings = loadSettings();
  applySettings();
}

// Auto-apply on script load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    DATA.settings = loadSettings();
    applySettings();
  });
}
window.attendanceToday = window.attendanceToday || Storage.load(STORAGE_KEYS.TEACHER_ATTENDANCE, {});
/* ============================================================
   TEACHER PROFILE - EDITING
   ============================================================ */

function openEditTeacherProfile() {
  const t = DATA.teacher;
  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.id = 'editProfileModal';
  modal.innerHTML = `
    <div class="modal-box" style="max-width:600px;">
      <h3><i class="fas fa-user-edit"></i> Edit Profile</h3>
      
      <div class="input-row" style="margin-top:1rem;">
        <div class="input-group">
          <label>First Name</label>
          <div class="input-field"><i class="fas fa-user"></i><input type="text" id="editFirstName" value="${escapeHtml(t.firstName)}"></div>
        </div>
        <div class="input-group">
          <label>Last Name</label>
          <div class="input-field"><i class="fas fa-user"></i><input type="text" id="editLastName" value="${escapeHtml(t.lastName)}"></div>
        </div>
      </div>

      <div class="input-group">
        <label>Email</label>
        <div class="input-field"><i class="fas fa-envelope"></i><input type="email" id="editEmail" value="${escapeHtml(t.email)}"></div>
      </div>

      <div class="input-row">
        <div class="input-group">
          <label>Phone</label>
          <div class="input-field"><i class="fas fa-phone"></i><input type="tel" id="editPhone" value="${escapeHtml(t.phone)}"></div>
        </div>
        <div class="input-group">
          <label>Office</label>
          <div class="input-field"><i class="fas fa-door-open"></i><input type="text" id="editOffice" value="${escapeHtml(t.office)}"></div>
        </div>
      </div>

      <div class="input-group">
        <label>Office Hours</label>
        <div class="input-field"><i class="fas fa-clock"></i><input type="text" id="editOfficeHours" value="${escapeHtml(t.officeHours)}"></div>
      </div>

      <div class="input-group">
        <label>Specialization</label>
        <div class="input-field"><i class="fas fa-graduation-cap"></i><input type="text" id="editSpecialization" value="${escapeHtml(t.specialization)}"></div>
      </div>

      <div class="modal-actions" style="margin-top:1.3rem;">
        <button class="btn-cancel" onclick="document.getElementById('editProfileModal').remove()">Cancel</button>
        <button class="btn-confirm" style="background:var(--accent);" onclick="saveTeacherProfileChanges()">
          <i class="fas fa-save"></i> Save Changes
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function saveTeacherProfileChanges() {
  DATA.teacher.firstName = document.getElementById('editFirstName').value.trim();
  DATA.teacher.lastName = document.getElementById('editLastName').value.trim();
  DATA.teacher.email = document.getElementById('editEmail').value.trim();
  DATA.teacher.phone = document.getElementById('editPhone').value.trim();
  DATA.teacher.office = document.getElementById('editOffice').value.trim();
  DATA.teacher.officeHours = document.getElementById('editOfficeHours').value.trim();
  DATA.teacher.specialization = document.getElementById('editSpecialization').value.trim();
  DATA.teacher.initials = (DATA.teacher.firstName[0] + DATA.teacher.lastName[0]).toUpperCase();

  saveTeacherProfile();  // ← SAVE

  // Update current session if teacher is logged in
  const session = getCurrentUser();
  if (session && session.role === 'teacher') {
    session.user = { ...session.user, ...DATA.teacher };
    sessionStorage.setItem('currentUser', JSON.stringify(session.user));
  }

  document.getElementById('editProfileModal').remove();
  showToast('Profile updated successfully!', 'success');
  setTimeout(() => location.reload(), 500);
}
/* ============================================================
   DATA MANAGEMENT HELPERS
   ============================================================ */

function exportAllTeacherData() {
  const data = {
    version: DATA_VERSION,
    exportedAt: new Date().toISOString(),
    teacher: DATA.teacher,
    teacherAssignments: DATA.teacherAssignments,
    teacherCourses: DATA.teacherCourses,
    teacherMaterials: DATA.teacherMaterials,
    teacherAnnouncements: DATA.teacherAnnouncements,
    teacherMessages: DATA.teacherMessages,
    attendanceToday: window.attendanceToday || {},
    attendanceHistory: Storage.load('westfield_attendance_history', [])
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `westfield-teacher-data-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('All teacher data exported!', 'success');
}

function showStorageDetails() {
  const details = Object.entries(STORAGE_KEYS).map(([name, key]) => {
    const raw = localStorage.getItem(key);
    const size = raw ? (raw.length / 1024).toFixed(2) : '0';
    const exists = raw !== null ? '✅' : '❌';
    return `<tr><td style="padding:0.5rem;font-size:0.78rem;">${name}</td><td style="padding:0.5rem;font-size:0.78rem;text-align:right;">${size} KB</td><td style="padding:0.5rem;">${exists}</td></tr>`;
  }).join('');
  
  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.id = 'storageDetailsModal';
  modal.innerHTML = `
    <div class="modal-box" style="max-width:600px;">
      <h3><i class="fas fa-database"></i> Storage Details</h3>
      <p style="font-size:0.82rem;color:var(--text-light);margin-bottom:1rem;">Total: ${Storage.getSize()} KB</p>
      <table style="width:100%;border-collapse:collapse;">
        <thead><tr><th style="text-align:left;padding:0.5rem;font-size:0.72rem;color:var(--text-light);">Key</th><th style="text-align:right;padding:0.5rem;font-size:0.72rem;color:var(--text-light);">Size</th><th style="padding:0.5rem;font-size:0.72rem;color:var(--text-light);">Status</th></tr></thead>
        <tbody>${details}</tbody>
      </table>
      <div class="modal-actions" style="margin-top:1.3rem;">
        <button class="btn-cancel" onclick="document.getElementById('storageDetailsModal').remove()">Close</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function resetTeacherData() {
  showConfirmModal(
    'Reset All Teacher Data?',
    'This will delete all your assignments, courses, materials, and settings, restoring defaults. This cannot be undone!',
    () => {
      Object.values(STORAGE_KEYS).forEach(k => {
        if (k.includes('teacher')) localStorage.removeItem(k);
      });
      showToast('Teacher data reset. Reloading...', 'success');
      setTimeout(() => location.reload(), 800);
    },
    'Reset Everything'
  );
}

/* Auto-save on unload (safety net) */
window.addEventListener('beforeunload', () => {
  try {
    saveTeacherAssignments();
    saveTeacherCourses();
    saveTeacherMaterials();
    saveTeacherAnnouncements();
    saveTeacherProfile();
    saveTeacherMessages();
    saveTeacherAttendance();
    saveStudentAssignments();
  } catch (e) {
    console.warn('Auto-save failed:', e);
  }
});
/* ===== Initialize all data from storage ===== */
initializeAllData();

Router.init();

window.Router = Router;