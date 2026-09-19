require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Student = require('./models/Student');
const Mentor = require('./models/Mentor');
const Goal = require('./models/Goal');
const Concern = require('./models/Concern');
const Meeting = require('./models/Meeting');
const Feedback = require('./models/Feedback');
const Progress = require('./models/Progress');

const seed = async () => {
  await connectDB();
  await Promise.all([User.deleteMany(), Student.deleteMany(), Mentor.deleteMany(), Goal.deleteMany(), Concern.deleteMany(), Meeting.deleteMany(), Feedback.deleteMany(), Progress.deleteMany()]);
  const users = await User.create([
    { name: 'Aisha Student', email: 'aisha@example.com', password: 'Password123', role: 'student' },
    { name: 'Ravi Student', email: 'ravi@example.com', password: 'Password123', role: 'student' },
    { name: 'Dr. Meera Mentor', email: 'meera@example.com', password: 'Password123', role: 'mentor' },
    { name: 'Prof. Arjun Mentor', email: 'arjun@example.com', password: 'Password123', role: 'mentor' }
  ]);
  const mentors = await Mentor.create([
    { user: users[2]._id, employeeId: 'MEN-001', department: 'Computer Science', designation: 'Assistant Professor', specialization: 'Web Development' },
    { user: users[3]._id, employeeId: 'MEN-002', department: 'Information Technology', designation: 'Professor', specialization: 'Data Science' }
  ]);
  const students = await Student.create([
    { user: users[0]._id, studentId: 'STU-001', department: 'Computer Science', semester: 5, academicYear: '2025-26', mentor: mentors[0]._id },
    { user: users[1]._id, studentId: 'STU-002', department: 'Information Technology', semester: 3, academicYear: '2025-26', mentor: mentors[1]._id }
  ]);
  const meeting = await Meeting.create({ student: students[0]._id, mentor: mentors[0]._id, date: new Date('2026-10-05'), startTime: '10:00', endTime: '11:00', type: 'academic', purpose: 'Semester project planning', status: 'approved' });
  await Promise.all([
    Goal.create({ student: students[0]._id, title: 'Complete REST API project', description: 'Build and document the project API.', category: 'Academic', deadline: new Date('2026-12-01'), status: 'in_progress', progressPercentage: 60 }),
    Goal.create({ student: students[1]._id, title: 'Learn data visualization', category: 'Career', deadline: new Date('2026-11-15'), progressPercentage: 20 }),
    Concern.create({ student: students[0]._id, mentor: mentors[0]._id, title: 'Need project feedback', description: 'Please review the initial architecture.', category: 'Academic' }),
    Feedback.create({ student: students[0]._id, mentor: mentors[0]._id, meeting: meeting._id, rating: 4, comments: 'Good progress on the project.', strengths: 'Consistent effort', areasForImprovement: 'Add more tests', recommendations: 'Practice API testing.' }),
    Progress.create({ student: students[0]._id, academicProgress: 78, attendancePercentage: 92, goalCompletionPercentage: 60, overallProgress: 76, remarks: 'On track.', updatedBy: users[2]._id }),
    Progress.create({ student: students[1]._id, academicProgress: 70, attendancePercentage: 88, goalCompletionPercentage: 20, overallProgress: 62, remarks: 'Needs regular goal reviews.', updatedBy: users[3]._id })
  ]);
  console.log('Seed data created successfully');
  process.exit(0);
};
seed().catch((error) => { console.error(error); process.exit(1); });
