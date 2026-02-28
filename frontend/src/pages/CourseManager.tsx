import { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/Crud.css';

interface Teacher {
  teacher_id: number;
  first_name: string;
  last_name: string;
}

interface Course {
  course_id?: number;
  description: string;
  units: number;
  teacher?: number | null;
}

const CourseManager = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course>({
    description: '',
    units: 3,
    teacher: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesData, teachersData] = await Promise.all([
        api.get('courses'),
        api.get('teachers'),
      ]);
      setCourses(coursesData);
      setTeachers(teachersData);
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
    setCurrentCourse({ 
      ...currentCourse, 
      [name]: name === 'units' ? parseInt(value) : name === 'teacher' ? (value ? parseInt(value) : null) : value 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentCourse.course_id) {
        await api.put('courses', currentCourse.course_id, currentCourse);
      } else {
        await api.post('courses', currentCourse);
      }
      setCurrentCourse({
        description: '',
        units: 3,
        teacher: null,
      });
      setIsEditing(false);
      fetchData();
    } catch (err) {
      setError('Failed to save course');
      console.error(err);
    }
  };

  const handleEdit = (course: Course) => {
    setCurrentCourse(course);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete('courses', id);
        fetchData();
      } catch (err) {
        setError('Failed to delete course');
        console.error(err);
      }
    }
  };

  const getTeacherName = (teacherId?: number | null) => {
    if (!teacherId) return 'None';
    const teacher = teachers.find(t => t.teacher_id === teacherId);
    return teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Unknown';
  };

  if (loading && courses.length === 0) return <div>Loading...</div>;

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h2>Course Management</h2>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <div className="form-container">
        <h3>{isEditing ? 'Edit Course' : 'Add New Course'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Description</label>
            <input
              name="description"
              value={currentCourse.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Units</label>
            <input
              type="number"
              name="units"
              value={currentCourse.units}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Teacher</label>
            <select 
              name="teacher" 
              value={currentCourse.teacher || ''} 
              onChange={handleInputChange as any}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', backgroundColor: '#1a1a1a', color: 'white' }}
            >
              <option value="">None</option>
              {teachers.map(teacher => (
                <option key={teacher.teacher_id} value={teacher.teacher_id}>
                  {teacher.first_name} {teacher.last_name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-save">
            {isEditing ? 'Update' : 'Save'}
          </button>
          {isEditing && (
            <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <table className="crud-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Units</th>
            <th>Teacher</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.course_id}>
              <td>{course.description}</td>
              <td>{course.units}</td>
              <td>{getTeacherName(course.teacher)}</td>
              <td>
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(course)}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => course.course_id && handleDelete(course.course_id)}
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

export default CourseManager;
