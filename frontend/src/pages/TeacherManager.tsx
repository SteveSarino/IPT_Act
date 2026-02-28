import { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../styles/Crud.css';

interface Teacher {
  teacher_id?: number;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
}

const TeacherManager = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher>({
    first_name: '',
    last_name: '',
    email: '',
    department: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const data = await api.get('teachers');
      setTeachers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch teachers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentTeacher({ ...currentTeacher, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentTeacher.teacher_id) {
        await api.put('teachers', currentTeacher.teacher_id, currentTeacher);
      } else {
        await api.post('teachers', currentTeacher);
      }
      setCurrentTeacher({
        first_name: '',
        last_name: '',
        email: '',
        department: '',
      });
      setIsEditing(false);
      fetchTeachers();
    } catch (err) {
      setError('Failed to save teacher');
      console.error(err);
    }
  };

  const handleEdit = (teacher: Teacher) => {
    setCurrentTeacher(teacher);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await api.delete('teachers', id);
        fetchTeachers();
      } catch (err) {
        setError('Failed to delete teacher');
        console.error(err);
      }
    }
  };

  const handleCancel = () => {
    setCurrentTeacher({
      first_name: '',
      last_name: '',
      email: '',
      department: '',
    });
    setIsEditing(false);
  };

  if (loading && teachers.length === 0) return <div>Loading...</div>;

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h2>Teacher Management</h2>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <div className="form-container">
        <h3>{isEditing ? 'Edit Teacher' : 'Add New Teacher'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input
              name="first_name"
              value={currentTeacher.first_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              name="last_name"
              value={currentTeacher.last_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={currentTeacher.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input
              name="department"
              value={currentTeacher.department}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="btn-save">
            {isEditing ? 'Update' : 'Save'}
          </button>
          {isEditing && (
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <table className="crud-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.teacher_id}>
              <td>{`${teacher.first_name} ${teacher.last_name}`}</td>
              <td>{teacher.email}</td>
              <td>{teacher.department}</td>
              <td>
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(teacher)}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => teacher.teacher_id && handleDelete(teacher.teacher_id)}
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

export default TeacherManager;
