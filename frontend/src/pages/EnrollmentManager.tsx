import { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/Crud.css';

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

  const fetchData = async () => {
    try {
      setLoading(true);
      const [enrollmentsData, studentsData, coursesData] = await Promise.all([
        api.get('enrollments'),
        api.get('students'),
        api.get('courses'),
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentEnrollment({ 
      ...currentEnrollment, 
      [name]: (name === 'student' || name === 'course' || name === 'grade') 
        ? (value ? parseInt(value) : null) 
        : value 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentEnrollment.enrollment_id) {
        await api.put('enrollments', currentEnrollment.enrollment_id, currentEnrollment);
      } else {
        await api.post('enrollments', currentEnrollment);
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

  if (loading && enrollments.length === 0) return <div>Loading...</div>;

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h2>Enrollment Management</h2>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <div className="form-container">
        <h3>{isEditing ? 'Edit Enrollment' : 'Add New Enrollment'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Student</label>
            <select 
              name="student" 
              value={currentEnrollment.student} 
              onChange={handleInputChange as any}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', backgroundColor: '#1a1a1a', color: 'white' }}
              required
            >
              {students.map(student => (
                <option key={student.student_id} value={student.student_id}>
                  {student.first_name} {student.last_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Course</label>
            <select 
              name="course" 
              value={currentEnrollment.course} 
              onChange={handleInputChange as any}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', backgroundColor: '#1a1a1a', color: 'white' }}
              required
            >
              {courses.map(course => (
                <option key={course.course_id} value={course.course_id}>
                  {course.description}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Enrollment Date</label>
            <input
              type="date"
              name="enrollment_date"
              value={currentEnrollment.enrollment_date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Grade (Optional)</label>
            <input
              type="number"
              name="grade"
              value={currentEnrollment.grade || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <input
              name="status"
              value={currentEnrollment.status}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="btn-save" disabled={students.length === 0 || courses.length === 0}>
            {isEditing ? 'Update' : 'Save'}
          </button>
          {isEditing && (
            <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          )}
          {(students.length === 0 || courses.length === 0) && (
            <p style={{ color: 'orange', fontSize: '0.8em' }}>
              You need at least one student and one course to create an enrollment.
            </p>
          )}
        </form>
      </div>

      <table className="crud-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Course</th>
            <th>Date</th>
            <th>Grade</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((enrollment) => (
            <tr key={enrollment.enrollment_id}>
              <td>{getStudentName(enrollment.student)}</td>
              <td>{getCourseDescription(enrollment.course)}</td>
              <td>{enrollment.enrollment_date}</td>
              <td>{enrollment.grade ?? 'N/A'}</td>
              <td>{enrollment.status}</td>
              <td>
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(enrollment)}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => enrollment.enrollment_id && handleDelete(enrollment.enrollment_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EnrollmentManager;
