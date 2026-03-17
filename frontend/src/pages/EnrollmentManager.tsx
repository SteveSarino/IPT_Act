import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { Pencil, Trash2, Plus, X, Save, Loader2 } from 'lucide-react';

interface Student {
  student_id: number;
  first_name: string;
  last_name: string;
}

interface Course {
  course_id: number;
  description: string;
}

interface Enrollment {
  enrollment_id?: number;
  student: number;
  course: number;
  enrollment_date: string;
  grade?: number | null;
  status: string;
}

const EnrollmentManager = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEnrollment, setCurrentEnrollment] = useState<Enrollment>({
    student: 0,
    course: 0,
    enrollment_date: new Date().toISOString().split('T')[0],
    grade: null,
    status: 'Enrolled',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [enrollmentsData, studentsData, coursesData] = await Promise.all([
        api.get<Enrollment[]>('enrollments'),
        api.get<Student[]>('students'),
        api.get<Course[]>('courses'),
      ]);
      setEnrollments(enrollmentsData);
      setStudents(studentsData);
      setCourses(coursesData);
      
      if (studentsData.length > 0 && coursesData.length > 0 && !isEditing) {
        setCurrentEnrollment(prev => ({
          ...prev,
          student: studentsData[0].student_id,
          course: coursesData[0].course_id
        }));
      } else if (studentsData.length === 0 || coursesData.length === 0) {
        setError('Please add students and courses before managing enrollments.');
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [isEditing]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentEnrollment(prev => ({ 
      ...prev, 
      [name]: (name === 'student' || name === 'course' || name === 'grade') 
        ? (value ? parseInt(value) : null) 
        : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentEnrollment.enrollment_id) {
        await api.put<Enrollment>('enrollments', currentEnrollment.enrollment_id, currentEnrollment);
      } else {
        await api.post<Enrollment>('enrollments', currentEnrollment);
      }
      setCurrentEnrollment({
        student: students[0]?.student_id || 0,
        course: courses[0]?.course_id || 0,
        enrollment_date: new Date().toISOString().split('T')[0],
        grade: null,
        status: 'Enrolled',
      });
      setIsEditing(false);
      fetchData();
    } catch (err) {
      setError('Failed to save enrollment');
      console.error(err);
    }
  };

  const handleEdit = (enrollment: Enrollment) => {
    setCurrentEnrollment(enrollment);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this enrollment?')) {
      try {
        await api.delete('enrollments', id);
        fetchData();
      } catch (err) {
        setError('Failed to delete enrollment');
        console.error(err);
      }
    }
  };

  const getStudentName = (studentId: number) => {
    const student = students.find(s => s.student_id === studentId);
    return student ? `${student.first_name} ${student.last_name}` : 'Unknown';
  };

  const getCourseDescription = (courseId: number) => {
    const course = courses.find(c => c.course_id === courseId);
    return course ? course.description : 'Unknown';
  };

  if (loading && enrollments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-indigo-600">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Enrollment Management</h2>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {/* Form Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            {isEditing ? <Pencil size={18} /> : <Plus size={18} />}
            {isEditing ? 'Edit Enrollment' : 'Add New Enrollment'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Student</label>
              <select 
                name="student" 
                value={currentEnrollment.student} 
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              >
                {students.map(student => (
                  <option key={student.student_id} value={student.student_id}>
                    {student.first_name} {student.last_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Course</label>
              <select 
                name="course" 
                value={currentEnrollment.course} 
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              >
                {courses.map(course => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.description}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Enrollment Date</label>
              <input
                type="date"
                name="enrollment_date"
                value={currentEnrollment.enrollment_date}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Grade (Optional)</label>
              <input
                type="number"
                name="grade"
                value={currentEnrollment.grade || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                placeholder="1.0 - 5.0"
              />
            </div>
            <div className="space-y-2 md:col-span-2 lg:col-span-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <input
                name="status"
                value={currentEnrollment.status}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                placeholder="Enrolled"
              />
            </div>
          </div>
          
          <div className="mt-8 flex gap-3 justify-end items-center">
            {(students.length === 0 || courses.length === 0) && (
              <p className="text-amber-600 text-sm mr-auto">
                You need at least one student and one course to create an enrollment.
              </p>
            )}
            {isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                <X size={18} /> Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={students.length === 0 || courses.length === 0}
              className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm shadow-indigo-500/20 transition-all transform active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} /> {isEditing ? 'Update Enrollment' : 'Save Enrollment'}
            </button>
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {enrollments.map((enrollment) => (
                <tr key={enrollment.enrollment_id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{getStudentName(enrollment.student)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{getCourseDescription(enrollment.course)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{enrollment.enrollment_date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {enrollment.grade ? (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        enrollment.grade <= 3.0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {enrollment.grade}
                      </span>
                    ) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 text-xs font-medium">
                      {enrollment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(enrollment)}
                      className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => enrollment.enrollment_id && handleDelete(enrollment.enrollment_id)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {enrollments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No enrollments found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentManager;
